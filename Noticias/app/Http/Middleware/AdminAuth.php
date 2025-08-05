<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AdminAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @return mixed
     */
    public function handle(Request $request, Closure $next)
    {
        // Verificar si el usuario está autenticado via Sanctum
        if ($request->user('sanctum')) {
            // Verificar si es una instancia de Admin
            if ($request->user('sanctum') instanceof \App\Models\Admin) {
                return $next($request);
            }
        }
        
        // Si no está autenticado o no es admin
        if ($request->expectsJson() || $request->is('admin/api/*')) {
            return response()->json([
                'message' => 'No autorizado. Acceso solo para administradores.'
            ], 401);
        }
        
        return redirect()->route('admin.login');
    }
}