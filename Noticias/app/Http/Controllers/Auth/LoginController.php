<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Usuario;
use App\Models\Empresa;
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
        return Inertia::render('Auth/Login', [
            'status' => session('status')
        ]);
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
        $usuario = Usuario::where('email', $request->email)
            ->where('eliminado', false)
            ->first();

        if (!$usuario) {
            return redirect()->back()
                ->withErrors(['email' => 'No se encontró un usuario con este correo electrónico.'])
                ->withInput();
        }

        // Verificar si el usuario está bloqueado
        if ($usuario->bloqueado) {
            return redirect()->back()
                ->withErrors(['email' => 'Esta cuenta ha sido bloqueada. Por favor contacte al administrador.'])
                ->withInput();
        }

        // Verificar si el usuario está activo según su status
        if ($usuario->status->nombre !== 'Activo') {
            return redirect()->back()
                ->withErrors(['email' => 'Esta cuenta no está activa. Por favor contacte al administrador.'])
                ->withInput();
        }

        // Verificar contraseña
        if (!Hash::check($usuario->salt . $request->password, $usuario->password)) {
            // Incrementar intentos fallidos
            $usuario->intentos_fallidos_contraseña += 1;
            
            // Bloquear cuenta después de 5 intentos fallidos
            if ($usuario->intentos_fallidos_contraseña >= 5) {
                $usuario->bloqueado = true;
            }
            
            $usuario->save();
            
            return redirect()->back()
                ->withErrors(['password' => 'La contraseña es incorrecta.'])
                ->withInput();
        }

        // Reiniciar contador de intentos fallidos
        $usuario->intentos_fallidos_contraseña = 0;
        $usuario->ultima_autenticacion = now();
        $usuario->save();

        // Iniciar sesión
        Auth::login($usuario, $request->remember);

        // Verificar si es usuario institucional y cargar datos de empresa
        if ($usuario->tipoUsuario->nombre === 'Institucional') {
            // Buscar empresa relacionada con el contacto del usuario
            $empresa = Empresa::whereHas('contacto', function($query) use ($usuario) {
                $query->where('persona_id', $usuario->persona_id);
            })->first();

            if ($empresa) {
                // Guardar ID de la empresa en la sesión
                session(['empresa_id' => $empresa->id]);
            }
        }

        // Redireccionar según el tipo de usuario
        return redirect()->intended(route('dashboard'));
    }

    /**
     * Cierra la sesión del usuario
     */
    public function logout(Request $request)
    {
        Auth::logout();
        
        $request->session()->invalidate();
        $request->session()->regenerateToken();
        
        return redirect()->route('login');
    }
}