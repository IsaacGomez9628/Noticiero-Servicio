<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Muestra el dashboard principal del usuario.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Dashboard');
    }

    /**
     * Muestra la página para crear eventos (solo visual por ahora).
     *
     * @return \Inertia\Response
     */
    public function createEvent()
    {
        return Inertia::render('Dashboard/CreateEvent');
    }

    /**
     * Muestra la página para crear noticias (solo visual por ahora).
     *
     * @return \Inertia\Response
     */
    public function createNews()
    {
        return Inertia::render('Dashboard/CreateNews');
    }

    public function panel()
    {
    // Aquí podrías cargar datos reales para el panel
    // Por ejemplo, contar eventos, noticias, etc.
    
    return Inertia::render('Dashboard/PanelControl');
    }
}