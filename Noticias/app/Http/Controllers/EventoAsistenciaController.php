<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\Empresa;
use App\Models\AsistenciaEvento;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventoAsistenciaController extends Controller
{
    /**
     * Procesa el registro de asistencia
     */
    public function registrar(Request $request, $id)
    {
        try {
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
                'usuario_id' => Auth::check() ? Auth::id() : null,
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
                        'usuario_id' => null, // Asistentes adicionales no están vinculados a usuarios
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
            
            // Responder con éxito (para peticiones AJAX/Inertia)
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => '¡Registro exitoso! Hemos recibido tu solicitud de asistencia.'
                ]);
            }
            
            // Redireccionar con mensaje de éxito (para peticiones normales)
            return redirect()->route('eventos.show', $id)
                ->with('success', '¡Registro exitoso! Hemos recibido tu solicitud de asistencia.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar asistencia: ' . $e->getMessage());
            
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Ha ocurrido un error al procesar tu registro. Por favor, intenta nuevamente.'
                ], 422);
            }
            
            return redirect()->back()->withInput()
                ->with('error', 'Ha ocurrido un error al procesar tu registro. Por favor, intenta nuevamente.');
        }
    }
    
    /**
     * Cancela la asistencia a un evento
     */
    public function cancelarAsistencia(Request $request, $id)
    {
        try {
            // Verificar autenticación
            if (!Auth::check()) {
                return redirect()->route('login');
            }
            
            // Obtener la asistencia
            $asistencia = AsistenciaEvento::where('id', $id)
                ->where('usuario_id', Auth::id())
                ->where('eliminado', false)
                ->firstOrFail();
            
            // Validar razón de cancelación
            $validated = $request->validate([
                'motivo_cancelacion' => 'nullable|string|max:500'
            ]);
            
            // Actualizar registro
            $asistencia->update([
                'eliminado' => true,
                'fecha_eliminacion' => now(),
                'eliminado_por' => Auth::id(),
                'nota_cancelacion' => $validated['motivo_cancelacion'] ?? null
            ]);
            
            // Responder según el tipo de petición
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Tu asistencia ha sido cancelada correctamente.'
                ]);
            }
            
            return redirect()->back()
                ->with('success', 'Tu asistencia ha sido cancelada correctamente.');
                
        } catch (\Exception $e) {
            Log::error('Error al cancelar asistencia: ' . $e->getMessage());
            
            if ($request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No se pudo cancelar tu asistencia. Por favor, intenta nuevamente.'
                ], 422);
            }
            
            return redirect()->back()
                ->with('error', 'No se pudo cancelar tu asistencia. Por favor, intenta nuevamente.');
        }
    }
    
    /**
     * Lista de asistencias del usuario actual
     */
    public function misAsistencias()
    {
        try {
            // Verificar autenticación
            if (!Auth::check()) {
                return redirect()->route('login');
            }
            
            // Obtener asistencias del usuario actual
            $asistencias = AsistenciaEvento::with(['evento', 'status', 'empresa'])
                ->where('usuario_id', Auth::id())
                ->where('eliminado', false)
                ->orderBy('fecha_registro', 'desc')
                ->get();
                
            return Inertia::render('MisAsistencias', [
                'asistencias' => $asistencias,
                'auth' => [
                    'user' => [
                        'id' => Auth::user()->id,
                        'nombre' => Auth::user()->nombre,
                        'email' => Auth::user()->email,
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al obtener asistencias: ' . $e->getMessage());
            
            return redirect()->route('eventos.index')
                ->with('error', 'No se pudo cargar tu historial de asistencias.');
        }
    }
    
    /**
     * Lista de asistentes para administradores
     */
    public function listarAsistentes($id)
    {
        try {
            if (!Auth::check() || !Auth::user()->esAdmin()) {
                return redirect()->route('eventos.index')
                    ->with('error', 'No tienes permiso para acceder a esta sección.');
            }
            
            // Obtener evento
            $evento = Evento::with(['organizador.persona'])
                ->findOrFail($id);
                
            // Obtener asistentes
            $asistentes = AsistenciaEvento::with(['usuario.persona', 'empresa', 'status'])
                ->where('evento_id', $id)
                ->where('eliminado', false)
                ->orderBy('fecha_registro', 'asc')
                ->get();
                
            return Inertia::render('Admin/AsistentesEvento', [
                'evento' => $evento,
                'asistentes' => $asistentes,
                'auth' => [
                    'user' => [
                        'id' => Auth::user()->id,
                        'nombre' => Auth::user()->nombre,
                        'email' => Auth::user()->email,
                    ]
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al listar asistentes: ' . $e->getMessage());
            
            return redirect()->route('admin.eventos')
                ->with('error', 'No se pudo cargar la lista de asistentes.');
        }
    }
}