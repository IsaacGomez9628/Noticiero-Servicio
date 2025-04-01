<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LoginController extends Controller
{
    /**
     * Muestra la vista de inicio de sesión
     */
    public function showLoginForm()
    {
        return Inertia::render('Auth/Login');
    }

    /**
     * Procesa el inicio de sesión
     */
    public function login(Request $request)
    {
        // Validar datos
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Buscar usuario por email
        $user = User::where('email', $request->email)->first();
            
        if (!$user) {
            return redirect()->back()
                ->withErrors(['email' => 'No se encontró un usuario con este correo electrónico.'])
                ->withInput();
        }

        // Verificar contraseña
        if (!Hash::check($request->password, $user->password)) {
            return redirect()->back()
                ->withErrors(['password' => 'La contraseña es incorrecta.'])
                ->withInput();
        }

        // Iniciar sesión
        Auth::login($user, $request->remember ?? false);

        // Redireccionar a la página principal
        return redirect()->route('welcome', ['login_success' => 'true'])
                 ->with('success', 'Inicio de sesión exitoso');
    }

    /**
     * Cierra la sesión del usuario
     */
    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('welcome', ['logout_success' => 'true'])
                     ->with('info', 'Sesión cerrada correctamente');
    }
}