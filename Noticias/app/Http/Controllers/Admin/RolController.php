<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Rol;
use App\Models\Permission;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class RolController extends Controller
{
    /**
     * Mostrar vista de roles
     */
    public function index()
    {
        try {
            return inertia('Admin/Roles/Index');
        } catch (\Exception $e) {
            Log::error('Error en RolController index: ' . $e->getMessage());
            return redirect()->route('admin.dashboard')->with('error', 'No se pudo cargar la página de roles');
        }
    }
    
    /**
     * Obtener la lista de roles para la API
     */
    public function list()
    {
        try {
            // Incluir los permisos relacionados
            $roles = Rol::with('permissions')
                ->orderBy('id', 'asc')
                ->get();
                
            return response()->json([
                'status' => 'success',
                'roles' => $roles
            ]);
        } catch (\Exception $e) {
            Log::error('Error al listar roles: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener la lista de roles',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Mostrar formulario para crear un rol
     */
    public function create()
    {
        try {
            // Obtener todos los permisos disponibles
            $permissions = Permission::orderBy('name')->get();
            
            return inertia('Admin/Roles/Create', [
                'permissions' => $permissions
            ]);
        } catch (\Exception $e) {
            Log::error('Error en RolController create: ' . $e->getMessage());
            return redirect()->route('admin.roles.index')->with('error', 'No se pudo cargar el formulario');
        }
    }
    
    /**
     * Guardar un nuevo rol
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255|unique:rols,name',
                'description' => 'nullable|string',
                'permissions' => 'required|array',
                'permissions.*' => 'exists:permissions,id'
            ]);
            
            // Generar slug si no se proporcionó
            if (!isset($validated['slug'])) {
                $validated['slug'] = Str::slug($validated['name']);
            }
            
            // Establecer como activo por defecto
            $validated['active'] = $request->input('active', true);
            
            // Crear el rol
            $rol = Rol::create([
                'name' => $validated['name'],
                'slug' => $validated['slug'],
                'description' => $validated['description'] ?? null,
                'active' => $validated['active']
            ]);
            
            // Asignar permisos
            $rol->permissions()->attach($validated['permissions']);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Rol creado con éxito',
                'rol' => $rol->load('permissions')
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error al crear rol: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear rol',
                'error' => $e->getMessage()
            ], 422);
        }
    }
    
    /**
     * Mostrar un rol específico
     */
    public function show($id)
    {
        try {
            $rol = Rol::with('permissions')->findOrFail($id);
            
            // Obtener todos los permisos disponibles para el formulario
            $allPermissions = Permission::orderBy('name')->get();
            
            return inertia('Admin/Roles/Show', [
                'rol' => $rol,
                'allPermissions' => $allPermissions
            ]);
        } catch (\Exception $e) {
            Log::error('Error al mostrar rol: ' . $e->getMessage());
            return redirect()->route('admin.roles.index')->with('error', 'Rol no encontrado');
        }
    }
    
    /**
     * Mostrar formulario para editar un rol
     */
    public function edit($id)
    {
        try {
            $rol = Rol::with('permissions')->findOrFail($id);
            
            // Obtener todos los permisos disponibles para el formulario
            $allPermissions = Permission::orderBy('name')->get();
            
            return inertia('Admin/Roles/Edit', [
                'rol' => $rol,
                'allPermissions' => $allPermissions
            ]);
        } catch (\Exception $e) {
            Log::error('Error al editar rol: ' . $e->getMessage());
            return redirect()->route('admin.roles.index')->with('error', 'Rol no encontrado');
        }
    }
    
    /**
     * Actualizar un rol existente
     */
    public function update(Request $request, $id)
    {
        try {
            $rol = Rol::findOrFail($id);
            
            $validated = $request->validate([
                'name' => 'sometimes|string|max:255|unique:rols,name,' . $id,
                'description' => 'nullable|string',
                'permissions' => 'sometimes|array',
                'permissions.*' => 'exists:permissions,id',
                'active' => 'sometimes|boolean'
            ]);
            
            // Actualizar campos básicos
            if (isset($validated['name'])) {
                $rol->name = $validated['name'];
                
                // Actualizar slug solo si cambió el nombre y no se proporcionó un slug específico
                if (!isset($validated['slug'])) {
                    $rol->slug = Str::slug($validated['name']);
                }
            }
            
            if (isset($validated['description'])) {
                $rol->description = $validated['description'];
            }
            
            if (isset($validated['active'])) {
                $rol->active = $validated['active'];
            }
            
            $rol->save();
            
            // Actualizar permisos si se proporcionaron
            if (isset($validated['permissions'])) {
                $rol->permissions()->sync($validated['permissions']);
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Rol actualizado con éxito',
                'rol' => $rol->fresh(['permissions'])
            ]);
        } catch (\Exception $e) {
            Log::error('Error al actualizar rol: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar rol',
                'error' => $e->getMessage()
            ], 422);
        }
    }
    
    /**
     * Eliminar un rol
     */
    public function destroy($id)
    {
        try {
            $rol = Rol::findOrFail($id);
            
            // Verificar si hay usuarios con este rol
            if ($rol->admins()->count() > 0 || $rol->users()->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se puede eliminar el rol porque está asignado a uno o más usuarios'
                ], 422);
            }
            
            // Desasociar permisos
            $rol->permissions()->detach();
            
            // Eliminar el rol
            $rol->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Rol eliminado con éxito'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar rol: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar rol',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}