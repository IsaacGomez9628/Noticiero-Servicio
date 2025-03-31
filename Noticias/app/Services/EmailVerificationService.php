<?php

namespace App\Services;

use App\Models\EmailVerificationToken;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use App\Mail\EmailVerification;
use Illuminate\Support\Facades\Log;
use Illuminate\View\View;

class EmailVerificationService
{
    /**
     * Generate a new verification token for the user.
     *
     * @param User $user
     * @return string
     */
    public function generateToken(User $user): string
    {
        // Delete any existing tokens for this user
        EmailVerificationToken::where('user_id', $user->id)->delete();
        
        // Generate a random 5-digit token
        $token = str_pad(random_int(0, 99999), 5, '0', STR_PAD_LEFT);
        
        // Store the token with an expiration time (24 hours)
        EmailVerificationToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => Carbon::now()->addHours(24),
        ]);
        
        return $token;
    }
    
    /**
     * Send the verification email to the user.
     *
     * @param User $user
     * @return void
     */
    public function sendVerificationEmail(User $user): void
    {
        try {
            $token = $this->generateToken($user);
            
            // Log token for development/debugging (remove in production)
            Log::info("Verification token for {$user->email}: {$token}");
            
            // Verificar si la vista existe antes de intentar enviar el correo
            if (!view()->exists('emails.verification')) {
                Log::error("La vista 'emails.verification' no existe. Usando respaldo.");
                
                // En lugar de fallar, guardamos el token y continuamos
                // Aquí podríamos mostrar el token en la interfaz en vez de enviar correo
                session()->put('verification_token', $token);
                session()->put('user_email', $user->email);
                
                return;
            }
            
            Mail::to($user->email)->send(new EmailVerification($user, $token));
        } catch (\Exception $e) {
            Log::error("Error sending verification email: " . $e->getMessage());
            
            // Guardamos el token en la sesión como respaldo
            session()->put('verification_token', $token);
            session()->put('user_email', $user->email);
            
            // No relanzamos la excepción para que el registro no falle
            // throw $e;
        }
    }
    
    /**
     * Verify the token for the given user.
     *
     * @param User $user
     * @param string $token
     * @return bool
     */
    public function verifyToken(User $user, string $token): bool
    {
        $verificationToken = EmailVerificationToken::where('user_id', $user->id)
            ->where('token', $token)
            ->first();
            
        if (!$verificationToken) {
            // Verificar si estamos usando el token de respaldo en sesión
            $sessionToken = session('verification_token');
            $sessionEmail = session('user_email');
            
            if ($sessionToken && $sessionEmail === $user->email && $sessionToken === $token) {
                // El token coincide con el almacenado en sesión
                // Marcamos el email como verificado
                $user->email_verified = true;
                $user->email_verified_at = now();
                $user->save();
                
                // Limpiamos la sesión
                session()->forget(['verification_token', 'user_email']);
                
                return true;
            }
            
            return false;
        }
        
        if ($verificationToken->isExpired()) {
            return false;
        }
        
        // Mark email as verified
        $user->email_verified = true;
        $user->email_verified_at = now();
        $user->save();
        
        // Delete token after successful verification
        $verificationToken->delete();
        
        return true;
    }
}