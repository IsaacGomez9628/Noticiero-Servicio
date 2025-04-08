<?php

namespace App\Services;

use App\Models\User;
use App\Models\EmailVerificationToken;
use App\Mail\EmailVerification;
use Carbon\Carbon;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Log;

class EmailVerificationService
{
    /**
     * Generate a random 5-digit token
     *
     * @return string
     */
    public function generateToken(): string
    {
        return str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
    }

    /**
     *
     * @param User $user
     * @return string Token created
     */
    public function createToken(User $user): string
    {
        $token = $this->generateToken();

        $expiresAt = Carbon::now()->addHours(24);

        EmailVerificationToken::where('user_id', $user->id)->delete();

        EmailVerificationToken::create([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => $expiresAt
        ]);
        
        return $token;
    }

    /**
     * Send a verification email to the user
     *
     * @param User $user
     * @return void
     */
    public function sendVerificationEmail(User $user): void
    {
        try {

            $token = $this->createToken($user);
            
            Mail::to($user->email)
                ->send(new EmailVerification($user, $token));
            
            Log::info("Verification email sent to {$user->email} with token {$token}");
        } catch (\Exception $e) {
            Log::error("Failed to send verification email to {$user->email}: {$e->getMessage()}");
            throw $e;
        }
    }

    /**
     * Verify a token for a user
     *
     * @param string $email User's email
     * @param string $token Token to verify
     * @return bool Whether verification was successful
     */
    public function verifyToken(string $email, string $token): bool
    {
        $user = User::where('email', $email)->first();
        
        if (!$user) {
            Log::warning("Verification attempt failed: User with email {$email} not found");
            return false;
        }
        
        $verificationToken = EmailVerificationToken::where('user_id', $user->id)
            ->where('token', $token)
            ->first();
        
        if (!$verificationToken) {
            Log::warning("Verification attempt failed: Invalid token for user {$email}");
            return false;
        }
        
        if ($verificationToken->isExpired()) {
            Log::warning("Verification attempt failed: Token expired for user {$email}");
            return false;
        }
        
        $user->markEmailAsVerified();
  
        $verificationToken->delete();
        
        Log::info("User {$email} verified successfully");
        
        return true;
    }
}