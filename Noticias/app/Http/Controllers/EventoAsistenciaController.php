<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\Status;
use Inertia\Inertia;

class EventoAsistenciaController extends Controller
{
    /**
     * Muestra las asistencias del usuario actual
     */
    public function misAsistencias()
    {
        $user = Auth::user();

        // Obtener asistencias personales
        $asistencias = EventAttendance::where('user_id', $user->id)
            ->with(['event.location', 'status'])
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('EventsAttendance', [
            'eventAttendances' => $asistencias,
            'auth' => [
                'user' => $user,
            ]
        ]);
    }

    /**
     * Permite a un usuario cancelar su asistencia a un evento
     * Actualiza la capacidad del evento al cancelar
     */
    public function cancelarAsistencia($asistenciaId)
    {
        try {
            DB::beginTransaction();

            $user = Auth::user();
            $asistencia = EventAttendance::findOrFail($asistenciaId);

            // Verificar que la asistencia pertenezca al usuario
            if ($asistencia->user_id !== $user->id) {
                return redirect()->back()->with('error', 'No tienes permiso para cancelar esta asistencia.');
            }

            // Obtener el evento para actualizar capacidad
            $evento = Event::findOrFail($asistencia->event_id);

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

            // Actualizar status de la asistencia
            $asistencia->status_id = $status->id;
            $asistencia->save();

            // Registrar en el log la cancelación
            Log::info('Asistencia cancelada', [
                'user_id' => $user->id,
                'event_id' => $evento->id,
                'attendance_id' => $asistencia->id
            ]);

            DB::commit();

            return redirect()->route('eventos.mis-asistencias')
                ->with('success', 'Tu inscripción ha sido cancelada correctamente. Se ha liberado un cupo en el evento.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al cancelar asistencia: ' . $e->getMessage());

            return redirect()->back()
                ->with('error', 'Ocurrió un error al cancelar tu inscripción. Por favor, intenta nuevamente.');
        }
    }

    /**
     * Muestra el formulario de registro para un evento según el tipo de usuario
     */
    public function showRegistrationForm(Request $request, $eventId)
    {
        $event = Event::with(['location'])->findOrFail($eventId);
        $user = Auth::user();

        if (!$user) {
            // Si el usuario no está autenticado, redireccionar a login
            return redirect()->route('login')
                ->with('message', 'Debes iniciar sesión para registrarte en este evento.');
        }

        // Verificar si el usuario ya está registrado para este evento
        $existingRegistration = EventAttendance::where('event_id', $eventId)
            ->where('user_id', $user->id)
            ->whereHas('status', function($query) {
                $query->where('slug', '!=', 'cancelado');
            })
            ->first();

        if ($existingRegistration) {
            return redirect()->route('eventos.mis-asistencias')
                ->with('message', 'Ya estás registrado para este evento. Puedes ver tus asistencias aquí.');
        }

        // Verificar disponibilidad de cupos
        $registeredAttendees = EventAttendance::where('event_id', $eventId)
            ->whereHas('status', function($query) {
                $query->where('slug', '!=', 'cancelado');
            })
            ->count();

        $availableSpots = $event->capacity - $registeredAttendees;

        if ($availableSpots <= 0) {
            return redirect()->route('eventos.index')
                ->with('error', 'Lo sentimos, este evento ha alcanzado su capacidad máxima.');
        }

        // Renderizar formulario de registro
        return Inertia::render('RegistroEventos', [
            'evento' => $event,
            'auth' => [
                'user' => $user,
            ],
            'availableSpots' => $availableSpots
        ]);
    }

    /**
     * Procesa el registro a un evento
     */
    public function register(Request $request, $eventId)
    {
        if (!Auth::check()) {
            return redirect()->route('login')
                ->with('message', 'Debes iniciar sesión para registrarte en este evento.');
        }

        $event = Event::findOrFail($eventId);
        $user = Auth::user();

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
            Log::info('Iniciando registro de usuario', [
                'user_id' => $user->id,
                'event_id' => $eventId,
                'request_data' => $request->all()
            ]);

            // Validar datos
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

            // Registrar al usuario
            $attendance = new EventAttendance();
            $attendance->event_id = $event->id;
            $attendance->user_id = $user->id;
            $attendance->nombre = $validated['nombre'];
            $attendance->email = $validated['email'];
            $attendance->telefono = $validated['telefono'] ?? null;
            $attendance->tipo_registro = 'personal';
            $attendance->status_id = $status->id;
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

            // Actualizar contador de registrados en el evento (opcional)
            $event->registered_attendees = $asistenciasConfirmadas + 1;
            $event->save();

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
