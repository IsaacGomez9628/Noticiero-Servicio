<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Verificación de Correo Electrónico</title>
    <style>
        /* Your existing styles */
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Verificación de Correo Electrónico</h1>
        </div>
        
        <div class="content">
            <p>Hola {{ $user->person ? $user->person->name : 'usuario' }},</p>
            
            <p>Gracias por registrarte. Para completar tu registro y activar tu cuenta, por favor utiliza el siguiente código de verificación:</p>
            
            <div class="verification-code">
                {{ $token }}
            </div>
            
            <p>Este código expirará en 24 horas por razones de seguridad.</p>
            
            <p>Si no has solicitado este código, puedes ignorar este mensaje.</p>
        </div>
        
        <div class="footer">
            <p>&copy; {{ date('Y') }} CEATyCC. Todos los derechos reservados.</p>
        </div>
    </div>
</body>
</html>