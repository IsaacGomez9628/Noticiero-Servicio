<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\EmailVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class VerificationController extends Controller
{
    /**
     * The email verification service.
     *
     * @var \App\Services\EmailVerificationService
     */
    protected $emailVerificationService;

    /**
     * Create a new controller instance.
     *
     * @param \App\Services\EmailVerificationService $emailVerificationService
     */
    public function __construct(EmailVerificationService $emailVerificationService)
    {
        $this->emailVerificationService = $emailVerificationService;
        // Quitar middleware auth para permitir acceso a usuarios recién registrados
        // $this->middleware('auth');
    }

    /**
     * Show the verification notice.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Inertia\Response
     */
    public function notice(Request $request)
    {
        // Intenta obtener el email desde la sesión
        $email = $request->session()->get('email', '');
        
        // Si no hay email en la sesión, intentar obtenerlo desde la URL
        if (empty($email)) {
            $email = $request->get('email', '');
        }
        
        // También puede estar en flash data
        if (empty($email)) {
            $email = session('email', '');
        }
        
        Log::info('VerificationController@notice - Email: ' . $email);
        
        return Inertia::render('Auth/VerifyEmail', [
            'email' => $email,
            'success' => session('success'),
            'error' => session('error'),
            'verification_token' => session('verification_token'),
        ]);
    }

    /**
     * Verify the email with token.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verify(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'token' => 'required|string|size:5',
        ]);

        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return back()->with('error', 'Usuario no encontrado.');
        }

        try {
            $verified = $this->emailVerificationService->verifyToken($user, $request->token);
            
            if ($verified) {
                return redirect()->route('login')
                    ->with('success', 'Correo verificado exitosamente. Ahora puedes iniciar sesión.');
            }

            return back()->with('error', 'El código de verificación es inválido o ha expirado.');
        } catch (\Exception $e) {
            Log::error('Error during verification: ' . $e->getMessage());
            return back()->with('error', 'Ocurrió un error durante la verificación. Por favor intenta nuevamente.');
        }
    }

    /**
     * Resend the verification email.
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function resend(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();
        
        if (!$user) {
            return back()->with('error', 'Usuario no encontrado.');
        }

        if ($user->email_verified) {
            return redirect()->route('login')
                ->with('success', 'Tu correo ya ha sido verificado. Puedes iniciar sesión.');
        }

        try {
            $this->emailVerificationService->sendVerificationEmail($user);
            
            return back()->with('success', 'Nuevo código de verificación enviado. Por favor revisa tu correo.');
        } catch (\Exception $e) {
            Log::error('Error resending verification: ' . $e->getMessage());
            return back()->with('error', 'Ocurrió un error al enviar el código. Por favor intenta nuevamente.');
        }
    }
}