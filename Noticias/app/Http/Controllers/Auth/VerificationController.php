<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;

class VerificationController extends Controller
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
    }

    /**
     * Muestra la página de verificación de correo electrónico.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function notice(Request $request)
    {
        $email = $request->session()->get('email', '');
        
        return Inertia::render('Auth/VerifyEmail', [
            'email' => $email,
            'success' => session('success'),
            'error' => session('error'),
            'verification_token' => null, // Only set for testing
        ]);
    }

    /**
     * Verifica el token proporcionado.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verify(Request $request)
    {
        Log::debug('Token recibido:', [
            'token' => $request->token,
            'tipo' => gettype($request->token),
            'valor_raw' => $request->input('token')
        ]);

        $token = (string) $request->input('token');
    
        $request->merge(['token' => $token]);
        
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string|size:5',
        ]);

        $verified = $this->emailVerificationService->verifyToken(
            $request->email,
            $request->token
        );

        if ($verified) {
            return redirect()->route('login')
                ->with('success', 'Correo verificado correctamente. Ahora puedes iniciar sesión.');
        }

        return back()
            ->with('error', 'El código de verificación es inválido o ha expirado.');
    }
    /**
     * Reenvía el email de verificación.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function resend(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return redirect()->back()
                ->with('error', 'No se encontró ningún usuario con ese correo electrónico.');
        }

        if ($user->hasVerifiedEmail()) {
            return redirect()->route('login')
                ->with('success', 'Tu correo electrónico ya ha sido verificado. Puedes iniciar sesión.');
        }

        try {
            $this->emailVerificationService->sendVerificationEmail($user);
            
            return redirect()->back()
                ->with('success', 'Se ha enviado un nuevo código de verificación a tu correo electrónico.');
        } catch (\Exception $e) {
            Log::error('Error al reenviar verificación: ' . $e->getMessage());
            
            return redirect()->back()
                ->with('error', 'Ha ocurrido un error al enviar el correo de verificación.');
        }
    }
}