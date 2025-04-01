<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Routing\Controller;
use App\Models\Person;
use App\Models\User;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Gender;
use App\Models\ListCompany;
use App\Services\EmailVerificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class RegistroController extends Controller
{
    /**
     * Servicio de verificación de email
     *
     * @var \App\Services\EmailVerificationService
     */
    protected $emailVerificationService;
    
    /**
     * Edad mínima permitida para registrarse
     */
    protected const MIN_AGE = 15;

    /**
     * Crear una nueva instancia de controlador.
     *
     * @param EmailVerificationService $emailVerificationService
     * @return void
     */
    public function __construct(EmailVerificationService $emailVerificationService = null)
    {
        $this->emailVerificationService = $emailVerificationService;
        $this->middleware('guest');
    }

    /**
     * Muestra la vista inicial del registro donde se selecciona el tipo
     */
    public function index()
    {
        // Obtener el listado de instituciones desde la base de datos
        $listCompanies = ListCompany::orderBy('name')->get();
        
        // Si no hay instituciones en la base de datos, usar lista predeterminada
        if ($listCompanies->isEmpty()) {
            $instituciones = [
                ['id' => 'UPSRJ', 'nombre' => 'Universidad Politécnica de San Rosa Jáuregui'],
                ['id' => 'UPQ', 'nombre' => 'Universidad Politécnica de Querétaro'],
                ['id' => 'SEDEQ', 'nombre' => 'SEDEQ. Coordinación de Educación Superior'],
                ['id' => 'UNAQ', 'nombre' => 'Universidad Nacional de Aeronáutica del Estado de Querétaro'],
                ['id' => 'UTEQ', 'nombre' => 'Universidad Tecnológica del Estado de Querétaro'],
                ['id' => 'UTC', 'nombre' => 'Universidad Tecnológica de corregidora'],
                ['id' => 'UTSJR', 'nombre' => 'Universidad Tecnológica de San Juan del Río'],
                ['id' => 'UAQ', 'nombre' => 'Universidad Autónoma de Querétaro'],
                ['id' => 'TECNM', 'nombre' => 'Tecnológico Nacional de México'],
                ['id' => 'ENES', 'nombre' => 'Escuela Nacional de Estudios Superiores campus Juriquilla'],
                ['id' => 'OTRO', 'nombre' => 'Otra institución o empresa']
            ];
        } else {
            // Transformar datos de la BD al formato esperado por el frontend
            $instituciones = $listCompanies->map(function($company) {
                return [
                    'id' => (string)$company->id,
                    'nombre' => $company->name
                ];
            })->toArray();
            
            // Agregar opción "Otra" si no existe
            $hasOtro = false;
            foreach ($instituciones as $inst) {
                if ($inst['nombre'] === 'Otra institución o empresa') {
                    $hasOtro = true;
                    break;
                }
            }
            
            if (!$hasOtro) {
                $instituciones[] = ['id' => 'OTRO', 'nombre' => 'Otra institución o empresa'];
            }
        }

        return Inertia::render('Auth/Registro', [
            'instituciones' => $instituciones
        ]);
    }

    public function store(Request $request)
    {
        Log::info('Data received in store method:', $request->all());
        
        // Redirige a storePersonal o storeInstitucional según el tipo de registro
        if ($request->has('registration_type')) {
            if ($request->registration_type === 'personal') {
                return $this->storePersonal($request);
            } else {
                return $this->storeInstitucional($request);
            }
        }
        
        return back()->with('error', 'Invalid registration type');
    }

    /**
     * Muestra el formulario para registro personal
     */
    public function createPersonal()
    {
        return Inertia::render('Auth/RegistroPersonal');
    }

    /**
     * Muestra el formulario para registro de institución/empresa
     */
    public function createInstitucional(Request $request)
    {
        $institucionId = $request->query('institucion');
        $institucionNombre = '';
        
        // Obtener lista de instituciones
        $listCompanies = ListCompany::orderBy('name')->get();
        
        if ($listCompanies->isEmpty()) {
            // Lista predeterminada si no hay datos en la BD
            $instituciones = [
                ['id' => 'UPSRJ', 'nombre' => 'Universidad Politécnica de San Rosa Jáuregui'],
                ['id' => 'UPQ', 'nombre' => 'Universidad Politécnica de Querétaro'],
                ['id' => 'SEDEQ', 'nombre' => 'SEDEQ. Coordinación de Educación Superior'],
                ['id' => 'UNAQ', 'nombre' => 'Universidad Nacional de Aeronáutica del Estado de Querétaro'],
                ['id' => 'UTEQ', 'nombre' => 'Universidad Tecnológica del Estado de Querétaro'],
                ['id' => 'UTC', 'nombre' => 'Universidad Tecnológica de corregidora'],
                ['id' => 'UTSJR', 'nombre' => 'Universidad Tecnológica de San Juan del Río'],
                ['id' => 'UAQ', 'nombre' => 'Universidad Autónoma de Querétaro'],
                ['id' => 'TECNM', 'nombre' => 'Tecnológico Nacional de México'],
                ['id' => 'ENES', 'nombre' => 'Escuela Nacional de Estudios Superiores campus Juriquilla'],
                ['id' => 'OTRO', 'nombre' => 'Otra institución o empresa']
            ];
            
            // Buscar nombre de institución en la lista predeterminada
            if ($institucionId) {
                foreach ($instituciones as $inst) {
                    if ($inst['id'] === $institucionId) {
                        $institucionNombre = $inst['nombre'];
                        break;
                    }
                }
            }
        } else {
            // Transformar datos de la BD al formato esperado por el frontend
            $instituciones = $listCompanies->map(function($company) {
                return [
                    'id' => (string)$company->id,
                    'nombre' => $company->name
                ];
            })->toArray();
            
            // Agregar opción "Otra" si no existe
            $hasOtro = false;
            foreach ($instituciones as $inst) {
                if ($inst['nombre'] === 'Otra institución o empresa') {
                    $hasOtro = true;
                    break;
                }
            }
            
            if (!$hasOtro) {
                $instituciones[] = ['id' => 'OTRO', 'nombre' => 'Otra institución o empresa'];
            }
            
            // Buscar nombre de institución en la BD
            if ($institucionId && is_numeric($institucionId)) {
                $institucion = ListCompany::find($institucionId);
                if ($institucion) {
                    $institucionNombre = $institucion->name;
                }
            }
        }
        
        return Inertia::render('Auth/RegistroInstitucional', [
            'institucion' => $institucionNombre,
            'institucionId' => $institucionId,
            'institucionesList' => $instituciones
        ]);
    }

    /**
     * Procesa el registro de persona individual
     */
    public function storePersonal(Request $request)
    {
        // Reglas de validación mejoradas
        $rules = [
            'nombres' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'fecha_nacimiento' => [
                'nullable',
                'date',
                'before:today',                      // No permitir fechas futuras
                'after:'.Carbon::now()->subYears(100)->toDateString(),  // No permitir edades irreales (> 100 años)
                'before:'.Carbon::now()->subYears(self::MIN_AGE)->toDateString(),  // Debe tener al menos MIN_AGE años
            ],
            'genero' => 'nullable|in:M,F,Otro',
            'email' => [
                'required',
                'string',
                'email:rfc,dns',                     // Validación RFC y DNS de correo electrónico
                'max:100',
                'unique:users,email',
            ],
            'telefono' => [
                'nullable',
                'string',
                'regex:/^[0-9]{10}$/',               // Exactamente 10 dígitos numéricos
            ],
            'password' => [
                'required',
                'string', 
                'min:8',                             // Mínimo 8 caracteres
                'regex:/[a-zA-Z]/',                  // Al menos una letra
                'regex:/[0-9]/',                     // Al menos un número
                'confirmed'
            ],
        ];
        
        // Mensajes personalizados
        $messages = [
            'nombres.required' => 'El nombre es obligatorio.',
            'apellido_paterno.required' => 'El apellido paterno es obligatorio.',
            'fecha_nacimiento.before' => 'La fecha de nacimiento no puede ser en el futuro.',
            'fecha_nacimiento.after' => 'La fecha de nacimiento no es válida.',
            'fecha_nacimiento.before' => 'Debes tener al menos ' . self::MIN_AGE . ' años para registrarte.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'telefono.regex' => 'El número telefónico debe tener 10 dígitos.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.regex' => 'La contraseña debe incluir al menos una letra y un número.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ];

        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput()
                ->with('error_message', 'Error de validación: ' . implode(', ', $validator->errors()->all()));
        }

        try {
            // Iniciar transacción
            DB::beginTransaction();
            
            Log::info('Iniciando registro de usuario personal: ' . $request->email);

            // 1. Crear el usuario
            try {
                $statusId = 1; // Suponiendo que 1 es el status "activo"
                
                $user = new User();
                $user->email = $request->email;
                $user->password = Hash::make($request->password);
                $user->email_verified = false;
                $user->status_id = $statusId;
                $user->salt = bin2hex(random_bytes(16)); // Generar salt aleatoria
                $user->save();
                
                Log::info('Usuario creado exitosamente:', ['id' => $user->id, 'email' => $user->email]);
            } catch (\Exception $e) {
                Log::error('Error al crear usuario:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                throw new \Exception('Error al crear usuario: ' . $e->getMessage());
            }

            // 2. Asignar rol personal (5)
            try {
                $this->assignUserRole($user->id, 5); // 5 es el ID del rol "Usuario"
                Log::info('Rol personal (5) asignado al usuario');
            } catch (\Exception $e) {
                Log::error('Error al asignar rol personal:', ['error' => $e->getMessage()]);
                throw new \Exception('Error al asignar rol: ' . $e->getMessage());
            }

            // 3. Obtener o crear Gender
            try {
                $genderCode = $request->genero ?: 'M';
                $gender = Gender::firstOrCreate(['name' => $genderCode]);
                Log::info('Gender encontrado/creado:', ['id' => $gender->id, 'name' => $gender->name]);
            } catch (\Exception $e) {
                Log::error('Error al obtener/crear gender:', ['error' => $e->getMessage()]);
                throw new \Exception('Error al obtener género: ' . $e->getMessage());
            }

            // 4. Calcular la edad
            $age = 0;
            if ($request->fecha_nacimiento) {
                $birthdate = new \DateTime($request->fecha_nacimiento);
                $today = new \DateTime();
                $age = $birthdate->diff($today)->y;
                Log::info('Edad calculada:', ['age' => $age]);
            }

            // 5. Crear persona
            try {
                Log::info('Creando persona...');
                
                $person = new Person();
                $person->name = $request->nombres;
                $person->last_name = $request->apellido_paterno;
                $person->second_last_name = $request->apellido_materno ?? '';
                $person->gender_id = $gender->id;
                $person->user_id = $user->id;
                $person->birth_date = $request->fecha_nacimiento ?: now()->subYears(self::MIN_AGE); // Fecha predeterminada
                $person->age = $age > 0 ? $age : self::MIN_AGE; // Edad mínima por defecto
                $person->save();
                
                Log::info('Persona creada exitosamente:', ['id' => $person->id, 'name' => $person->name]);
            } catch (\Exception $e) {
                Log::error('Error al crear persona:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                throw new \Exception('Error al crear persona: ' . $e->getMessage());
            }

            // 6. Crear contacto si hay teléfono
            if ($request->telefono) {
                try {
                    Log::info('Creando contacto...');
                    
                    $contact = new Contact();
                    $contact->person_id = $person->id;
                    $contact->email = $request->email;
                    $contact->phone = $request->telefono;
                    $contact->deleted = false;
                    $contact->save();
                    
                    Log::info('Contacto creado exitosamente:', ['id' => $contact->id]);
                } catch (\Exception $e) {
                    Log::error('Error al crear contacto:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                    throw new \Exception('Error al crear contacto: ' . $e->getMessage());
                }
            }

            // Confirmar la transacción
            DB::commit();
            Log::info('Transacción completada exitosamente. Usuario registrado:', ['email' => $request->email]);

            // Enviar correo de verificación si el servicio está disponible
            // if ($this->emailVerificationService) {
            //     try {
            //         $this->emailVerificationService->sendVerificationEmail($user);
            //         session()->put('email', $user->email);
                    
            //         // Redirigir a la página de verificación
            //         return redirect()->route('login')
            //             ->with('success', 'Registro exitoso. Ahora puedes iniciar sesión con ' . $request->email);
            //     } catch (\Exception $e) {
            //         Log::error('Error al enviar correo de verificación:', ['error' => $e->getMessage()]);
            //         // Continuar con la redirección normal si falla el envío del correo
            //     }
            // }

            $user->markEmailAsVerified();
            Log::info("Email marcado como verificado automáticamente: " . $user->email);    

            // Redirección normal con Inertia si no hay servicio de verificación
            session()->flash('registration_success', true);
            session()->flash('registered_email', $request->email);

        } catch (\Exception $e) {
            // Revertir transacción en caso de error
            DB::rollBack();
            
            // Registrar el error detallado
            Log::error('Error en registro:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            
            // Redireccionar con mensaje de error
            return redirect()->back()
                ->with('error', 'Error al registrar: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Procesa el registro de institución/empresa
     */
    public function storeInstitucional(Request $request)
    {
        // Reglas de validación mejoradas
        $rules = [
            'nombre_empresa' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'nombre_responsable' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'email' => [
                'required',
                'string',
                'email:rfc,dns',                     // Validación RFC y DNS de correo electrónico
                'max:100',
                'unique:users,email',
            ],
            'telefono' => [
                'nullable',
                'string',
                'regex:/^[0-9]{10}$/',               // Exactamente 10 dígitos numéricos
            ],
            'password' => [
                'required',
                'string', 
                'min:8',                             // Mínimo 8 caracteres
                'regex:/[a-zA-Z]/',                  // Al menos una letra
                'regex:/[0-9]/',                     // Al menos un número
                'confirmed'
            ],
        ];
        
        // Mensajes personalizados
        $messages = [
            'nombre_empresa.required' => 'El nombre de la empresa es obligatorio.',
            'nombre_responsable.required' => 'El nombre del responsable es obligatorio.',
            'apellido_paterno.required' => 'El apellido paterno es obligatorio.',
            'email.required' => 'El correo electrónico es obligatorio.',
            'email.email' => 'El formato del correo electrónico no es válido.',
            'email.unique' => 'Este correo electrónico ya está registrado.',
            'telefono.regex' => 'El número telefónico debe tener 10 dígitos.',
            'password.required' => 'La contraseña es obligatoria.',
            'password.min' => 'La contraseña debe tener al menos 8 caracteres.',
            'password.regex' => 'La contraseña debe incluir al menos una letra y un número.',
            'password.confirmed' => 'Las contraseñas no coinciden.',
        ];
        
        $validator = Validator::make($request->all(), $rules, $messages);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Iniciar transacción
            DB::beginTransaction();
            
            Log::info('Iniciando registro institucional: ' . $request->email);

            try {
                $statusId = 1;
                
                $user = new User();
                $user->email = $request->email;
                $user->password = Hash::make($request->password);
                $user->email_verified = false;
                $user->status_id = $statusId;
                $user->salt = bin2hex(random_bytes(16)); // Generar salt aleatoria
                $user->save();
                
                Log::info('Usuario institucional creado con ID: ' . $user->id);
            } catch (\Exception $e) {
                Log::error('Error al crear usuario institucional:', ['error' => $e->getMessage()]);
                throw new \Exception('Error al crear usuario: ' . $e->getMessage());
            }
            
            // 2. Asignar rol institucional (6)
            try {
                $this->assignUserRole($user->id, 6); // 6 es el ID del rol "Institucional"
                Log::info('Rol institucional (6) asignado al usuario');
            } catch (\Exception $e) {
                Log::error('Error al asignar rol institucional:', ['error' => $e->getMessage()]);
                throw new \Exception('Error al asignar rol: ' . $e->getMessage());
            }

            // 3. Obtener o crear un género (predeterminado M)
            $gender = Gender::firstOrCreate(['name' => 'M']);

            // 4. Crear persona (responsable de la empresa)
            Log::info('Creando persona responsable');
            $person = new Person();
            $person->name = $request->nombre_responsable;
            $person->last_name = $request->apellido_paterno;
            $person->second_last_name = $request->apellido_materno ?? '';
            $person->gender_id = $gender->id;
            $person->user_id = $user->id;
            $person->birth_date = now()->subYears(30); // Fecha predeterminada (30 años)
            $person->age = 30; // Edad predeterminada para responsable
            $person->save();
            Log::info('Persona responsable creada con ID: ' . $person->id);

            // 5. Crear contacto
            Log::info('Creando contacto');
            $contact = new Contact();
            $contact->person_id = $person->id;
            $contact->email = $request->email;
            $contact->phone = $request->telefono;
            $contact->deleted = false;
            $contact->save();
            Log::info('Contacto creado con ID: ' . $contact->id);

            // 6. Obtener o crear el tipo de empresa
            // Si se recibió un ID de institución existente, usarlo
            if ($request->institucion_id && $request->institucion_id != 'OTRO') {
                // Intentar encontrar la institución por ID
                $listCompany = ListCompany::find($request->institucion_id);
                
                // Si no existe, crear una nueva
                if (!$listCompany) {
                    $listCompany = ListCompany::create(['name' => $request->nombre_empresa]);
                }
            } else {
                // Buscar o crear por el nombre proporcionado
                $listCompany = ListCompany::firstOrCreate(['name' => $request->nombre_empresa]);
            }

            // 7. Crear empresa y asociarla con el usuario
            Log::info('Creando empresa');
            $company = new Company();
            $company->description = $request->descripcion ?? '';
            $company->list_companies_id = $listCompany->id;
            
            // Verificar si el modelo Company tiene la columna user_id
            if (Schema::hasColumn('companies', 'user_id')) {
                $company->user_id = $user->id; // Asociar con el usuario
                Log::info('Empresa asociada al usuario: ' . $user->id);
            }
            
            // Solución para el problema del teléfono
            if ($request->telefono) {
                // Eliminar caracteres no numéricos
                $phoneNumber = preg_replace('/\D/', '', $request->telefono);
                $company->phone = intval($phoneNumber);
            if (strlen($phoneNumber) > 9) {
                $phoneNumber = substr($phoneNumber, -9);
            } 
                $company->phone = intval($phoneNumber);
            } else {
                $company->phone = 0;
            }
            
            $company->save();
            Log::info('Empresa creada con ID: ' . $company->id);

            // 8. Crear relación entre empresa y contacto
            DB::table('company_contacts')->insert([
                'company_id' => $company->id, 
                'contact_id' => $contact->id,
                'created_at' => now(),
                'updated_at' => now()
            ]);
            Log::info('Relación empresa-contacto creada');

            // Almacenar el ID de la empresa en la sesión (para uso posterior)
            session(['company_id' => $company->id]);

            DB::commit();

            // Enviar correo de verificación si el servicio está disponible
            // if ($this->emailVerificationService) {
            //     try {
            //         $this->emailVerificationService->sendVerificationEmail($user);
            //         session()->put('email', $user->email);
                    
            //         // Redirigir a la página de verificación
            //         return redirect()->route('login')
            //             ->with('success', 'Registro institucional exitoso. Ahora puedes iniciar sesión.');
            //     } catch (\Exception $e) {
            //         Log::error('Error al enviar correo de verificación institucional:', ['error' => $e->getMessage()]);
            //         // Continuar con la redirección normal si falla el envío del correo
            //     }
            // }

            $user->markEmailAsVerified();
            Log::info('Correo electrónico verificado para el usuario: ' . $user->email);

            // Redirección normal 
            return redirect()->route('login')
                ->with('success', 'Registro institucional exitoso. Ahora puedes iniciar sesión.');

        } catch (\Exception $e) {
            // Revertir transacción en caso de error
            DB::rollBack();
            
            Log::error('Error en registro institucional: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return redirect()->back()
                ->with('error', 'Error al registrar institución: ' . $e->getMessage())
                ->withInput();
        }
    }
    
    /**
     * Asigna un rol al usuario
     * 
     * Según las migraciones, hay dos tablas de roles: user_role y user_roles
     * Esta función intentará insertar en ambas para asegurar la compatibilidad.
     *
     * @param int $userId ID del usuario
     * @param int $roleId ID del rol a asignar
     * @return void
     */
    protected function assignUserRole($userId, $roleId)
    {
        try {
            // Intentar insertar en la tabla user_role (primera opción de la migración)
            try {
                DB::table('user_role')->insert([
                    'user_id' => $userId,
                    'rol_id' => $roleId,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                Log::info("Rol $roleId asignado al usuario $userId en tabla user_role");
            } catch (\Exception $e) {
                Log::warning("No se pudo insertar en user_role: " . $e->getMessage());
            }
            
            // Intentar insertar en la tabla user_roles (segunda opción de la migración)
            try {
                DB::table('user_roles')->insert([
                    'user_id' => $userId,
                    'rol_id' => $roleId,
                    'created_at' => now(),
                    'updated_at' => now()
                ]);
                Log::info("Rol $roleId asignado al usuario $userId en tabla user_roles");
            } catch (\Exception $e) {
                Log::warning("No se pudo insertar en user_roles: " . $e->getMessage());
            }
            
        } catch (\Exception $e) {
            Log::error("Error al asignar rol: " . $e->getMessage());
            throw $e;
        }
    }
}