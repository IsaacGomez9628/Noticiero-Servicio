<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\Empresa;
use App\Models\AsistenciaEvento;
use App\Models\Status;
use App\Models\Usuario;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
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

            // Verificar si el usuario está autenticado
            $usuarioAutenticado = null;
            $esEmpresa = false;
            $empresa = null;

            if (Auth::check()) {
                $usuarioAutenticado = Auth::user();
                $esEmpresa = $usuarioAutenticado->tipoUsuario->nombre === 'Institucional';
                
                // Si es usuario institucional, obtenemos su empresa
                if ($esEmpresa && session('empresa_id')) {
                    $empresa = Empresa::find(session('empresa_id'));
                }
            }
                
            return Inertia::render('RegistroEvento', [
                'evento' => $evento,
                'empresas' => $empresas,
                'usuarioAutenticado' => $usuarioAutenticado,
                'esEmpresa' => $esEmpresa,
                'empresa' => $empresa
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error al mostrar formulario de registro: ' . $e->getMessage());
            return redirect()->route('eventos.index')
                ->with('error', 'Ha ocurrido un error al cargar el formulario de registro.');
        }
    }
    
    /**
     * Procesa el registro de asistencia para usuarios personales
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
                    'descripcion' => 'Estado pendiente para asistencias',
                    'tipo' => 'evento',
                    'eliminado' => false
                ]);
            }
            
            // Iniciar transacción
            DB::beginTransaction();
            
            // Verificar usuario autenticado
            $usuarioId = null;
            if (Auth::check()) {
                $usuarioId = Auth::id();
            }
            
            // Registrar asistente principal (titular)
            $asistenciaTitular = AsistenciaEvento::create([
                'evento_id' => $evento->id,
                'usuario_id' => $usuarioId,
                'empresa_id' => $validated['es_empresa'] ? $validated['empresa_id'] : null,
                'status_id' => $statusPendiente->id,
                'nombre' => $validated['nombre'],
                'email' => $validated['email'],
                'es_titular' => true,
                'asistio' => false,
                'fecha_registro' => now(),
                'fecha_confirmacion' => null,
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
                        'fecha_confirmacion' => null,
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
     * Procesa el registro de asistencia empresarial/institucional
     */
    public function registrarInstitucional(Request $request, $id)
    {
        try {
            // Validar datos
            $validated = $request->validate([
                'empresa_id' => 'required|exists:empresas,id',
                'asistentes' => 'required|array|min:1',
                'asistentes.*.nombre' => 'required|string|max:255',
                'asistentes.*.email' => 'nullable|email|max:255',
                'asistentes.*.cargo' => 'nullable|string|max:255',
            ]);
            
            // Obtener evento
            $evento = Evento::findOrFail($id);
            
            // Validar capacidad del evento
            if ($evento->capacidad !== null) {
                $asistentesActuales = AsistenciaEvento::where('evento_id', $evento->id)
                    ->where('eliminado', false)
                    ->count();
                
                $nuevosAsistentes = count($validated['asistentes']);
                
                if ($asistentesActuales + $nuevosAsistentes > $evento->capacidad) {
                    return redirect()->back()
                        ->with('error', 'No hay suficiente capacidad disponible para registrar a todos los asistentes.');
                }
            }
            
            // Obtener status "Pendiente" para asistencias
            $statusPendiente = Status::where('nombre', 'Pendiente')->first();
            if (!$statusPendiente) {
                // Si no existe, crear el status
                $statusPendiente = Status::create([
                    'nombre' => 'Pendiente',
                    'descripcion' => 'Estado pendiente para asistencias',
                    'tipo' => 'evento',
                    'eliminado' => false
                ]);
            }
            
            // Iniciar transacción
            DB::beginTransaction();
            
            // Obtener información de la empresa
            $empresa = Empresa::findOrFail($validated['empresa_id']);
            
            // Registrar asistentes de la empresa
            foreach ($validated['asistentes'] as $index => $asistente) {
                AsistenciaEvento::create([
                    'evento_id' => $evento->id,
                    'usuario_id' => $index === 0 ? Auth::id() : null, // Asignar usuario solo al primer asistente
                    'empresa_id' => $empresa->id,
                    'status_id' => $statusPendiente->id,
                    'nombre' => $asistente['nombre'],
                    'email' => $asistente['email'] ?? null,
                    'es_titular' => $index === 0, // El primer asistente es titular
                    'asistio' => false,
                    'fecha_registro' => now(),
                    'fecha_confirmacion' => null,
                ]);
            }
            
            DB::commit();
            
            // Redireccionar con mensaje de éxito
            return redirect()->route('eventos.show', $id)
                ->with('success', '¡Registro exitoso! Hemos recibido la solicitud de asistencia para los representantes de su institución.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al registrar asistencia institucional: ' . $e->getMessage());
            
            return redirect()->back()->withInput()
                ->with('error', 'Ha ocurrido un error al procesar el registro. Por favor, intenta nuevamente.');
        }
    }
    
    /**
     * Lista de asistentes para administradores
     */
    public function listarAsistentes($id)
    {
        // Verificar permisos de administrador
        if (!Auth::check() || !Auth::user()->esAdmin()) {
            return redirect()->route('eventos.show', $id)
                ->with('error', 'No tienes permisos para acceder a esta sección.');
        }
        
        $evento = Evento::with(['direccion', 'status', 'multimedia', 'organizador.persona'])
            ->findOrFail($id);
            
        $asistentes = AsistenciaEvento::with(['usuario.persona', 'empresa', 'status'])
            ->where('evento_id', $id)
            ->where('eliminado', false)
            ->orderBy('es_titular', 'desc')
            ->orderBy('fecha_registro', 'asc')
            ->get();
            
        // Agrupar asistentes por empresa
        $asistentesAgrupados = $asistentes->groupBy('empresa_id');
        
        return Inertia::render('Admin/AsistentesEvento', [
            'evento' => $evento,
            'asistentes' => $asistentes,
            'asistentesAgrupados' => $asistentesAgrupados
        ]);
    }
    
    /**
     * Actualiza el estado de asistencia
     */
    public function actualizarAsistencia(Request $request, $id, $asistenciaId)
    {
        // Verificar permisos de administrador
        if (!Auth::check() || !Auth::user()->esAdmin()) {
            return redirect()->route('eventos.show', $id)
                ->with('error', 'No tienes permisos para acceder a esta función.');
        }
        
        $asistencia = AsistenciaEvento::where('evento_id', $id)
            ->findOrFail($asistenciaId);
            
        // Actualizar el campo de asistencia
        $asistencia->asistio = $request->asistio;
        $asistencia->save();
        
        return redirect()->back()
            ->with('success', 'Estado de asistencia actualizado correctamente.');
    }
}