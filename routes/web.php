<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Home\NoticiaController;
use App\Http\Controllers\Home\QuienesSomosController;
use App\Http\Controllers\EventoAsistenciaController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\Auth\AuthController;
use App\Http\Controllers\HomeController;
use Illuminate\Support\Facades\DB;

// Rutas para vistas principales (renderizan la SPA de React)
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Rutas para eventos
Route::get('/eventos', [EventoController::class, 'index'])->name('eventos.index');
Route::get('/eventos/{id}', [EventoController::class, 'show'])->name('eventos.show');

// Rutas para registro de asistencia a eventos
Route::get('/eventos/{id}/registro', [EventoAsistenciaController::class, 'showRegistrationForm'])->name('eventos.registro.form');
Route::post('/eventos/{id}/registro', [EventoAsistenciaController::class, 'registrar'])->name('eventos.registro');

// Route::get('/eventos/{id}', function($id){
//     $id = DB::table('eventos')->find($id);

//     return $id;
// });

// Otras rutas
Route::get('/quienes-somos', [QuienesSomosController::class, 'index'])->name('quienes-somos');
Route::get('/noticias', [NoticiaController::class, 'index'])->name('noticias');

// Rutas de autenticación
Route::get('/login', [AuthController::class, 'login'])->name('login');
Route::get('/signup', [AuthController::class, 'signup'])->name('signup');

// Ruta para cualquier otra URL que debería ser manejada por React Router
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');