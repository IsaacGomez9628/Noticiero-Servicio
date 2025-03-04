<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Home\EventoController;
use App\Http\Controllers\Home\NoticiaController;
use App\Http\Controllers\Home\QuienesSomosController;
use App\Http\Controllers\Home\MiembroController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\HomeController;;

// Rutas para vistas principales (renderizan la SPA de React)
Route::get('/', [HomeController::class, 'index'])->name('home');
Route::get('/eventos', [EventoController::class, 'index'])->name('eventos');
Route::get('/eventos/{id}', [EventoController::class, 'show'])->name('eventos.show');
Route::get('/eventos/{id}/registro', [EventoController::class, 'registro'])->name('eventos.registro');
Route::get('/miembros', [MiembroController::class, 'index'])->name('miembros');
Route::get('/miembros/{id}', [MiembroController::class, 'show'])->name('miembros.show');
Route::get('/quienes-somos', [QuienesSomosController::class, 'index'])->name('quienes-somos');
Route::get('/noticias/{id}', [NoticiaController::class, 'show'])->name('noticias.show');

// Rutas de autenticación
Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::get('/signup', [AuthController::class, 'signup'])->name('signup');

// Ruta para cualquier otra URL que debería ser manejada por React Router
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');