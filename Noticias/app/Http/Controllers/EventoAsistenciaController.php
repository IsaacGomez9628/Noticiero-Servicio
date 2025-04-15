<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\Status;
use App\Models\Company;
use App\Models\User;
use App\Models\Rol;
use Inertia\Inertia;

class EventoAsistenciaController extends Controller
{
    /**
     * Muestra el formulario de registro para un evento según el tipo de usuario
     */
    public function showRegistrationForm(Request $request, $eventId)
    {
        $event = Event::with(['location'])->findOrFail($eventId);
        $user = User::find(Auth::id());
        
        if (!$user) {
            // Si el usuario no está autenticado, redireccionar a login
            return redirect()->route('login')
                ->with('message', 'Debes iniciar sesión para registrarte en este evento.');
        }
        
        // Verificar si el usuario ya está registrado para este evento (para usuarios personales)
        $existingRegistration = EventAttendance::where('event_id', $eventId)
            ->where('user_id', $user->id)
            ->whereHas('status', function($query) {
                $query->where('slug', '!=', 'cancelado');
            })
            ->first();
        
        $yaRegistrado = $existingRegistration ? true : false;
        
        // Verificar si el usuario es institucional
        $isInstitutional = $user->isInstitutional();
        
        // Si es usuario institucional, obtener sus empresas
        $empresas = [];
        if ($isInstitutional) {
            $empresas = $user->companies()->get();
            
            // Si no tiene empresas registradas, sugerir que complete su perfil
            if (count($empresas) == 0) {
                return redirect()->route('perfil.edit')
                    ->with('message', 'Debes registrar al menos una empresa antes de registrarte como institución.');
            }
            
            // Renderizar formulario para usuario institucional
            return Inertia::render('RegistroEventoInstitucional', [
                'evento' => $event,
                'empresas' => $empresas,
                'auth' => [
                    'user' => $user,
                ],
                'yaRegistrado' => $yaRegistrado
            ]);
        } else {
            // Renderizar formulario para usuario personal
            return Inertia::render('RegistroEventos', [
                'evento' => $event,
                'auth' => [
                    'user' => $user,
                ],
                'isPersonal' => true, // Añadir flag para indicar que es usuario personal
                'yaRegistrado' => $yaRegistrado
            ]);
        }
    }
    
    /**
     * Procesa el registro personal a un evento
     */
    public function register(Request $request, $eventId)
    {
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('message', 'Debes iniciar sesión para registrarte en este evento.');
        }

        $event = Event::findOrFail($eventId);
        $user = Auth::user();
        
        // Verificar si es usuario institucional
        $isInstitutional = $user->isInstitutional();
        
        if ($isInstitutional) {
            // Redireccionar a la ruta de registro institucional
            return redirect()->route('eventos.registro.form', $eventId)
                ->with('error', 'Como usuario institucional, debes usar el formulario de registro institucional.');
        }

        // Verificar disponibilidad
        $asistenciasConfirmadas = EventAttendance::where('event_id', $eventId)
            ->whereHas('status', function($query) {
                $query->where('slug', '!=', 'cancelado');
            })
            ->count();
        
        if ($asistenciasConfirmadas >= $event->capacity) {
            return redirect()->back()
                ->with('error', 'Lo sentimos, este evento ha alcanzado su capacidad máxima.');
        }

        // Verificar si ya está registrado
        $existingRegistration = EventAttendance::where('event_id', $eventId)
            ->where('user_id', $user->id)
            ->whereHas('status', function($query) {
                $query->where('slug', '!=', 'cancelado');
            })
            ->first();
            
        if ($existingRegistration) {
            return redirect()->back()
                ->with('error', 'Ya te has registrado para este evento.')
                ->with('notification', [
                    'type' => 'error',
                    'message' => 'Ya te has registrado para este evento.'
                ]);
        }

