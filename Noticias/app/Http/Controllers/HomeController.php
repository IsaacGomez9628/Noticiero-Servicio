<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function index()
{
    // Primero prueba esto (funciona según lo que mencionas)
    // return 'Hola Mundo';
    
    // Luego intenta con Inertia
    return Inertia::render('Welcome');
}
}
