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
        // Validar datos (mantén esta parte igual)
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
            'remember' => 'boolean',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        // Buscar usuario por email (mantén esta parte igual)
        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return redirect()->back()
                ->withErrors(['email' => 'No se encontró un usuario con este correo electrónico.'])
                ->withInput();
        }

        // Verificar contraseña (mantén esta parte igual)
        if (!Hash::check($request->password, $user->password)) {
            return redirect()->back()
                ->withErrors(['password' => 'La contraseña es incorrecta.'])
                ->withInput();
        }

        // Iniciar sesión (mantén esta parte igual)
        Auth::login($user, $request->remember ?? false);

        // CAMBIA ESTA PARTE: Redireccionar a donde estaba el usuario
        if ($request->has('redirect')) {
            return redirect($request->redirect);
        }

        // Si hay una URL guardada en la sesión, usar esa
        if ($request->session()->has('url.intended')) {
            return redirect()->intended();
        }

        // Redirección predeterminada
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

        if ($request->wantsJson() || $request->header('X-Inertia')) {
            return redirect()->route('welcome');
        }

        return redirect()->route('welcome', ['logout_success' => 'true'])
                     ->with('success', 'Has cerrado sesión correctamente.')
                     ->with('auth.user', null);;
    }
}
