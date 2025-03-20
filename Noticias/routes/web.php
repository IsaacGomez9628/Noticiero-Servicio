<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Home\NoticiaController;
use App\Http\Controllers\Home\QuienesSomosController;
use App\Http\Controllers\EventoAsistenciaController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\HomeController;

// Rutas para vistas principales (renderizan la SPA de React)
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Rutas de Home
Route::get('/home/loMasNuevo', [HomeController::class, 'loMasNuevo'])->name('home.loMasNuevo');
Route::get('/Home/Quienes-Somos', [QuienesSomosController::class, 'index'])->name('quienes-somos');

// Rutas para eventos
Route::get('/eventos', [EventoController::class, 'index'])->name('eventos.index');
Route::get('/eventos/{id}', [EventoController::class, 'show'])->name('eventos.show');

// Rutas para registro de asistencia a eventos
Route::post('/eventos/{id}/registro', [EventoAsistenciaController::class, 'registrar'])->name('eventos.registro');

// Ruta de compatibilidad (para mantener enlaces antiguos)
Route::get('/eventos/{id}/registro', [EventoController::class, 'showRegistrationForm'])->name('eventos.registro.form');

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

// Rutas de autenticación
Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::get('/signup', [AuthController::class, 'signup'])->name('signup');

// Ruta para cualquier otra URL que debería ser manejada por React Router
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');