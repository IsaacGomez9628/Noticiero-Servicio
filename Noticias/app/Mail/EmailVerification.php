<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class EmailVerification extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * El usuario al que se le envía el email.
     *
     * @var \App\Models\User
     */
    public $user;

    /**
     * El token de verificación.
     *
     * @var string
     */
    public $token;

    /**
     *
     * @param \App\Models\User $user
     * @param string $token
     * @return void
     */
    public function __construct(User $user, string $token)
    {
        $this->user = $user;
        $this->token = $token;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->view('emails.email-verify')
                    ->with([
                        'user' => $this->user,
                        'token' => $this->token,
                    ]);
    }
}