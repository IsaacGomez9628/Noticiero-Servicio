<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Muestra la página de inicio de sesión
     */
    public function login() {
        return Inertia::render('Auth/Login');
    }

    /**
     * Muestra la página de registro
     */
    public function signup() {
        return Inertia::render('Auth/SignUp');
    }
}