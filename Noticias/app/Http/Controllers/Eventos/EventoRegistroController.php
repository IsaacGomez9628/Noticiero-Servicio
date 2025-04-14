<?php

namespace App\Http\Controllers;
// C:\Noticiero-Servicio\Noticias\app\Http\Controllers\Eventos\EventoRegistroController.php
use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EventoRegistroController extends Controller
{
    /**
     * Muestra el formulario de registro para el evento
     */
    public function showRegistroForm($id)
    {
        try {
            // Verificar si el evento existe
            $evento = Event::findOrFail($id);

            // Obtener el número de registros existentes
            $totalRegistrados = EventAttendance::where('evento_id', $id)
                ->where('eliminado', false)
                ->count();

            // Calcular cupos disponibles
            $cuposDisponibles = max(0, $evento->capacity - $totalRegistrados);

            // Obtener información del usuario autenticado si existe
            $user = Auth::check() ? Auth::user() : null;
            $esEmpresa = false;
            $empresaId = null;

            if ($user && $user->tipoUsuario->nombre === 'Institucional') {
                $esEmpresa = true;
                $empresaId = session('empresa_id');
            }

            return Inertia::render('EventoRegistro', [
                'evento' => [
                    'id' => $evento->id,
                    'titulo' => $evento->titule,
                    'fecha' => $evento->start_date,
                    'hora' => $evento->start_time,
                    'capacidad' => $evento->capacity,
                    'registrados' => $totalRegistrados,
                    'disponibles' => $cuposDisponibles
                ],
                'auth' => [
                    'user' => $user ? [
                        'id' => $user->id,
                        'nombre' => $user->persona->nombreCompleto(),
                        'email' => $user->email,
                        'esEmpresa' => $esEmpresa,
                        'empresaId' => $empresaId
                    ] : null
                ],
                'maxAsistentes' => min(5, $cuposDisponibles)
            ]);

        } catch (\Exception $e) {
            Log::error('Error al mostrar formulario de registro: ' . $e->getMessage());

            return Inertia::render('Error', [
                'message' => 'No se pudo cargar el formulario de registro.',
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Procesa el registro de asistentes al evento
     */
    public function registrarAsistentes(Request $request, $id)
    {
        // Validar datos básicos
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'es_empresa' => 'boolean',
            'empresa_id' => 'nullable|required_if:es_empresa,true|exists:empresas,id',
            'numero_asistentes' => 'required|integer|min:1',
            'asistentes' => 'required|array',
            'asistentes.*.nombre' => 'required|string|max:255',
            'asistentes.*.email' => 'nullable|email|max:255',
        ]);

        try {
            // Iniciar transacción
            DB::beginTransaction();

            // Obtener evento
            $evento = Event::findOrFail($id);

            // Verificar capacidad disponible
            $totalRegistrados = EventAttendance::where('evento_id', $id)
                ->where('eliminado', false)
                ->count();

            $cuposDisponibles = max(0, $evento->capacity - $totalRegistrados);

            // Validar que el número de asistentes no exceda los cupos disponibles
            if (count($validated['asistentes']) > $cuposDisponibles) {
                return back()->withErrors([
                    'numero_asistentes' => "No hay suficientes cupos disponibles. Solo quedan {$cuposDisponibles} cupos."
                ])->withInput();
            }

            // Obtener estado para asistentes
            $statusPendiente = Status::where('nombre', 'Pendiente')
                ->where('tipo', 'asistencia')
                ->first();

            if (!$statusPendiente) {
                $statusPendiente = Status::create([
                    'nombre' => 'Pendiente',
                    'descripcion' => 'Asistencia pendiente de confirmación',
                    'tipo' => 'asistencia',
                    'eliminado' => false
                ]);
            }

            // Registrar asistente principal
            $asistenciaPrincipal = EventAttendance::create([
                'evento_id' => $evento->id,
                'usuario_id' => Auth::check() ? Auth::id() : null,
                'empresa_id' => $validated['es_empresa'] ? $validated['empresa_id'] : null,
                'status_id' => $statusPendiente->id,
                'nombre' => $validated['nombre'],
                'email' => $validated['email'],
                'es_titular' => true,
                'asistio' => false,
                'fecha_registro' => now(),
                'eliminado' => false
            ]);

            // Registrar asistentes adicionales
            foreach ($validated['asistentes'] as $index => $asistente) {
                // El primer elemento ya se registró como titular
                if ($index === 0) continue;

                if (!empty($asistente['nombre'])) {
                    EventAttendance::create([
                        'evento_id' => $evento->id,
                        'usuario_id' => null,
                        'empresa_id' => $validated['es_empresa'] ? $validated['empresa_id'] : null,
                        'status_id' => $statusPendiente->id,
                        'nombre' => $asistente['nombre'],
                        'email' => $asistente['email'] ?? null,
                        'es_titular' => false,
                        'asistio' => false,
                        'fecha_registro' => now(),
                        'eliminado' => false,
                        'registro_principal_id' => $asistenciaPrincipal->id  // Referencia al registro principal
                    ]);
                }
            }

            DB::commit();

            // Redireccionar a la página de confirmación
            return redirect()->route('eventos.registro.confirmacion', ['id' => $evento->id])
                ->with('success', '¡Registro exitoso! Tu lugar ha sido reservado.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar asistentes: ' . $e->getMessage());

            return back()->withErrors([
                'general' => 'Ocurrió un error al procesar tu registro. Por favor, intenta de nuevo.'
            ])->withInput();
        }
    }

    /**
     * Muestra la confirmación de registro exitoso
     */
    public function confirmacion($id)
    {
        $evento = Event::findOrFail($id);

        return Inertia::render('RegistroConfirmacion', [
            'evento' => [
                'id' => $evento->id,
                'titulo' => $evento->titule,
                'fecha' => $evento->start_date,
                'hora' => $evento->start_time
            ]
        ]);
    }
}
