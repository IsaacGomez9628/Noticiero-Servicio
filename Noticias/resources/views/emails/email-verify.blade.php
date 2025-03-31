@component('mail::message')
# Verificación de Correo Electrónico

Hola {{ $user->nombre ?? $user->email }},

Gracias por registrarte en nuestra plataforma. Para completar tu registro, por favor verifica tu dirección de correo electrónico con el siguiente código:

@component('mail::panel')
<div style="font-size: 24px; text-align: center; letter-spacing: 8px; font-weight: bold;">
{{ $token }}
</div>
@endcomponent

Este código expirará en 24 horas.

Si no solicitaste este código, puedes ignorar este mensaje.

Saludos,<br>
{{ config('app.name') }}
@endcomponent