<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

use Illuminate\Routing\Controller as BaseController;

class RegistroController extends BaseController
{
    /**
     * Servicio de verificación de email
     *
     * @var \App\Services\EmailVerificationService
     */
    protected $emailVerificationService;

    /**
     * Crear una nueva instancia de controlador.
     *
     * @param EmailVerificationService $emailVerificationService
     * @return void
     */
    public function __construct(EmailVerificationService $emailVerificationService)
    {
        $this->emailVerificationService = $emailVerificationService;
        $this->middleware('guest');
    }

    /**
     * Mostrar la página principal de registro
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        return Inertia::render('Auth/Registro');
    }

    /**
     * Mostrar el formulario de registro personal
     *
     * @return \Inertia\Response
     */
    public function createPersonal()
    {
        return Inertia::render('Auth/RegistroPersonal');
    }

    /**
     * Guardar un nuevo registro personal
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storePersonal(Request $request)
    {
        $request->validate([
            'nombres' => 'required|string|max:255',
            'apellido_paterno' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            Log::info('Iniciando registro personal para: ' . $request->email);
            
            // Crear el usuario
            $user = User::create([
                'nombre' => $request->nombres,
                'apellido' => $request->apellido_paterno . ' ' . $request->apellido_materno,
                'email' => $request->email,
                'status_id' => 1, // Activo
                'salt' => bin2hex(random_bytes(16)),
                'password' => Hash::make($request->password),
                'email_verified' => false,
            ]);
            
            Log::info('Usuario creado con ID: ' . $user->id);

            // Enviar email de verificación (ahora maneja internamente si la vista no existe)
            $this->emailVerificationService->sendVerificationEmail($user);
            
            // Verificar si tenemos un token en la sesión (respaldo)
            $fallbackToken = session('verification_token');
            
            // Guardar el email en la sesión
            session()->put('email', $user->email);
            
            // Asegurar que la redirección incluya el email
            return redirect()->route('verification.notice', ['email' => $user->email])
                ->with('email', $user->email)
                ->with('verification_token', $fallbackToken) // Pasamos el token como mensaje flash
                ->with('success', 'Registro exitoso. Por favor verifica tu correo electrónico.');
                
        } catch (\Exception $e) {
            Log::error('Error en registro: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            return back()->withInput()
                ->with('error', 'Ocurrió un error durante el registro. Por favor intenta nuevamente.');
        }
    }
    /**
     * Mostrar el formulario de registro institucional
     *
     * @return \Inertia\Response
     */
    public function createInstitucional()
    {
        return Inertia::render('Auth/RegistroInstitucional');
    }

    /**
     * Guardar un nuevo registro institucional
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function storeInstitucional(Request $request)
    {
        $request->validate([
            'nombre_empresa' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
        ]);

        try {
            // Crear el usuario institucional
            $user = User::create([
                'nombre_institucion' => $request->nombre_empresa,
                'nombre' => $request->nombre_responsable,
                'apellido' => $request->apellido_paterno . ' ' . $request->apellido_materno,
                'email' => $request->email,
                'status_id' => 1, // Activo
                'salt' => bin2hex(random_bytes(16)),
                'password' => Hash::make($request->password),
                'email_verified' => false,
                'es_institucional' => true,
            ]);

            // Enviar email de verificación
            $this->emailVerificationService->sendVerificationEmail($user);

            // Redirigir a la página de verificación
            return redirect()->route('verification.notice')
                ->with('email', $user->email)
                ->with('success', 'Registro exitoso. Por favor verifica tu correo electrónico.');
        } catch (\Exception $e) {
            Log::error('Error en registro institucional: ' . $e->getMessage());
            return back()->withInput()
                ->with('error', 'Ocurrió un error durante el registro. Por favor intenta nuevamente.');
        }
    }
}