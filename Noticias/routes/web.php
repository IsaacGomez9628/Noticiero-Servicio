<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Home\NoticiaController;
use App\Http\Controllers\Home\QuienesSomosController;
use App\Http\Controllers\EventoAsistenciaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegistroController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\Eventos\EventController as EventosEventController;
use Illuminate\Support\Facades\Mail;

// Rutas para vistas principales (renderizan la SPA de React)
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Rutas de Home
Route::get('/home/loMasNuevo', [HomeController::class, 'loMasNuevo'])->name('home.loMasNuevo');
Route::get('/home/Quienes-Somos', [QuienesSomosController::class, 'index'])->name('quienes-somos');

// Rutas para eventos
Route::get('/eventos', [EventosEventController::class, 'index'])->name('eventos.index');

// Nuevas rutas con el formato solicitado
Route::get('/evento/{id}/detalles', [EventosEventController::class, 'show'])->name('eventos.show');
Route::get('/evento/{id}/ubicacion', [EventosEventController::class, 'location'])->name('eventos.location');
Route::get('/evento/{id}/registro', [EventosEventController::class, 'showRegistrationForm'])->name('eventos.registro.form');

// Rutas de compatibilidad (para mantener enlaces antiguos)
Route::get('/eventos/{id}', function($id) {
    return redirect()->route('eventos.show', $id);
});
Route::get('/eventos/{id}/registro', function($id) {
    return redirect()->route('eventos.registro.form', $id);
});

// Rutas para registro
Route::middleware('guest')->group(function () {
    // Rutas de registro
    Route::get('/registro', [RegistroController::class, 'index'])
        ->name('registro');
    
    Route::get('/registro/personal', [RegistroController::class, 'createPersonal'])
        ->name('registro.personal');
    
    Route::post('/registro/personal', [RegistroController::class, 'storePersonal'])
        ->name('registro.personal.store');
    
    Route::get('/registro/institucional', [RegistroController::class, 'createInstitucional'])
        ->name('registro.institucional');
    
    Route::post('/registro/institucional', [RegistroController::class, 'storeInstitucional'])
        ->name('registro.institucional.store');
    
    // Rutas de inicio de sesión
    Route::get('/login', [LoginController::class, 'showLoginForm'])
        ->name('login');
    
    Route::post('/login', [LoginController::class, 'login'])
        ->name('login.store');
        
    // Rutas de verificación de correo - IMPORTANTE: estas deberían ser accesibles para usuarios no autenticados
    Route::get('/email/verify', [VerificationController::class, 'notice'])
        ->name('verification.notice');
        
    Route::post('/email/verify', [VerificationController::class, 'verify'])
        ->name('verification.verify');
        
    Route::post('/email/resend', [VerificationController::class, 'resend'])
        ->name('verification.resend');
});

// Ruta de compatibilidad (para mantener enlaces antiguos)
// Route::get('/eventos/{id}/registro', [EventoController::class, 'showRegistrationForm'])->name('eventos.registro.form');

// Rutas para historial de asistencias (requieren autenticación)
Route::middleware(['auth'])->group(function () {
    Route::get('/mis-asistencias', [EventoAsistenciaController::class, 'misAsistencias'])->name('eventos.mis-asistencias');
    Route::post('/asistencia/{id}/cancelar', [EventoAsistenciaController::class, 'cancelarAsistencia'])->name('eventos.asistencia.cancelar');
});

// Rutas para administradores
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/eventos/{id}/asistentes', [EventoAsistenciaController::class, 'listarAsistentes'])->name('admin.eventos.asistentes');
});

// Otras rutas
Route::get('/noticias', [NoticiaController::class, 'index'])->name('noticias');

// Rutas para usuarios autenticados
Route::middleware('auth')->group(function () {
    // Cierre de sesión
    Route::post('/logout', [LoginController::class, 'logout'])
        ->name('logout');
    
    // Dashboard personal o institucional
    // Route::get('/dashboard', [DashboardController::class, 'index'])
    //     ->name('dashboard');

    // Rutas para registro de asistentes a eventos (institucional)
    Route::post('/eventos/{id}/registro/institucional', 
        [App\Http\Controllers\EventoAsistenciaController::class, 'registrarInstitucional'])
        ->name('eventos.registro.institucional');
    
    // Listado de asistentes (solo para admins)
    Route::get('/eventos/{id}/asistentes', 
        [App\Http\Controllers\EventoAsistenciaController::class, 'listarAsistentes'])
        ->name('eventos.asistentes');
    
    Route::patch('/eventos/{id}/asistentes/{asistenciaId}', 
        [App\Http\Controllers\EventoAsistenciaController::class, 'actualizarAsistencia'])
        ->name('eventos.asistencia.actualizar');
});

// Ruta para cualquier otra URL que debería ser manejada por React Router
// Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');

Route::get('/test-mail', function () {
    $destinatario = 'gr27271593@gmail.com'; // Cambia esto por tu email autorizado en Mailgun
    
    Mail::raw('Este es un mensaje de prueba para verificar la configuración SMTP de Mailgun', function ($message) use ($destinatario) {
        $message->to($destinatario)
            ->subject('Prueba de configuración SMTP');
    });
    
    return 'Correo enviado a ' . $destinatario . '. Por favor revisa tu bandeja de entrada.';
});