<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Muestra la página de inicio de sesión
     */
    public function login(Request $request) {
        // Capturar la URL de redirección si existe
        $redirect = $request->query('redirect', '/');
        
        return Inertia::render('Auth/Login', [
            'redirect' => $redirect
        ]);
    }

    /**
     * Procesa el inicio de sesión
     */
    public function authenticate(Request $request) {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials)) {
            $request->session()->regenerate();

            // Redireccionar a la URL original si existe
            return redirect()->intended($request->input('redirect', '/'));
        }

        return back()->withErrors([
            'email' => 'Las credenciales proporcionadas no coinciden con nuestros registros.',
        ]);
    }

    /**
     * Cierra la sesión del usuario
     */
    public function logout(Request $request) {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect('/');
    }

    /**
     * Muestra la página de registro
     */
    public function signup() {
        return Inertia::render('Auth/SignUp');
    }
}