<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Admin;
use App\Models\Rol;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Log;

class AdminAuthController extends Controller
{
    // Login de administrador
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required|string',
            ]);
            
            if (Auth::guard('admin')->attempt($request->only('email', 'password'))) {
                $admin = Auth::guard('admin')->user();
                
                // Asegúrate de que el admin exista
                if (!$admin) {
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Administrador no encontrado'
                    ], 404);
                }
                
                // Elimina todos los tokens existentes para este admin
                $admin->tokens()->delete();
                
                // Crea un nuevo token
                $token = $admin->createToken('admin-token', ['admin'])->plainTextToken;
                
                return response()->json([
                    'status' => 'success',
                    'message' => 'Inicio de sesión exitoso',
                    'admin' => [
                        'id' => $admin->id,
                        'name' => $admin->name,
                        'email' => $admin->email,
                        'rol_id' => $admin->rol_id,
                        'phone' => $admin->phone,
                        'active' => $admin->active
                    ],
                    'permissions' => $this->getAdminPermissions($admin),
                    'token' => $token
                ], 200);
            }
            
            return response()->json([
                'status' => 'error',
                'message' => 'Las credenciales proporcionadas son incorrectas.'
            ], 401);
        } catch (\Exception $e) {
            Log::error('Error en login de administrador: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error en el servidor',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // Verifica si existe un admin y si no, permite crear el primero
    public function checkAdmin()
    {
        $adminExists = Admin::count() > 0;
        
        return response()->json([
            'status' => 'success',
            'admin_exists' => $adminExists
        ]);
    }
    
    // Verificar la autenticación actual
    public function checkAdminAuth(Request $request)
    {
        try {
            $admin = $request->user();
            
            if (!$admin) {
                return response()->json([
                    'status' => 'error',
                    'authenticated' => false,
                    'message' => 'No autenticado'
                ], 401);
            }
            
            return response()->json([
                'status' => 'success',
                'authenticated' => true,
                'message' => 'Autenticación válida'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al verificar autenticación: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'authenticated' => false,
                'message' => 'Error al verificar autenticación'
            ], 500);
        }
    }
    
    // Crear el primer admin (super admin)
    public function createFirstAdmin(Request $request)
    {
        // Verificar si ya existe algún admin
        if (Admin::count() > 0) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ya existe un administrador en el sistema'
            ], 403);
        }
        
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string'
        ]);
        
        // Buscar o crear el rol de SuperAdmin
        $superAdminRol = Rol::firstOrCreate(
            ['slug' => 'super-administrator'],
            [
                'name' => 'Super Administrator',
                'description' => 'Rol con acceso completo al sistema',
                'active' => true
            ]
        );
        
        // Crear el admin
        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'rol_id' => $superAdminRol->id,
            'active' => true
        ]);
        
        $token = $admin->createToken('admin-token')->plainTextToken;
        
        return response()->json([
            'status' => 'success',
            'message' => 'Administrador creado con éxito',
            'admin' => $admin,
            'token' => $token
        ], 201);
    }

    // Crear un nuevo administrador (después de que exista el primero)
    public function createAdmin(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email',
            'password' => 'required|string|min:8|confirmed',
            'phone' => 'nullable|string'
        ]);
        
        // Por defecto, asignar el rol_id 1 (que parece ser Admin Principal según tu BD)
        $rolId = $request->rol_id ?? 1;
        
        // Crear el admin
        $admin = Admin::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'phone' => $request->phone,
            'rol_id' => $rolId,
            'active' => true
        ]);
        
        return response()->json([
            'status' => 'success',
            'message' => 'Administrador creado con éxito',
            'admin' => $admin
        ], 201);
    }
        
    // Cerrar sesión
    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->tokens()->delete();
        }
        
        Auth::guard('admin')->logout();
        
        return response()->json([
            'status' => 'success',
            'message' => 'Sesión cerrada correctamente'
        ]);
    }

    public function getCurrentAdmin(Request $request)
    {
        try {
            $admin = $request->user();
            
            if (!$admin) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No autenticado'
                ], 401);
            }
            
            return response()->json([
                'status' => 'success',
                'admin' => [
                    'id' => $admin->id,
                    'name' => $admin->name,
                    'email' => $admin->email,
                    'rol_id' => $admin->rol_id,
                    'phone' => $admin->phone,
                    'active' => $admin->active
                ],
                'permissions' => $this->getAdminPermissions($admin)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener datos del administrador',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    private function getAdminPermissions($admin)
    {
        try {
            if ($admin->rol) {
                return $admin->rol->permissions->pluck('slug')->toArray();
            }
            return [];
        } catch (\Exception $e) {
            Log::error('Error al obtener permisos: ' . $e->getMessage());
            return [];
        }
    }
}