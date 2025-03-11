<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\Empresa;
use App\Models\AsistenciaEvento;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class EventoAsistenciaController extends Controller
{
    /**
     * Muestra el formulario de registro para un evento
     */
    public function showRegistrationForm($id)
    {
        try {
            // Obtener el evento con sus relaciones
            $evento = Evento::with(['direccion', 'status', 'multimedia', 'organizador.persona'])
                ->where('eliminado', false)
                ->findOrFail($id);
                
            // Verificar que el evento esté activo y programado
            if ($evento->status->nombre !== 'Programado' && $evento->status->nombre !== 'En curso') {
                return redirect()->route('eventos.show', $id)
                    ->with('error', 'No es posible registrarse a este evento en este momento.');
            }
            
            // Obtener empresas activas
            $empresas = Empresa::where('eliminado', false)
                ->orderBy('nombre')
                ->get();
                
            return Inertia::render('RegistroEvento', [
                'evento' => $evento,
                'empresas' => $empresas
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al mostrar formulario de registro: ' . $e->getMessage());
            return redirect()->route('eventos.index')
                ->with('error', 'Ha ocurrido un error al cargar el formulario de registro.');
        }
    }
    
    /**
     * Procesa el registro de asistencia
     */
    public function registrar(Request $request, $id)
    {
        try {
            // Validar datos
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'es_empresa' => 'boolean',
                'empresa_id' => 'nullable|required_if:es_empresa,true|exists:empresas,id',
                'numero_asistentes' => 'required|integer|min:1|max:5',
                'asistentes' => 'required|array',
                'asistentes.*.nombre' => 'required|string|max:255',
                'asistentes.*.email' => 'nullable|email|max:255',
            ]);
            
            // Obtener evento
            $evento = Evento::findOrFail($id);
            
            // Obtener status "Pendiente" para asistencias
            $statusPendiente = Status::where('nombre', 'Pendiente')->first();
            if (!$statusPendiente) {
                // Si no existe, crear el status
                $statusPendiente = Status::create([
                    'nombre' => 'Pendiente',
                    'descripcion' => 'Estado pendiente para asistencias'
                ]);
            }
            
            // Iniciar transacción
            DB::beginTransaction();
            
            // Registrar asistente principal (titular)
            $asistenciaTitular = AsistenciaEvento::create([
                'evento_id' => $evento->id,
                'usuario_id' => null, // Si el usuario está autenticado, usar auth()->id()
                'empresa_id' => $validated['es_empresa'] ? $validated['empresa_id'] : null,
                'status_id' => $statusPendiente->id,
                'nombre' => $validated['nombre'],
                'email' => $validated['email'],
                'es_titular' => true,
                'asistio' => false,
                'fecha_registro' => now(),
                'fecha_actualizacion' => now(),
                'eliminado' => false,
            ]);
            
            // Registrar asistentes adicionales
            foreach ($validated['asistentes'] as $index => $asistente) {
                // Saltar el primer asistente (ya registrado como titular)
                if ($index === 0) continue;
                
                if (!empty($asistente['nombre'])) {
                    AsistenciaEvento::create([
                        'evento_id' => $evento->id,
                        'usuario_id' => null,
                        'empresa_id' => $validated['es_empresa'] ? $validated['empresa_id'] : null,
                        'status_id' => $statusPendiente->id,
                        'nombre' => $asistente['nombre'],
                        'email' => $asistente['email'] ?? null,
                        'es_titular' => false,
                        'asistio' => false,
                        'fecha_registro' => now(),
                        'fecha_actualizacion' => now(),
                        'eliminado' => false,
                    ]);
                }
            }
            
            DB::commit();
            
            // Redireccionar con mensaje de éxito
            return redirect()->route('eventos.show', $id)
                ->with('success', '¡Registro exitoso! Hemos recibido tu solicitud de asistencia.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar asistencia: ' . $e->getMessage());
            
            return redirect()->back()->withInput()
                ->with('error', 'Ha ocurrido un error al procesar tu registro. Por favor, intenta nuevamente.');
        }
    }
    
    /**
     * Lista de asistentes para administradores
     */
    public function listarAsistentes($id)
    {
        // Esta función sería para administradores
        // Implementar posteriormente con verificación de permisos
    }
}