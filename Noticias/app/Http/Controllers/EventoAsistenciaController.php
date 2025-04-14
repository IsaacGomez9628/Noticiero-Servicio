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
        
        // Verificar si el usuario es institucional (tiene el rol 6)
        $isInstitutional = false;
        
        // Método 1: Si el método isInstitutional existe, úsalo
        if (method_exists($user, 'isInstitutional')) {
            $isInstitutional = $user->isInstitutional();
        }
        // Método 2: Verificar manualmente si tiene el rol 6
        else {
            $userRoles = $user->roles()->pluck('id')->toArray();
            $isInstitutional = in_array(6, $userRoles);
        }
        
        // Si es usuario institucional, obtener sus empresas
        $empresas = [];
        if ($isInstitutional) {
            // Método 1: Si existe la relación companies, úsala
            if (method_exists($user, 'companies')) {
                $empresas = $user->companies()->get();
            } 
            // Método 2: Buscar empresas manualmente
            else {
                $empresas = Company::where('user_id', $user->id)->get();
            }
            
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
                ]
            ]);
        } else {
            // Renderizar formulario para usuario personal
            return Inertia::render('RegistroEventos', [
                'evento' => $event,
                'empresas' => [], // Enviamos arreglo vacío para mantener consistencia
                'auth' => [
                    'user' => $user,
                ]
            ]);
        }
    }
    
    /**
 * Procesa el registro personal a un evento
 */
