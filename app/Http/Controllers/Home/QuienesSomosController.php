<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuienesSomosController extends Controller
{
    public function index() {
        return Inertia::render('MiembrosPage');
    }
}
