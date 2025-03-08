<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Inertia\Inertia;

class EventoController extends Controller
{
    public function index()
    {
        // Aquí puedes cargar los datos que necesites
        // Por ejemplo: $eventos = Evento::all();

        // Renderiza el componente React llamado Evento.jsx
        return Inertia::render('Evento');
        
        // Si necesitas pasar datos:
        // return Inertia::render('Eventi', [
        //     'eventos' => $eventos
        // ]);
    }
    
    // Otros métodos...
}