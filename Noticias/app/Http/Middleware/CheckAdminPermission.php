<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckAdminPermission
{
    public function handle(Request $request, Closure $next, $permission)
    {
        if (!$request->user() || !$request->user()->rol) {
            return response()->json([
                'status' => 'error',
                'message' => 'No autorizado'
            ], 403);
        }
        
        // Verificar permisos a través del rol
        $hasPermission = $request->user()->rol->permissions->contains('slug', $permission);
        
        if (!$hasPermission) {
            return response()->json([
                'status' => 'error',
                'message' => 'No tiene permiso para realizar esta acción'
            ], 403);
        }
        
        return $next($request);
    }
}