<?php

namespace App\Http\Controllers\Auth;

use Illuminate\Routing\Controller;
use App\Models\Person;
use App\Models\User;
use App\Models\Company;
use App\Models\Contact;
use App\Models\Gender;
use App\Models\ListCompany;
use App\Models\PendingRegistration;
use App\Services\EmailVerificationService;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
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
    public function __construct(EmailVerificationService $emailVerificationService)
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
                'before:today',                     
                'after:'.Carbon::now()->subYears(100)->toDateString(), 
                'before:'.Carbon::now()->subYears(self::MIN_AGE)->toDateString(),  
            ],
            'genero' => 'nullable|in:M,F,Otro',
            'email' => [
                'required',
                'string',
                'email:rfc,dns',           // Validación RFC y DNS de correo electrónico
                'max:100',
                'unique:users,email',      // Sólo verificamos usuarios confirmados
                // Eliminamos 'unique:pending_registrations,email' para permitir reintento
            ],
            'telefono' => [
                'nullable',
                'string',
                'regex:/^[0-9]{10}$/',     // Exactamente 10 dígitos numéricos
            ],
            'password' => [
                'required',
                'string', 
                'min:8',                   // Mínimo 8 caracteres
                'regex:/[a-zA-Z]/',        // Al menos una letra
                'regex:/[0-9]/',           // Al menos un número
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
            'email.unique' => 'Este correo electrónico ya está registrado en el sistema.',
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
            // Verificar si existe un registro pendiente con este email y eliminarlo
            $existingPending = PendingRegistration::where('email', $request->email)->first();
            
            if ($existingPending) {
                Log::info('Eliminando registro pendiente existente para: ' . $request->email);
                $existingPending->delete();
            }
            
            // Generar token de 5 dígitos para verificación
            $token = str_pad(mt_rand(1, 99999), 5, '0', STR_PAD_LEFT);
            
            Log::info('Iniciando registro pendiente para usuario personal: ' . $request->email);
            
            // Crear registro pendiente con todos los datos del formulario
            // Excluimos _token, password_confirmation y guardamos password en hash
            $formData = $request->except(['_token', 'password_confirmation']);
            $formData['password'] = Hash::make($request->password);
            
            $pendingRegistration = PendingRegistration::create([
                'email' => $request->email,
                'token' => $token,
                'registration_data' => $formData,
                'registration_type' => 'personal',
                'expires_at' => now()->addHours(24)
            ]);
            
            Log::info('Registro pendiente creado con ID: ' . $pendingRegistration->id);
            
            // Enviar correo con token
            try {
                Mail::to($request->email)->send(new \App\Mail\EmailVerification(
                    (object)['email' => $request->email], // Simulamos un objeto User para compatibilidad
                    $token
                ));
                
                Log::info('Correo de verificación enviado a ' . $request->email . ' con token ' . $token);
                
                // Si el cliente espera JSON (Inertia/AJAX), enviar respuesta adecuada
                if ($request->wantsJson()) {
                    return response()->json([
                        'success' => true,
                        'email' => $request->email,
                        'message' => 'Registro iniciado. Por favor verifica tu correo electrónico con el código enviado.'
                    ]);
                }
                
                // Si no es JSON, mostrar modal de verificación
                return back()->with([
                    'success' => 'Registro iniciado. Por favor verifica tu correo electrónico.',
                    'registered_email' => $request->email,
                    'show_verification_modal' => true
                ]);
                
            } catch (\Exception $e) {
                Log::error('Error al enviar correo de verificación: ' . $e->getMessage());
                
                // Si falla el envío, informar al usuario
                return redirect()->route('verification.notice')
                    ->with('warning', 'Tu registro ha sido iniciado, pero hubo un problema al enviar el correo de verificación.')
                    ->with('email', $request->email);
            }

        } catch (\Exception $e) {
            // Registrar el error detallado
            Log::error('Error en registro pendiente personal:', ['message' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
            
            // Redireccionar con mensaje de error
            return redirect()->back()
                ->with('error', 'Error al iniciar registro: ' . $e->getMessage())
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