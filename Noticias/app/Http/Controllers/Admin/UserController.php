<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Person;
use App\Models\Rol;
use App\Models\Company;
use App\Models\Gender;
use App\Models\Status;
use App\Models\ListCompany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

class UserController extends Controller
{
    /**
     * Display the users list page (Inertia view)
     */
    public function index(Request $request)
    {
        return Inertia::render('Admin/Users/Index', [
            'users' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'from' => null,
                'to' => null
            ],
            'filters' => $request->all(),
            'roles' => Rol::where('id', '>=', 5)->get()
        ]);
    }

    /**
     * API endpoint for getting users list with filters and pagination
     */
    public function apiIndex(Request $request)
    {
        \Log::info('UserController apiIndex llamado', [
            'all_params' => $request->all()
        ]);
        
        $query = User::with(['person', 'companies', 'status']);
        
        // Búsqueda por nombre o email
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('email', 'like', "%{$search}%")
                  ->orWhereHas('person', function($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('second_last_name', 'like', "%{$search}%");
                  });
            });
        }
        
        // Filtro por rol - usando la tabla user_role directamente
        if ($request->filled('role_id')) {
            $query->whereExists(function($q) use ($request) {
                $q->select(DB::raw(1))
                  ->from('user_role')
                  ->whereRaw('user_role.user_id = users.id')
                  ->where('user_role.rol_id', $request->role_id);
            });
        }
        
        // Filtro por estado
        if ($request->has('active') && $request->active !== '') {
            $query->where('blocked', $request->active == '1' ? false : true);
        }
        
        // Filtro por tipo de cuenta
        if ($request->filled('account_type')) {
            if ($request->account_type === 'personal') {
                $query->whereExists(function($q) {
                    $q->select(DB::raw(1))
                      ->from('user_role')
                      ->whereRaw('user_role.user_id = users.id')
                      ->where('user_role.rol_id', 5);
                });
            } elseif ($request->account_type === 'institutional') {
                $query->whereExists(function($q) {
                    $q->select(DB::raw(1))
                      ->from('user_role')
                      ->whereRaw('user_role.user_id = users.id')
                      ->where('user_role.rol_id', 6);
                });
            }
        }
        
        // Ordenamiento
        $sortField = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        
        if ($sortField === 'name') {
            $query->leftJoin('persons', 'users.id', '=', 'persons.user_id')
                  ->orderBy('persons.name', $sortOrder)
                  ->select('users.*');
        } else {
            $query->orderBy($sortField, $sortOrder);
        }
        
        // Paginación
        $usersPaginated = $query->paginate($request->per_page ?? 10);
        
        // Transformar los datos
        $transformedData = [];
        foreach ($usersPaginated->items() as $user) {
            // Obtener roles de forma segura
            $userRoles = DB::table('user_role')
                ->join('rols', 'user_role.rol_id', '=', 'rols.id')
                ->where('user_role.user_id', $user->id)
                ->select('rols.id', 'rols.name')
                ->get();
            
            $transformedData[] = [
                'id' => $user->id,
                'email' => $user->email,
                'full_name' => $user->person ? $user->person->full_name : 'Sin nombre',
                'roles' => $userRoles->pluck('name')->toArray(),
                'role_names' => $userRoles->pluck('name')->implode(', '),
                'status' => [
                    'blocked' => $user->blocked,
                    'email_verified' => $user->email_verified,
                    'name' => $user->blocked ? 'Bloqueado' : 'Activo',
                    'color' => $user->blocked ? 'red' : 'green'
                ],
                'created_at' => $user->created_at->format('d/m/Y'),
                'last_login' => $user->last_authentication ? $user->last_authentication->format('d/m/Y H:i') : 'Nunca',
                'companies' => $user->companies->pluck('name')->toArray(),
                'is_institutional' => $userRoles->contains('id', 6),
                'is_personal' => $userRoles->contains('id', 5)
            ];
        }
        
        $users = [
            'data' => $transformedData,
            'current_page' => $usersPaginated->currentPage(),
            'last_page' => $usersPaginated->lastPage(),
            'per_page' => $usersPaginated->perPage(),
            'total' => $usersPaginated->total(),
            'from' => $usersPaginated->firstItem(),
            'to' => $usersPaginated->lastItem()
        ];
        
        return response()->json([
            'users' => $users,
            'filters' => [
                'search' => $request->search,
                'role_id' => $request->role_id,
                'active' => $request->active,
                'account_type' => $request->account_type
            ],
            'roles' => Rol::where('id', '>=', 5)->get()
        ]);
    }
    
    /**
     * Show the form for creating a new user
     */
    public function create()
    {
        $roles = Rol::where('id', '>=', 5)->get();
        $genders = Gender::all();
        
        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
            'genders' => $genders
        ]);
    }
    
    /**
     * Store a newly created user in storage (API endpoint)
     */
    public function store(Request $request)
    {
        \Log::info('=====================================');
        \Log::info('Store method called');
        \Log::info('Request data:', $request->all());
        \Log::info('=====================================');
        
        $rules = [
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'role_id' => 'required|exists:rols,id',
            // Datos personales
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'second_last_name' => 'nullable|string|max:255',
            'gender_id' => 'required|exists:genders,id',
            'birth_date' => 'required|date|before:today',
        ];
        
        // Agregar validaciones para empresa si es institucional
        if ($request->role_id == 6) {
            $rules['company_name'] = 'required|string|max:255';
            $rules['company_phone'] = 'nullable|string|max:20';
            $rules['company_address'] = 'nullable|string|max:500';
        }
        
        $validated = $request->validate($rules);
        
        try {
            DB::beginTransaction();
            \Log::info('Transaction started');
            
            // Generar salt aleatorio
            $salt = Str::random(32);
            \Log::info('Salt generated');
            
            // Obtener el status activo
            $activeStatus = Status::where('name', 'Active')
                                 ->where('type', 'user')
                                 ->first();
            
            \Log::info('Status query result:', ['status' => $activeStatus]);
            
            if (!$activeStatus) {
                // Si no existe con nombre "Active", buscar con ID 1
                $activeStatus = Status::find(1);
                
                if (!$activeStatus) {
                    // Si tampoco existe, usar un valor por defecto
                    \Log::warning('No active status found, using default value 1');
                    $statusId = 1;
                } else {
                    $statusId = $activeStatus->id;
                }
            } else {
                $statusId = $activeStatus->id;
            }
            
            // Crear usuario con todos los campos requeridos
            $userData = [
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'salt' => $salt,
                'status_id' => $statusId,
                'email_verified' => true,
                'email_verified_at' => now(),
                'blocked' => false,
                'deleted' => false,
                'failed_password_attempts' => 0
            ];
            
            $user = User::create($userData);
            
            \Log::info('User created with ID: ' . $user->id);
            
            // Crear persona
            $birthDate = \Carbon\Carbon::parse($validated['birth_date']);
            $age = $birthDate->age; // Usar el método age de Carbon que calcula correctamente
            
            \Log::info('Creating person with age: ' . $age . ' from birth_date: ' . $validated['birth_date']);
            
            $person = Person::create([
                'user_id' => $user->id,
                'name' => $validated['name'],
                'last_name' => $validated['last_name'],
                'second_last_name' => $validated['second_last_name'] ?? null,
                'gender_id' => $validated['gender_id'],
                'birth_date' => $validated['birth_date'],
                'age' => $age
            ]);
            
            \Log::info('Person created for user: ' . $user->id);
            
            // Asignar rol - Solo usar user_role que es la que existe y funciona
            try {
                DB::table('user_role')->insert([
                    'user_id' => $user->id,
                    'rol_id' => $validated['role_id'],
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                \Log::info('Role assigned successfully in user_role table');
            } catch (\Exception $e) {
                \Log::error('Could not assign role: ' . $e->getMessage());
                throw new \Exception('No se pudo asignar el rol al usuario: ' . $e->getMessage());
            }
            
            // Si es institucional, crear empresa
            if ($validated['role_id'] == 6 && isset($validated['company_name'])) {
                try {
                    // Primero crear o buscar el tipo de empresa
                    $listCompany = ListCompany::firstOrCreate([
                        'name' => $validated['company_name']
                    ]);
                    
                    \Log::info('ListCompany created/found with ID: ' . $listCompany->id);
                    
                    // Crear la empresa con la estructura correcta de tu modelo
                    $company = Company::create([
                        'user_id' => $user->id,
                        'list_companies_id' => $listCompany->id,
                        'description' => $validated['company_address'] ?? '',
                        'phone' => $validated['company_phone'] ?? null
                    ]);
                    
                    \Log::info('Company created with ID: ' . $company->id);
                } catch (\Exception $e) {
                    \Log::error('Error creating company: ' . $e->getMessage());
                    // No lanzar excepción aquí, solo loguear el error
                }
            }
            
            DB::commit();
            
            \Log::info('Transaction committed successfully');
            
            // Cargar el usuario con sus relaciones de forma segura
            try {
                $user->load(['person', 'companies']);
                // No cargar roles porque puede causar problemas con las tablas duplicadas
                $user->roles_data = DB::table('user_role')
                    ->join('rols', 'user_role.rol_id', '=', 'rols.id')
                    ->where('user_role.user_id', $user->id)
                    ->select('rols.*')
                    ->get();
            } catch (\Exception $e) {
                \Log::warning('Could not load user relationships: ' . $e->getMessage());
            }
            
            return response()->json([
                'status' => 'success',
                'message' => 'Usuario creado exitosamente',
                'user' => [
                    'id' => $user->id,
                    'email' => $user->email,
                    'person' => $user->person ?? null,
                    'companies' => $user->companies ?? [],
                    'roles' => $user->roles_data ?? []
                ]
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error creating user: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear el usuario: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Display the specified user (Vista Inertia)
     */
    public function show($id)
    {
        $user = User::with(['person', 'roles', 'companies', 'status', 'eventAttendances'])
                    ->findOrFail($id);
        
        $userData = $this->transformUserData($user);
        
        return Inertia::render('Admin/Users/Show', [
            'user' => $userData
        ]);
    }

    /**
     * API endpoint for getting user data
     */
    public function apiShow($id)
    {
        $user = User::with(['person', 'roles', 'companies', 'status', 'eventAttendances'])
                    ->findOrFail($id);
        
        $userData = $this->transformUserData($user);
        
        return response()->json($userData);
    }

    /**
     * Transform user data for responses
     */
    private function transformUserData($user)
    {
        return [
            'id' => $user->id,
            'email' => $user->email,
            'created_at' => $user->created_at->format('d/m/Y H:i'),
            'last_login' => $user->last_authentication ? $user->last_authentication->format('d/m/Y H:i') : 'Nunca',
            'email_verified' => $user->email_verified,
            'email_verified_at' => $user->email_verified_at ? $user->email_verified_at->format('d/m/Y H:i') : null,
            'blocked' => $user->blocked,
            'failed_attempts' => $user->failed_password_attempts,
            'person' => $user->person ? [
                'full_name' => $user->person->full_name,
                'name' => $user->person->name,
                'last_name' => $user->person->last_name,
                'second_last_name' => $user->person->second_last_name,
                'gender' => $user->person->gender->name ?? 'No especificado',
                'age' => $user->person->age,
                'birth_date' => $user->person->birth_date
            ] : null,
            'roles' => $user->roles,
            'companies' => $user->companies,
            'total_events' => $user->eventAttendances->count(),
            'upcoming_events' => $user->eventAttendances()
                                      ->whereHas('event', function($q) {
                                          $q->where('date', '>=', now());
                                      })->count()
        ];
    }
    
    /**
     * Show the form for editing the specified user
     */
    public function edit($id)
    {
        $user = User::with(['person', 'roles', 'companies'])->findOrFail($id);
        $roles = Rol::where('id', '>=', 5)->get();
        $genders = Gender::all();
        
        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'genders' => $genders
        ]);
    }
    
    /**
     * Update the specified user in storage (API endpoint)
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);
        
        $validated = $request->validate([
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|min:8|confirmed',
            'role_id' => 'required|exists:rols,id',
            // Datos personales
            'name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'second_last_name' => 'nullable|string|max:255',
            'gender_id' => 'required|exists:genders,id',
            'birth_date' => 'required|date|before:today',
            // Datos de empresa (si es institucional)
            'company_name' => 'required_if:role_id,6|nullable|string|max:255',
            'company_rfc' => 'required_if:role_id,6|nullable|string|size:13',
            'company_phone' => 'nullable|string|max:20',
            'company_address' => 'nullable|string|max:500'
        ]);
        
        try {
            DB::beginTransaction();
            
            // Actualizar usuario
            $userData = ['email' => $validated['email']];
            if (!empty($validated['password'])) {
                $userData['password'] = Hash::make($validated['password']);
                // Generar nuevo salt cuando se cambia la contraseña
                $userData['salt'] = Str::random(32);
            }
            $user->update($userData);
            
            // Actualizar persona
            if ($user->person) {
                $birthDate = \Carbon\Carbon::parse($validated['birth_date']);
                $age = $birthDate->age;
                
                $user->person->update([
                    'name' => $validated['name'],
                    'last_name' => $validated['last_name'],
                    'second_last_name' => $validated['second_last_name'] ?? null,
                    'gender_id' => $validated['gender_id'],
                    'birth_date' => $validated['birth_date'],
                    'age' => $age
                ]);
            }
            
            // Actualizar rol - Eliminar roles anteriores e insertar el nuevo
            DB::table('user_role')->where('user_id', $user->id)->delete();
            
            // Insertar nuevo rol
            DB::table('user_role')->insert([
                'user_id' => $user->id,
                'rol_id' => $validated['role_id'],
                'created_at' => now(),
                'updated_at' => now()
            ]);
            
            // Actualizar empresa si es institucional
            if ($validated['role_id'] == 6) {
                $company = $user->companies()->first();
                if ($company) {
                    $company->update([
                        'name' => $validated['company_name'],
                        'rfc' => $validated['company_rfc'],
                        'phone' => $validated['company_phone'] ?? null,
                        'address' => $validated['company_address'] ?? null
                    ]);
                } else {
                    Company::create([
                        'user_id' => $user->id,
                        'name' => $validated['company_name'],
                        'rfc' => $validated['company_rfc'],
                        'phone' => $validated['company_phone'] ?? null,
                        'address' => $validated['company_address'] ?? null,
                        'active' => true
                    ]);
                }
            }
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Usuario actualizado exitosamente',
                'user' => $user->fresh(['person', 'roles', 'companies'])
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    // ... resto de los métodos sin cambios ...
    
    /**
     * Toggle user active/blocked status (API endpoint)
     */
    public function toggleStatus($id)
    {
        try {
            $user = User::findOrFail($id);
            $user->blocked = !$user->blocked;
            
            if ($user->blocked) {
                $user->failed_password_attempts = 0;
            }
            
            $user->save();
            
            return response()->json([
                'status' => 'success',
                'message' => $user->blocked ? 'Usuario bloqueado' : 'Usuario desbloqueado',
                'blocked' => $user->blocked
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al cambiar el estado del usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Reset user password (API endpoint)
     */
    public function resetPassword(Request $request, $id)
    {
        $validated = $request->validate([
            'new_password' => 'required|min:8|confirmed'
        ]);
        
        try {
            $user = User::findOrFail($id);
            $user->password = Hash::make($validated['new_password']);
            $user->salt = Str::random(32); // Generar nuevo salt
            $user->failed_password_attempts = 0;
            $user->save();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Contraseña restablecida exitosamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al restablecer la contraseña',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove the specified user from storage (API endpoint)
     */
    public function destroy($id)
    {
        try {
            $user = User::findOrFail($id);
            
            // No permitir eliminar usuarios con asistencias a eventos
            if ($user->eventAttendances()->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se puede eliminar un usuario con historial de asistencias'
                ], 400);
            }
            
            DB::beginTransaction();
            
            // Eliminar registros relacionados
            $user->person()->delete();
            $user->companies()->delete();
            
            // Eliminar de la tabla de roles
            DB::table('user_role')->where('user_id', $user->id)->delete();
            
            $user->delete();
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Usuario eliminado exitosamente'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar el usuario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get user statistics (API endpoint)
     */
    public function getUserStats()
    {
        try {
            $stats = [
                'total_users' => User::count(),
                'active_users' => User::where('blocked', false)->count(),
                'blocked_users' => User::where('blocked', true)->count(),
                'verified_users' => User::where('email_verified', true)->count(),
                'personal_users' => DB::table('user_role')->where('rol_id', 5)->count(),
                'institutional_users' => DB::table('user_role')->where('rol_id', 6)->count(),
                'recent_registrations' => User::where('created_at', '>=', now()->subDays(30))->count()
            ];
            
            return response()->json($stats);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}