<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Log;

class UserController extends Controller
{
    /**
     * Obtener todos los usuarios
     */
    public function index()
    {
        \Log::info('⭐ ACCEDIENDO A USERCONTROLLER INDEX ⭐');
        
        try {
            \Log::info('Intentando renderizar vista Admin/Users/Index');
            return inertia('Admin/Users/Index');
        } catch (\Exception $e) {
            \Log::error('ERROR en UserController index: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return redirect()->route('admin.dashboard')->with('error', 'No se pudo cargar la página de usuarios');
        }
    }
    
    /**
     * Obtener la lista de usuarios para la API
     */
    public function list()
    {
        try {
            $users = User::with(['roles', 'person', 'status'])
                ->orderBy('id', 'asc') // Ordenar por ID de forma ascendente
                ->get();
                
            return response()->json([
                'status' => 'success',
                'users' => $users
            ]);
        } catch (\Exception $e) {
            Log::error('Error al listar usuarios: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener la lista de usuarios',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Mostrar el formulario para crear un nuevo usuario
     */
    public function create()
    {
        return inertia('Admin/Users/Create');
    }
    
    /**
     * Almacenar un nuevo usuario
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8|confirmed',
                'status_id' => 'required|exists:statuses,id',
                'roles' => 'required|array',
                'roles.*' => 'exists:rols,id',
                'person' => 'sometimes|array',
                'person.name' => 'required_with:person|string|max:255',
                'person.last_name' => 'required_with:person|string|max:255',
                // Más validaciones según tu modelo de datos
            ]);
            
            // Generar salt para la contraseña
            $salt = bin2hex(random_bytes(16));
            
            // Crear el usuario
            $user = User::create([
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'salt' => $salt,
                'status_id' => $validated['status_id'],
                'email_verified' => false,
            ]);
            
            // Asignar roles
            $user->roles()->attach($validated['roles']);
            
            // Crear persona relacionada si se proporcionaron datos
            if (isset($validated['person'])) {
                $user->person()->create($validated['person']);
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Usuario creado con éxito',
                'user' => $user->load(['roles', 'person'])
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error al crear usuario: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear usuario',
                'error' => $e->getMessage()
            ], 422);
        }
    }
    
    /**
     * Mostrar un usuario específico
     */
    public function show($id)
    {
        try {
            $user = User::with(['roles', 'person', 'status'])->findOrFail($id);
            
            return inertia('Admin/Users/Show', [
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Error al mostrar usuario: ' . $e->getMessage());
            return redirect()->route('admin.users.index')->with('error', 'Usuario no encontrado');
        }
    }
    
    /**
     * Mostrar el formulario para editar un usuario
     */
    public function edit($id)
    {
        try {
            $user = User::with(['roles', 'person', 'status'])->findOrFail($id);
            
            return inertia('Admin/Users/Edit', [
                'user' => $user
            ]);
        } catch (\Exception $e) {
            Log::error('Error al editar usuario: ' . $e->getMessage());
            return redirect()->route('admin.users.index')->with('error', 'Usuario no encontrado');
        }
    }
    
    /**
     * Actualizar un usuario
     */
    public function update(Request $request, $id)
    {
        try {
            $user = User::findOrFail($id);
            
            $validated = $request->validate([
                'email' => [
                    'sometimes',
                    'string',
                    'email',
                    'max:255',
                    Rule::unique('users')->ignore($user->id),
                ],
                'password' => 'sometimes|string|min:8|confirmed',
                'status_id' => 'sometimes|exists:statuses,id',
                'roles' => 'sometimes|array',
                'roles.*' => 'exists:rols,id',
                'person' => 'sometimes|array',
                'person.name' => 'required_with:person|string|max:255',
                'person.last_name' => 'required_with:person|string|max:255',
                'blocked' => 'sometimes|boolean',
                // Más validaciones según tu modelo de datos
            ]);
            
            // Actualizar usuario
            if (isset($validated['email'])) {
                $user->email = $validated['email'];
            }
            
            if (isset($validated['password'])) {
                $user->password = Hash::make($validated['password']);
            }
            
            if (isset($validated['status_id'])) {
                $user->status_id = $validated['status_id'];
            }
            
            if (isset($validated['blocked'])) {
                $user->blocked = $validated['blocked'];
            }
            
            $user->save();
            
            // Actualizar roles si se proporcionaron
            if (isset($validated['roles'])) {
                $user->roles()->sync($validated['roles']);
            }
            
            // Actualizar persona si se proporcionaron datos
            if (isset($validated['person']) && $user->person) {
                $user->person->update($validated['person']);
            } elseif (isset($validated['person'])) {
                $user->person()->create($validated['person']);
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Usuario actualizado con éxito',
                'user' => $user->fresh(['roles', 'person'])
            ]);
        } catch (\Exception $e) {
            Log::error('Error al actualizar usuario: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar usuario',
                'error' => $e->getMessage()
            ], 422);
        }
    }
    
    /**
     * Eliminar un usuario
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // Marcar como eliminado en lugar de eliminar permanentemente
            $user->deleted = true;
            $user->save();
            
            // O eliminar permanentemente si es necesario
            // $user->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Usuario eliminado con éxito'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar usuario: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}