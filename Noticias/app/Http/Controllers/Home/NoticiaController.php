<?php

namespace App\Http\Controllers\Home;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class NoticiaController extends Controller
{
    public function index() {
        return Inertia::render('Noticias');
    }
}