        try {
            // Log para debugging
            Log::info('Iniciando registro de usuario personal', [
                'user_id' => $user->id,
                'event_id' => $eventId,
                'request_data' => $request->all()
            ]);
            
            // Para usuarios personales, la validación es más simple
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'telefono' => 'nullable|string|max:20',
            ]);
            
            // Obtener el status de confirmado
            $status = Status::where('type', 'asistencia')
                ->where('slug', 'confirmado')
                ->first();
                
            if (!$status) {
                // Si no existe el status, buscar por tipo
                $status = Status::where('type', 'asistencia')->first();
                
                if (!$status) {
                    // Si aún no encontramos un status, crear uno temporal
                    $status = new Status();
                    $status->id = 1;
                    $status->name = 'Confirmado';
                    $status->slug = 'confirmado';
                    $status->type = 'asistencia';
                    $status->save();
                    
                    Log::info('Status creado automáticamente', [
                        'status_id' => $status->id
                    ]);
                }
            }
            
            // Registrar al usuario principal (usuario personal)
            $attendance = new EventAttendance();
            $attendance->event_id = $event->id;
            $attendance->user_id = $user->id;
            $attendance->nombre = $validated['nombre'];
            $attendance->email = $validated['email'];
            $attendance->telefono = $validated['telefono'] ?? null;
            $attendance->tipo_registro = 'personal';
            $attendance->status_id = $status->id;
            $attendance->company_id = null;
            $attendance->codigo_registro = $this->generarCodigoRegistro();
            $attendance->ip_registro = $request->ip();
            $attendance->user_agent = $request->userAgent();
            
            // Log antes de guardar
            Log::info('Intentando guardar registro personal', [
                'attendance_data' => $attendance->toArray()
            ]);
            
            $attendance->save();
            
            Log::info('Registro guardado exitosamente', [
                'attendance_id' => $attendance->id
            ]);
            
            // Para usuarios personales, no procesamos asistentes adicionales
            
            return redirect()->route('eventos.confirmacion', $event->id)
                ->with('success', 'Tu registro ha sido confirmado.')
                ->with('registro', $attendance);
                
        } catch (\Exception $e) {
            Log::error('Error al registrar asistencia', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return redirect()->back()
                ->with('error', 'Ocurrió un error al procesar tu registro: ' . $e->getMessage())
                ->with('notification', [
                    'type' => 'error',
                    'message' => 'Ocurrió un error al procesar tu registro.'
                ]);
        }
    }

    
    /**
     * Procesa el registro institucional a un evento
     */
    public function registrarInstitucional(Request $request, $eventId)
    {
        if (!Auth::check()) {
            return redirect()->route('login', ['redirect' => route('eventos.show', $eventId)])
                ->with('message', 'Debes iniciar sesión para registrarte en este evento.');
        }

        $user = Auth::user();
        $event = Event::findOrFail($eventId);
        
        // Verificar si el usuario es institucional
        if (!$user->isInstitutional()) {
            return redirect()->back()
                ->with('error', 'No tienes permisos para realizar un registro institucional.');
        }

        // Verificar si ya ha registrado asistentes para este evento
        $existingRegistration = EventAttendance::where('event_id', $eventId)
            ->where('user_id', $user->id)
            ->where('tipo_registro', 'institucional')
            ->whereNull('deleted_at')
            ->first();
            
        if ($existingRegistration) {
            return redirect()->route('eventos.mis-asistencias')
                ->with('message', 'Ya has registrado asistentes para este evento. Puedes ver tus asistencias aquí.');
        }

        // Validar datos de la institución
        $validated = $request->validate([
            'empresa_id' => 'required|exists:companies,id',
            'asistentes' => 'required|array|min:1',
            'asistentes.*.nombre' => 'required|string|max:255',
            'asistentes.*.email' => 'nullable|email|max:255',
            'asistentes.*.cargo' => 'nullable|string|max:255',
        ]);
        
        // Obtener la empresa
        $company = Company::findOrFail($request->empresa_id);
        
        // Verificar que la empresa pertenezca al usuario
        if ($company->user_id !== $user->id) {
            return redirect()->back()->with('error', 'No tienes permiso para registrar asistentes para esta empresa.');
        }
        
        // Obtener el status de confirmado
        $status = Status::where('type', 'asistencia')
            ->where('slug', 'confirmado')
            ->first();
            
        if (!$status) {
            // Si no existe el status, usar el primer status activo
            $status = Status::where('active', true)->first();
            
            if (!$status) {
                // Si no hay status, crear uno temporal
                $status = Status::create([
                    'name' => 'Confirmado',
                    'slug' => 'confirmado',
                    'type' => 'asistencia',
                    'active' => true
                ]);
            }
        }
        
        // Registrar cada asistente
        $registeredCount = 0;
        $mainAttendance = null;
        
        foreach ($validated['asistentes'] as $index => $asistenteData) {
            // Verificar si este asistente ya está registrado
            $existingAttendee = null;
            if (isset($asistenteData['email']) && $asistenteData['email']) {
                $existingAttendee = EventAttendance::where('event_id', $event->id)
                    ->where('email', $asistenteData['email'])
                    ->whereNull('deleted_at')
                    ->first();
            }
            
            if ($existingAttendee) continue;
            
            // Crear el registro de asistencia
            $attendance = new EventAttendance();
            $attendance->event_id = $event->id;
            $attendance->user_id = $user->id;
            $attendance->nombre = $asistenteData['nombre'];
            $attendance->email = $asistenteData['email'] ?? null;
            $attendance->telefono = $asistenteData['telefono'] ?? null;
            $attendance->tipo_registro = 'institucional';
            $attendance->status_id = $status->id;
            $attendance->institution_id = $company->id; // Vinculamos con la empresa
            
            // Guardar información adicional como JSON
            if (isset($asistenteData['cargo'])) {
                $attendance->informacion_adicional = json_encode(['cargo' => $asistenteData['cargo']]);
            }
            
            $attendance->codigo_registro = $this->generarCodigoRegistro();
            $attendance->ip_registro = $request->ip();
            $attendance->user_agent = $request->userAgent();
            $attendance->save();
            
            // Guardar la primera asistencia como principal
            if ($index === 0) {
                $mainAttendance = $attendance;
            }
            
            $registeredCount++;
        }
        
        if ($registeredCount === 0) {
            return redirect()->back()->with('error', 'Todos los asistentes ya estaban registrados para este evento.');
        }
        
        return redirect()->route('eventos.confirmacion', $event->id)
            ->with('success', "Se han registrado $registeredCount asistentes correctamente.")
            ->with('registro', $mainAttendance);
    }
    
    /**
     * Muestra la página de confirmación de registro
     */
    public function showConfirmation($eventId)
    {
        $event = Event::findOrFail($eventId);
        $registro = session('registro');
        
        return Inertia::render('RegistroConfirmado', [
            'evento' => $event,
            'registro' => $registro
        ]);
    }
    
    /**
     * Muestra las asistencias del usuario actual
     */
    public function misAsistencias()
    {
        $user = User::find(Auth::id());
        
        // Obtener asistencias personales
        $asistencias = EventAttendance::where('user_id', $user->id)
            ->with(['event', 'status'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Si es usuario institucional, obtener también las asistencias de su empresa
        $asistenciasInstitucionales = collect();
        
        // Verificar si el usuario es institucional
        $isInstitutional = false;
        if (method_exists($user, 'isInstitutional')) {
            $isInstitutional = $user->isInstitutional();
        } else {
            $userRoles = $user->roles()->pluck('id')->toArray();
            $isInstitutional = in_array(6, $userRoles);
        }
        
        if ($isInstitutional) {
            // Obtener IDs de empresas del usuario
            $empresasIds = [];
            if (method_exists($user, 'companies')) {
                $empresasIds = $user->companies()->pluck('id');
            } else {
                $empresasIds = Company::where('user_id', $user->id)->pluck('id');
            }
            
            if (count($empresasIds) > 0) {
                $asistenciasInstitucionales = EventAttendance::whereIn('institution_id', $empresasIds)
                    ->whereNot('user_id', $user->id)  // Excluir al usuario para evitar duplicados
                    ->with(['event', 'status'])
                    ->orderBy('created_at', 'desc')
                    ->get();
            }
        }
        
        return Inertia::render('Events.EventAttendance', [
            'asistencias' => $asistencias,
            'asistenciasInstitucionales' => $asistenciasInstitucionales,
        ]);
    }
    
    /**
     * Permite a un usuario cancelar su asistencia a un evento
     */
    public function cancelarAsistencia($asistenciaId)
    {
        $user = Auth::user();
        $asistencia = EventAttendance::findOrFail($asistenciaId);
        
        // Verificar que la asistencia pertenezca al usuario
        if ($asistencia->user_id !== $user->id) {
            return redirect()->back()->with('error', 'No tienes permiso para cancelar esta asistencia.');
        }
        
        // Obtener el status de cancelado
        $status = Status::where('type', 'asistencia')
            ->where('slug', 'cancelado')
            ->first();
            
        if (!$status) {
            // Si no existe, crear uno
            $status = Status::create([
                'name' => 'Cancelado',
                'slug' => 'cancelado',
                'type' => 'asistencia',
                'description' => 'Asistencia cancelada por el usuario',
                'color' => '#EF4444',
                'active' => true,
                'order' => 3
            ]);
        }
    
        $asistencia->status_id = $status->id;
        $asistencia->save();
        
        return redirect()->back()->with('success', 'Tu asistencia ha sido cancelada.');
    }
    
    /**
     * Generar un código de registro único
     */
    protected function generarCodigoRegistro()
    {
        $codigo = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        
        // Verificar que el código no exista
        while (EventAttendance::where('codigo_registro', $codigo)->exists()) {
            $codigo = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        }
        
        return $codigo;
    }
}