public function register(Request $request, $eventId)
{

    $event = Event::findOrFail($eventId);

    $asistenciasConfirmadas = EventAttendance::where('event_id', $eventId)
        ->whereHas('status', function($query) {
            $query->where('slug', '!=', 'cancelado');
        })
        ->count();
    
    if ($asistenciasConfirmadas >= $event->capacity) {
        return redirect()->back()
            ->with('error', 'Lo sentimos, este evento ha alcanzado su capacidad máxima.');
    }


    try {
        $user = Auth::user();
        $event = Event::findOrFail($eventId);
        
        // Log para debugging
        Log::info('Iniciando registro de usuario', [
            'user_id' => $user->id,
            'event_id' => $eventId,
            'request_data' => $request->all()
        ]);
        
        // Validar datos básicos
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'telefono' => 'nullable|string|max:20',
            'numero_asistentes' => 'integer|min:1|max:5',
            'asistentes' => 'nullable|array',
            'asistentes.*.nombre' => 'required|string|max:255',
            'asistentes.*.email' => 'nullable|email|max:255',
        ]);
        
        // Verificar si ya está registrado
        $existingRegistration = EventAttendance::where('event_id', $event->id)
            ->where('email', $request->email)
            ->whereNull('deleted_at')
            ->first();
            
        if ($existingRegistration) {
            Log::info('Usuario ya registrado al evento', [
                'user_id' => $user->id,
                'event_id' => $eventId,
                'registration_id' => $existingRegistration->id
            ]);
            
            return redirect()->back()
                ->with('error', 'Ya te has registrado para este evento.')
                ->with('notification', [
                    'type' => 'error',
                    'message' => 'Ya te has registrado para este evento.'
                ]);
        }
        
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
        
        // Registrar al usuario principal
        $attendance = new EventAttendance();
        $attendance->event_id = $event->id;
        $attendance->user_id = $user->id;
        $attendance->nombre = $request->nombre;
        $attendance->email = $request->email;
        $attendance->telefono = $request->telefono ?? null;
        $attendance->tipo_registro = 'personal';
        $attendance->status_id = $status->id;
        // Usar company_id en lugar de institution_id
        $attendance->company_id = null;
        $attendance->codigo_registro = $this->generarCodigoRegistro();
        $attendance->ip_registro = $request->ip();
        $attendance->user_agent = $request->userAgent();
        
        // Log antes de guardar
        Log::info('Intentando guardar registro', [
            'attendance_data' => $attendance->toArray()
        ]);
        
        $attendance->save();
        
        Log::info('Registro guardado exitosamente', [
            'attendance_id' => $attendance->id
        ]);
        
        // Si hay asistentes adicionales, registrarlos también
        if (isset($validated['asistentes']) && is_array($validated['asistentes']) && count($validated['asistentes']) > 0) {
            foreach ($validated['asistentes'] as $i => $asistenteData) {
                // Saltar el primer asistente, que es el mismo usuario
                if ($i === 0) continue;
                
                // Verificar si este asistente ya está registrado
                $existingAttendee = EventAttendance::where('event_id', $event->id)
                    ->where('email', $asistenteData['email'])
                    ->whereNull('deleted_at')
                    ->first();
                    
                if ($existingAttendee) continue;
                
                // Registrar asistente adicional
                $additionalAttendance = new EventAttendance();
                $additionalAttendance->event_id = $event->id;
                $additionalAttendance->user_id = $user->id; // El mismo usuario es responsable
                $additionalAttendance->nombre = $asistenteData['nombre'];
                $additionalAttendance->email = $asistenteData['email'] ?? null;
                $additionalAttendance->telefono = $asistenteData['telefono'] ?? null;
                $additionalAttendance->tipo_registro = 'personal_adicional';
                $additionalAttendance->status_id = $status->id;
                // Usar company_id en lugar de institution_id
                $additionalAttendance->company_id = null;
                $additionalAttendance->codigo_registro = $this->generarCodigoRegistro();
                $additionalAttendance->ip_registro = $request->ip();
                $additionalAttendance->user_agent = $request->userAgent();
                $additionalAttendance->save();
                
                Log::info('Asistente adicional registrado', [
                    'attendance_id' => $additionalAttendance->id
                ]);
            }
        }
        
        return redirect()->route('eventos.confirmacion', $event->id)
            ->with('success', 'Tu registro ha sido confirmado.')
            ->with('registro', $attendance);
            
    } catch (\Exception $e) {
        Log::error('Error al registrar asistencia', [
            'error' => $e->getMessage(),
            'trace' => $e->getTraceAsString()
        ]);
        
        return redirect()->back()
            ->with('error', 'Ocurrió un error al procesar tu registro. Por favor, intenta nuevamente o contacta a soporte.')
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
        $user = Auth::user();
        $event = Event::findOrFail($eventId);
        
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
                $status = new Status();
                $status->id = 1;
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
    // En EventoAsistenciaController.php
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
     * Lista los asistentes registrados para un evento (vista admin)
     */
    public function listarAsistentes($eventId)
    {
        $event = Event::findOrFail($eventId);
        
        // Obtener todos los asistentes para este evento
        $asistentes = EventAttendance::where('event_id', $event->id)
            ->with(['user', 'status', 'institution'])
            ->orderBy('created_at', 'desc')
            ->get();
            
        // Agrupar por tipo de registro (personal/institucional)
        $asistentesPersonales = $asistentes->where('tipo_registro', 'personal');
        $asistentesInstitucionales = $asistentes->where('tipo_registro', 'institucional');
        
        return Inertia::render('Admin/AsistentesEvento', [
            'evento' => $event,
            'asistentesPersonales' => $asistentesPersonales,
            'asistentesInstitucionales' => $asistentesInstitucionales,
            'totalAsistentes' => $asistentes->count(),
        ]);
    }
    
    /**
     * Actualiza el estado de una asistencia (admin)
     */
    public function actualizarAsistencia(Request $request, $eventId, $asistenciaId)
    {
        $request->validate([
            'status_id' => 'required|exists:statuses,id',
        ]);
        
        $asistencia = EventAttendance::findOrFail($asistenciaId);
        
        // Verificar que la asistencia pertenezca al evento
        if ($asistencia->event_id != $eventId) {
            return redirect()->back()->with('error', 'La asistencia no pertenece a este evento.');
        }
        
        $asistencia->status_id = $request->status_id;
        $asistencia->save();
        
        return redirect()->back()->with('success', 'Estado de asistencia actualizado.');
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