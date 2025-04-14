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
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Eventos\EventController as EventosEventController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\EnsureEmailIsVerified;
use App\Mail\EmailVerification;
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

// Rutas que requieren autenticación
Route::middleware(['auth'])->group(function () {
    // Formulario de registro a eventos (con verificación manual en el controlador)
    Route::get('/evento/{id}/registro', [EventoAsistenciaController::class, 'showRegistrationForm'])
        ->name('eventos.registro.form');

    // Procesar registros
    Route::post('/evento/{id}/registro', [EventoAsistenciaController::class, 'register'])
        ->name('eventos.registro');

    Route::post('/evento/{id}/registro/institucional', [EventoAsistenciaController::class, 'registrarInstitucional'])
        ->name('eventos.registro.institucional');

    // Ver asistencias del usuario
    Route::get('/mis-asistencias', [EventoAsistenciaController::class, 'misAsistencias'])
        ->name('eventos.mis-asistencias');

    // Cancelar asistencia
    Route::post('/asistencia/{id}/cancelar', [EventoAsistenciaController::class, 'cancelarAsistencia'])
        ->name('eventos.asistencia.cancelar');

    // Página de confirmación
    Route::get('/evento/{id}/confirmacion', [EventoAsistenciaController::class, 'showConfirmation'])
        ->name('eventos.confirmacion');
});


// Rutas de compatibilidad (para mantener enlaces antiguos)
Route::get('/eventos/{id}', function($id) {
    return redirect()->route('eventos.show', $id);
});
Route::get('/evento/{id}/detalles', [EventosEventController::class, 'show'])->name('eventos.show');
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


// Rutas para administradores
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/eventos/{id}/asistentes', [EventoAsistenciaController::class, 'listarAsistentes'])->name('admin.eventos.asistentes');
});

// Otras rutas
Route::get('/noticias', [NoticiaController::class, 'index'])->name('noticias');



 // Rutas para usuarios autenticados
Route::middleware(['auth', EnsureEmailIsVerified::class])->group(function () {
    // Dashboard y sus funcionalidades
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');

    // Gestión de eventos - Aquí usamos DashboardController solo para las vistas
    Route::get('/dashboard/crear-evento', [DashboardController::class, 'createEvent'])
        ->name('dashboard.crear-evento');

    Route::get('/dashboard/panel', [DashboardController::class, 'panel'])
        ->name('dashboard.panel');

    // Si posteriormente implementas funcionalidad real:
    Route::post('/eventos', [EventosEventController::class, 'store'])
        ->name('eventos.store');

    Route::get('/eventos/{id}/editar', [EventosEventController::class, 'edit'])
        ->name('eventos.edit');

    Route::put('/eventos/{id}', [EventosEventController::class, 'update'])
        ->name('eventos.update');

    Route::delete('/eventos/{id}', [EventosEventController::class, 'destroy'])
        ->name('eventos.destroy');

    // Gestión de noticias - Aquí usamos DashboardController para las vistas
    Route::get('/dashboard/crear-noticia', [DashboardController::class, 'createNews'])
        ->name('dashboard.crear-noticia');

    // Si posteriormente implementas funcionalidad real:
    Route::post('/noticias', [NoticiaController::class, 'store'])
        ->name('noticias.store');

    Route::get('/noticias/{id}/editar', [NoticiaController::class, 'edit'])
        ->name('noticias.edit');

    Route::put('/noticias/{id}', [NoticiaController::class, 'update'])
        ->name('noticias.update');

    Route::delete('/noticias/{id}', [NoticiaController::class, 'destroy'])
        ->name('noticias.destroy');

    // Rutas para editar perfil
    Route::get('/perfil/editar', [ProfileController::class, 'edit'])
        ->name('perfil.edit');

    Route::post('/perfil/actualizar', [ProfileController::class, 'update'])
        ->name('perfil.update');

     // Registro de eventos (formulario y procesamiento)
     Route::get('/evento/{id}/registro', [EventoAsistenciaController::class, 'showRegistrationForm'])
     ->name('eventos.registro.form');

    // Procesar registro personal
    Route::post('/evento/{id}/registro', [EventoAsistenciaController::class, 'register'])
        ->name('eventos.registro');

    // Procesar registro institucional
    Route::post('/evento/{id}/registro/institucional', [EventoAsistenciaController::class, 'registrarInstitucional'])
        ->name('eventos.registro.institucional');

    // Página de confirmación de registro
    Route::get('/evento/{id}/confirmacion', [EventoAsistenciaController::class, 'showConfirmation'])
        ->name('eventos.confirmacion');

    // Listar mis asistencias
    Route::get('/mis-asistencias', [EventoAsistenciaController::class, 'misAsistencias'])
        ->name('eventos.mis-asistencias');

    // Cancelar asistencia
    Route::post('/asistencia/{id}/cancelar', [EventoAsistenciaController::class, 'cancelarAsistencia'])
    ->name('eventos.asistencia.cancelar')
    ->middleware('auth');

    // Cierre de sesión
    Route::post('/logout', [LoginController::class, 'logout'])
        ->name('logout');

    // Rutas para registro de asistentes a eventos (institucional)
    Route::post('/eventos/{id}/registro/institucional',
        [App\Http\Controllers\EventoAsistenciaController::class, 'registrarInstitucional'])
        ->name('eventos.registro.institucional');
});

// Rutas para administradores
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    // Listado de asistentes
    Route::get('/eventos/{id}/asistentes', [EventoAsistenciaController::class, 'listarAsistentes'])
        ->name('admin.eventos.asistentes');

    Route::get('/eventos/{id}/asistentes',
        [App\Http\Controllers\EventoAsistenciaController::class, 'listarAsistentes'])
        ->name('eventos.asistentes');

        Route::patch('/eventos/{id}/asistentes/{asistenciaId}', [EventoAsistenciaController::class, 'actualizarAsistencia'])
        ->name('admin.eventos.asistencia.actualizar');

});

// Ruta para cualquier otra URL que debería ser manejada por React Router
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');

// Route::get('/test-mail', function () {
//     Mail::to('gr27271593@gmail.com')->send(new EmailVerification());
//     return 'Correo enviado';
// });
