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
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RolController;
use App\Http\Controllers\Admin\StatusController;

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
        ->name('eventos.asistencia.cancelar');
    
    // Cierre de sesión
    Route::post('/logout', [LoginController::class, 'logout'])
        ->name('logout');
});

// Rutas de administración separadas del catch-all final
Route::prefix('admin')->group(function () {
    // Ruta pública para la página de login
    Route::get('/login', function () {
        return Inertia::render('Admin/AdminLoginCheck');
    })->name('admin.login');
    
    // Ruta pública para la página de creación de nuevo administrador
    Route::get('/create', function () {
        return Inertia::render('Admin/AdminCreateForm');
    })->name('admin.create');
    
    // Rutas API públicas para administración
    Route::get('/check', [AdminAuthController::class, 'checkAdmin']);
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/create-first', [AdminAuthController::class, 'createFirstAdmin']);
    Route::post('/create', [AdminAuthController::class, 'createAdmin']);
    
    // Ruta para verificar autenticación actual
    Route::get('/check-auth', [AdminAuthController::class, 'checkAdminAuth'])
        ->middleware('auth:sanctum');
    
    // Dashboard de admin
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/AdminDashboard');
    })->name('admin.dashboard');
    
    // Rutas protegidas que requieren autenticación de administrador
    Route::middleware(['auth:sanctum'])->group(function () {
        // Obtener información del admin actual
        Route::get('/me', [AdminAuthController::class, 'getCurrentAdmin']);
        
        // Cerrar sesión
        Route::post('/logout', [AdminAuthController::class, 'logout']);
        
        // Rutas para gestión de usuarios
        Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
        Route::get('/users/list', [UserController::class, 'list'])->name('admin.users.list');
        Route::get('/users/create', [UserController::class, 'create'])->name('admin.users.create');
        Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
        Route::get('/users/{id}', [UserController::class, 'show'])->name('admin.users.show');
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
        Route::put('/users/{id}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/users/{id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
        
        // Rutas para gestión de roles
        Route::get('/roles/list', [RolController::class, 'list'])->name('admin.roles.list');
        Route::get('/roles', [RolController::class, 'index'])->name('admin.roles.index');
        Route::get('/roles/create', [RolController::class, 'create'])->name('admin.roles.create');
        Route::post('/roles', [RolController::class, 'store'])->name('admin.roles.store');
        Route::get('/roles/{id}', [RolController::class, 'show'])->name('admin.roles.show');
        Route::get('/roles/{id}/edit', [RolController::class, 'edit'])->name('admin.roles.edit');
        Route::put('/roles/{id}', [RolController::class, 'update'])->name('admin.roles.update');
        Route::delete('/roles/{id}', [RolController::class, 'destroy'])->name('admin.roles.destroy');
        
        // Rutas para gestión de estados
        Route::get('/statuses/{type}', [StatusController::class, 'getByType'])->name('admin.statuses.byType');
        Route::get('/statuses/user', [StatusController::class, 'getUserStatuses'])->name('admin.statuses.user');
        Route::get('/statuses/event', [StatusController::class, 'getEventStatuses'])->name('admin.statuses.event');
        Route::post('/statuses', [StatusController::class, 'store'])->name('admin.statuses.store');
        Route::put('/statuses/{id}', [StatusController::class, 'update'])->name('admin.statuses.update');
        Route::delete('/statuses/{id}', [StatusController::class, 'destroy'])->name('admin.statuses.destroy');
        
        // Rutas existentes para eventos en el panel de administración
        Route::get('/events', function () {
            return Inertia::render('Admin/Events/Index');
        })->name('admin.events');
        
        // Rutas para gestión de eventos y asistencias
        Route::get('/eventos/{id}/asistentes', [EventoAsistenciaController::class, 'listarAsistentes'])
            ->name('admin.eventos.asistentes');
        
        Route::patch('/eventos/{id}/asistentes/{asistenciaId}', [EventoAsistenciaController::class, 'actualizarAsistencia'])
            ->name('admin.eventos.asistencia.actualizar');
    });
});

// Ruta para cualquier otra URL que debería ser manejada por React Router
// Importante: debe estar al final de todas las demás rutas
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');