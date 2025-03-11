<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\Empresa;
use App\Models\AsistenciaEvento;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;

class EventoController extends Controller
{
    public function index()
    {
        try {
            // Obtener eventos activos
            $eventos = Evento::with(['direccion', 'status', 'multimedia', 'organizador.persona'])
                ->where('eliminado', false)
                ->orderBy('fecha_inicio', 'asc')
                ->get();
                
            // Obtener empresas activas para el formulario de registro
            $empresas = Empresa::where('eliminado', false)
                ->orderBy('nombre')
                ->get();
                
            return Inertia::render('Eventos', [
                'eventos' => $eventos,
                'empresas' => $empresas,
                'success' => true,
                'auth' => [
                    'user' => Auth::user() ? [
                        'id' => Auth::user()->id,
                        'nombre' => Auth::user()->nombre, // Ajusta según tu estructura de datos
                        'email' => Auth::user()->email,
                    ] : null
                ]
            ]);
        } catch (\Exception $e) {
            // Registrar el error para depuración
            Log::error('Error en EventoController@index: ' . $e->getMessage());
            
            return Inertia::render('Eventos', [
                'eventos' => [],
                'empresas' => [],
                'success' => false,
                'errorMessage' => 'Ha ocurrido un error al cargar los eventos.',
                'auth' => [
                    'user' => Auth::user() ? [
                        'id' => Auth::user()->id,
                        'nombre' => Auth::user()->nombre,
                        'email' => Auth::user()->email,
                    ] : null
                ]
            ]);
        }
    }
    
    public function show($id)
    {
        try {
            $evento = Evento::with(['direccion.calle', 'direccion.ciudad', 'status', 
                                'multimedia', 'organizador.persona'])
                ->findOrFail($id);
                
            return Inertia::render('EventoDetalle', [
                'evento' => $evento,
                'auth' => [
                    'user' => Auth::user() ? [
                        'id' => Auth::user()->id,
                        'nombre' => Auth::user()->nombre,
                        'email' => Auth::user()->email,
                    ] : null
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error en EventoController@show: ' . $e->getMessage());
            
            return redirect()->route('eventos.index')
                ->with('error', 'No se pudo cargar el detalle del evento.');
        }
    }
    
    // Este método ya no es necesario ya que ahora usamos el modal
    // pero lo mantenemos por compatibilidad por ahora
    public function showRegistrationForm($id)
    {
        try {
            $evento = Evento::with(['direccion', 'status', 'multimedia', 'organizador.persona'])
                ->findOrFail($id);
                
            $empresas = Empresa::where('eliminado', false)
                ->orderBy('nombre')
                ->get();
                
            return Inertia::render('RegistroEvento', [
                'evento' => $evento,
                'empresas' => $empresas,
                'auth' => [
                    'user' => Auth::user() ? [
                        'id' => Auth::user()->id,
                        'nombre' => Auth::user()->nombre,
                        'email' => Auth::user()->email,
                    ] : null
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error en EventoController@showRegistrationForm: ' . $e->getMessage());
            
            return redirect()->route('eventos.index')
                ->with('error', 'No se pudo cargar el formulario de registro.');
        }
    }
    
    // Método para mostrar el historial de asistencias del usuario actual
    public function historialAsistencias()
    {
        try {
            // Verificar que el usuario esté autenticado
            if (!Auth::check()) {
                return redirect()->route('login');
            }
            
            // Obtener las asistencias del usuario actual usando el modelo de AsistenciaEvento
            $asistencias = AsistenciaEvento::with(['evento', 'status'])
                ->where('usuario_id', Auth::id())
                ->where('eliminado', false)
                ->orderBy('fecha_registro', 'desc')
                ->get();
                
            return Inertia::render('HistorialAsistencias', [
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
            Log::error('Error en EventoController@historialAsistencias: ' . $e->getMessage());
            
            return redirect()->route('eventos.index')
                ->with('error', 'No se pudo cargar tu historial de asistencias.');
        }
    }
}