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
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\EventController;

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
        
    // Rutas de verificación de correo
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
    
    // Gestión de eventos
    Route::get('/dashboard/crear-evento', [DashboardController::class, 'createEvent'])
        ->name('dashboard.crear-evento');

    Route::get('/dashboard/panel', [DashboardController::class, 'panel'])
        ->name('dashboard.panel');
    
    // Funcionalidad real de eventos
    Route::post('/eventos', [EventosEventController::class, 'store'])
        ->name('eventos.store');
    
    Route::get('/eventos/{id}/editar', [EventosEventController::class, 'edit'])
        ->name('eventos.edit');
    
    Route::put('/eventos/{id}', [EventosEventController::class, 'update'])
        ->name('eventos.update');
    
    Route::delete('/eventos/{id}', [EventosEventController::class, 'destroy'])
        ->name('eventos.destroy');
    
    // Gestión de noticias
    Route::get('/dashboard/crear-noticia', [DashboardController::class, 'createNews'])
        ->name('dashboard.crear-noticia');
    
    // Funcionalidad real de noticias
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
    
    // Registro de eventos
    Route::get('/evento/{id}/registro', [EventoAsistenciaController::class, 'showRegistrationForm'])
        ->name('eventos.registro.form');
 
    Route::post('/evento/{id}/registro', [EventoAsistenciaController::class, 'register'])
        ->name('eventos.registro');
    
    Route::post('/evento/{id}/registro/institucional', [EventoAsistenciaController::class, 'registrarInstitucional'])
        ->name('eventos.registro.institucional');
    
    Route::get('/evento/{id}/confirmacion', [EventoAsistenciaController::class, 'showConfirmation'])
        ->name('eventos.confirmacion');
    
    Route::get('/mis-asistencias', [EventoAsistenciaController::class, 'misAsistencias'])
        ->name('eventos.mis-asistencias');
    
    Route::post('/asistencia/{id}/cancelar', [EventoAsistenciaController::class, 'cancelarAsistencia'])
        ->name('eventos.asistencia.cancelar');
    
    // Cierre de sesión
    Route::post('/logout', [LoginController::class, 'logout'])
        ->name('logout');
});

// ============================================
// RUTAS DE ADMINISTRACIÓN - TODO EN UN SOLO LUGAR
// ============================================
Route::prefix('admin')->group(function () {
    // ===== RUTAS PÚBLICAS DE ADMIN (sin autenticación) =====
    Route::get('/login', function () {
        return Inertia::render('Admin/AdminLoginCheck');
    })->name('admin.login');
    
    Route::get('/create', function () {
        return Inertia::render('Admin/AdminCreateForm');
    })->name('admin.create');
    
    // API endpoints públicos para administración
    Route::get('/check', [AdminAuthController::class, 'checkAdmin']);
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/create-first', [AdminAuthController::class, 'createFirstAdmin']);
    Route::post('/create', [AdminAuthController::class, 'createAdmin']);
    
    // ===== RUTAS PROTEGIDAS DE ADMIN (requieren autenticación) =====
    Route::middleware(['auth:sanctum', \App\Http\Middleware\AdminAuth::class])->group(function () {
        // Dashboard de admin
        Route::get('/dashboard', function () {
            return Inertia::render('Admin/AdminDashboard');
        })->name('admin.dashboard');
        
        // ===== VISTAS INERTIA (renderizan páginas) =====
        // Vistas de usuarios
        Route::get('/users', [UserController::class, 'index'])
            ->name('admin.users');
        
        Route::get('/users/create', [UserController::class, 'create'])
            ->name('admin.users.create');
        
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])
            ->name('admin.users.edit');
        
        Route::get('/users/{id}', [UserController::class, 'show'])
            ->name('admin.users.show');
        
        // Vistas de eventos
        Route::get('/events', [EventController::class, 'index'])
            ->name('admin.events');
        
        Route::get('/events/create', [EventController::class, 'create'])
            ->name('admin.events.create');
        
        Route::get('/events/{id}/edit', [EventController::class, 'edit'])
            ->name('admin.events.edit');
        
        Route::get('/events/{id}', [EventController::class, 'show'])
            ->name('admin.events.show');
        
        // Vista de roles
        Route::get('/roles', function () {
            return Inertia::render('Admin/Roles/Index');
        })->name('admin.roles');
        
        // ===== API ENDPOINTS (devuelven JSON) =====
        Route::prefix('api')->group(function () {
            // Endpoints de usuarios
            Route::get('/users', [UserController::class, 'apiIndex'])
                ->name('admin.api.users');
            
            Route::get('/users/{id}', [UserController::class, 'apiShow'])
                ->name('admin.api.users.show');
            
            Route::post('/users', [UserController::class, 'store'])
                ->name('admin.api.users.store');
            
            Route::put('/users/{id}', [UserController::class, 'update'])
                ->name('admin.api.users.update');
            
            Route::delete('/users/{id}', [UserController::class, 'destroy'])
                ->name('admin.api.users.destroy');
            
            Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus'])
                ->name('admin.api.users.toggle-status');
            
            Route::post('/users/{id}/reset-password', [UserController::class, 'resetPassword'])
                ->name('admin.api.users.reset-password');
            
            Route::get('/users/export', [UserController::class, 'export'])
                ->name('admin.api.users.export');
            
            Route::get('/stats/users', [UserController::class, 'getUserStats'])
                ->name('admin.api.users.stats');
            
            // Endpoints de eventos
            Route::get('/events', [EventController::class, 'apiIndex'])
                ->name('admin.api.events');
            
            Route::get('/events/{id}', [EventController::class, 'apiShow'])
                ->name('admin.api.events.show');
            
            Route::post('/events', [EventController::class, 'store'])
                ->name('admin.api.events.store');
            
            Route::put('/events/{id}', [EventController::class, 'update'])
                ->name('admin.api.events.update');
            
            Route::delete('/events/{id}', [EventController::class, 'destroy'])
                ->name('admin.api.events.destroy');
            
            Route::patch('/events/{id}/toggle-status', [EventController::class, 'toggleStatus'])
                ->name('admin.api.events.toggle-status');
            
            Route::get('/stats/events', [EventController::class, 'getEventStats'])
                ->name('admin.api.events.stats');
        });
        
        // Otros endpoints protegidos
        Route::post('/logout', [AdminAuthController::class, 'logout'])
            ->name('admin.logout');
        
        Route::get('/me', [AdminAuthController::class, 'getCurrentAdmin'])
            ->name('admin.me');
        
        // Gestión de eventos y asistencias
        Route::get('/eventos/{id}/asistentes', [EventoAsistenciaController::class, 'listarAsistentes'])
            ->name('admin.eventos.asistentes');
        
        Route::patch('/eventos/{id}/asistentes/{asistenciaId}', [EventoAsistenciaController::class, 'actualizarAsistencia'])
            ->name('admin.eventos.asistencia.actualizar');
    });
});

// ===== RUTA CATCH-ALL =====
// Ruta catch-all - debe estar al final
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');