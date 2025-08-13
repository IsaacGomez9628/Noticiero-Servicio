<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use App\Models\Admin;

class AdminSettingsController extends Controller
{
    /**
     * Mostrar la página de configuración
     */
    public function index(Request $request)
    {
        $admin = $request->user();
        
        return Inertia::render('Admin/Settings/Index', [
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'rol_id' => $admin->rol_id,
                'rol' => $admin->rol ? [
                    'name' => $admin->rol->name,
                    'description' => $admin->rol->description
                ] : null,
                'created_at' => $admin->created_at->format('Y-m-d H:i:s'),
                'updated_at' => $admin->updated_at->format('Y-m-d H:i:s')
            ]
        ]);
    }

    /**
     * Actualizar información del perfil
     */
    public function updateProfile(Request $request)
    {
        $admin = $request->user();

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:admins,email,' . $admin->id,
            'phone' => 'nullable|string|max:20'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        $admin->update([
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Perfil actualizado correctamente',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone
            ]
        ]);
    }

    /**
     * Actualizar contraseña
     */
    public function updatePassword(Request $request)
    {
        $admin = $request->user();

        $validator = Validator::make($request->all(), [
            'current_password' => 'required',
            'new_password' => 'required|min:8|confirmed',
        ], [
            'current_password.required' => 'La contraseña actual es requerida',
            'new_password.required' => 'La nueva contraseña es requerida',
            'new_password.min' => 'La nueva contraseña debe tener al menos 8 caracteres',
            'new_password.confirmed' => 'Las contraseñas no coinciden'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'errors' => $validator->errors()
            ], 422);
        }

        // Verificar contraseña actual
        if (!Hash::check($request->current_password, $admin->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'La contraseña actual es incorrecta'
            ], 422);
        }

        // Actualizar contraseña
        $admin->update([
            'password' => Hash::make($request->new_password)
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Contraseña actualizada correctamente'
        ]);
    }

    /**
     * Obtener información del admin actual (API)
     */
    public function getAdminInfo(Request $request)
    {
        $admin = $request->user();
        
        return response()->json([
            'status' => 'success',
            'admin' => [
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'phone' => $admin->phone,
                'rol_id' => $admin->rol_id,
                'rol' => $admin->rol ? [
                    'name' => $admin->rol->name,
                    'description' => $admin->rol->description
                ] : null,
                'created_at' => $admin->created_at,
                'updated_at' => $admin->updated_at
            ]
        ]);
    }
}