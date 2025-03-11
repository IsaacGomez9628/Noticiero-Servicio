<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\Empresa;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;

class EventoController extends Controller
{
    public function index()
    {
        try {
            $eventos = Evento::with(['direccion', 'status', 'multimedia', 'organizador.persona'])
                ->where('eliminado', false)
                ->orderBy('fecha_inicio', 'asc')
                ->get();

            $success = true;

            return Inertia::render('Eventos', compact('id', 'eventos', 'success'));
        } catch (\Exception $e) {
            // Registrar el error para depuración
            Log::error('Error en EventoController@index: ' . $e->getMessage());
            
            return Inertia::render('Eventos', [
                'eventos' => [],
                'success' => false,
                'errorMessage' => 'Ha ocurrido un error al cargar los eventos.'
            ]);
        }
    }
    
    public function show($id)
    {
        $evento = Evento::with(['direccion.calle', 'direccion.ciudad', 'status', 
                                'multimedia', 'organizador.persona'])
            ->findOrFail($id);
            
        return Inertia::render('EventoDetalle', [
            'evento' => $evento
        ]);
    }
    
    public function showRegistrationForm($id)
    {
        $evento = Evento::with(['direccion', 'status', 'multimedia', 'organizador.persona'])
            ->findOrFail($id);
            
        $empresas = Empresa::where('eliminado', false)
            ->orderBy('nombre')
            ->get();
            
        return Inertia::render('RegistroEvento', [
            'evento' => $evento,
            'empresas' => $empresas
        ]);
    }
}