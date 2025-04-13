<?php

namespace App\Mail;

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
     * El usuario o email al que se le envía el correo.
     *
     * @var mixed
     */
    public $user;

    /**
     * El token de verificación.
     *
     * @var string
     */
    public $token;

    /**
     * Crear una nueva instancia del mensaje.
     *
     * @param mixed $user  Usuario o email para verificación
     * @param string $token
     * @return void
     */
    public function __construct($user, string $token)
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