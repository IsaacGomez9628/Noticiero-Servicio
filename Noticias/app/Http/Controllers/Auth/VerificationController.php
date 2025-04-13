<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\PendingRegistration;
use App\Models\User;
use App\Models\Person;
use App\Models\Contact;
use App\Models\Company;
use App\Models\Gender;
use App\Models\ListCompany;
use App\Services\EmailVerificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Schema;
use Inertia\Inertia;

class VerificationController extends Controller
{
    /**
     * Edad mínima permitida para registrarse
     */
    protected const MIN_AGE = 15;
    
    /**
     * Servicio de verificación de email
     *
     * @var \App\Services\EmailVerificationService
     */
    protected $emailVerificationService;

    /**
     * Crear una nueva instancia de controlador.
     *
     * @param EmailVerificationService $emailVerificationService
     * @return void
     */
    public function __construct(EmailVerificationService $emailVerificationService)
    {
        $this->emailVerificationService = $emailVerificationService;
    }

    /**
     * Muestra la página de verificación de correo electrónico.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function notice(Request $request)
    {
        $email = $request->session()->get('email', $request->get('email', ''));
        
        return Inertia::render('Auth/VerifyEmail', [
            'email' => $email,
            'success' => session('success'),
            'error' => session('error'),
            'warning' => session('warning'),
            'verification_token' => null, // Only set for testing
        ]);
    }

    /**
     * Verifica el token proporcionado.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function verify(Request $request)
    {
        Log::debug('Token recibido:', [
            'token' => $request->token,
            'tipo' => gettype($request->token),
            'valor_raw' => $request->input('token')
        ]);

        // Si el token viene como array, convertirlo a string
        if (is_array($request->token)) {
            $token = implode('', $request->token);
        } else {
            $token = (string) $request->input('token');
        }
        
        $validator = Validator::make(['email' => $request->email, 'token' => $token], [
            'email' => 'required|email',
            'token' => 'required|string|size:5',
        ]);

        if ($validator->fails()) {
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'success' => false, 
                    'errors' => $validator->errors()
                ], 422);
            }
            
            return back()
                ->withErrors($validator)
                ->withInput();
        }

        // Buscar el registro pendiente
        $pendingRegistration = PendingRegistration::where('email', $request->email)
            ->first();
        
        if (!$pendingRegistration) {
            $errorMessage = 'No se encontró ningún registro pendiente para este correo electrónico.';
            
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'success' => false, 
                    'errors' => ['token' => [$errorMessage]]
                ], 422);
            }
            
            return back()
                ->with('error', $errorMessage);
        }
        
        // Verificar si el token coincide
        if ($pendingRegistration->token !== $token) {
            $errorMessage = 'El código de verificación es inválido. Por favor, intenta nuevamente.';
            
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'success' => false, 
                    'errors' => ['token' => [$errorMessage]]
                ], 422);
            }
            
            return back()
                ->with('error', $errorMessage);
        }
        
        if ($pendingRegistration->isExpired()) {
            $errorMessage = 'El código de verificación ha expirado. Por favor, solicita un nuevo código.';
            
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'success' => false, 
                    'errors' => ['token' => [$errorMessage]]
                ], 422);
            }
            
            return back()
                ->with('error', $errorMessage);
        }

        try {
            DB::beginTransaction();
            
            // Recuperar los datos del formulario
            $data = $pendingRegistration->registration_data;
            $registrationType = $pendingRegistration->registration_type;
            
            // Determinar qué tipo de registro es y llamar al método apropiado
            if ($registrationType === 'personal') {
                $result = $this->processPersonalRegistration($data);
            } else {
                $result = $this->processInstitutionalRegistration($data);
            }
            
            // Eliminar el registro pendiente
            $pendingRegistration->delete();
            
            DB::commit();
            
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'success' => true,
                    'message' => 'Cuenta verificada y creada exitosamente.'
                ]);
            }
            
            return redirect()->route('login')
                ->with('success', 'Cuenta verificada y creada exitosamente. Ahora puedes iniciar sesión.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error al crear usuario desde registro pendiente: ' . $e->getMessage(), [
                'trace' => $e->getTraceAsString()
            ]);
            
            $errorMessage = 'Hubo un problema al crear tu cuenta: ' . $e->getMessage();
            
            if ($request->expectsJson() || $request->wantsJson()) {
                return response()->json([
                    'success' => false,
                    'message' => $errorMessage
                ], 500);
            }
            
            return back()
                ->with('error', $errorMessage);
        }
    }

    /**
     * Procesa el registro de usuario personal.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    private function processPersonalRegistration($data)
    {
        // Crear usuario
        $statusId = $this->getOrCreateStatusId();
        
        $user = new User();
        $user->email = $data['email'];
        $user->password = $data['password']; // Ya está hasheado
        $user->email_verified = true; // Importante: ya está verificado
        $user->status_id = $statusId;
        $user->salt = bin2hex(random_bytes(16));
        $user->save();
        
        Log::info('Usuario personal creado exitosamente:', ['id' => $user->id, 'email' => $user->email]);

        // Asignar rol personal (5)
        $this->assignUserRole($user->id, 5);
        
        // Obtener o crear Gender
        $genderCode = $data['genero'] ?? 'M';
        $gender = Gender::firstOrCreate(['name' => $genderCode]);
        
        // Calcular edad
        $age = 0;
        if (!empty($data['fecha_nacimiento'])) {
            $birthdate = new \DateTime($data['fecha_nacimiento']);
            $today = new \DateTime();
            $age = $birthdate->diff($today)->y;
        }

        // Crear persona
        $person = new Person();
        $person->name = $data['nombres'];
        $person->last_name = $data['apellido_paterno'];
        $person->second_last_name = $data['apellido_materno'] ?? '';
        $person->gender_id = $gender->id;
        $person->user_id = $user->id;
        $person->birth_date = $data['fecha_nacimiento'] ?? now()->subYears(self::MIN_AGE);
        $person->age = $age > 0 ? $age : self::MIN_AGE;
        $person->save();
        
        Log::info('Persona creada exitosamente:', ['id' => $person->id, 'name' => $person->name]);
        
        // Crear contacto si hay teléfono
        if (!empty($data['telefono'])) {
            $contact = new Contact();
            $contact->person_id = $person->id;
            $contact->email = $data['email'];
            $contact->phone = $data['telefono'];
            $contact->deleted = false;
            $contact->save();
            
            Log::info('Contacto creado exitosamente:', ['id' => $contact->id]);
        }
        
        return $user;
    }

    /**
     * Procesa el registro de usuario institucional.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    private function processInstitutionalRegistration($data)
    {
        // Crear usuario
        $statusId = $this->getOrCreateStatusId();
        
        $user = new User();
        $user->email = $data['email'];
        $user->password = $data['password']; // Ya está hasheado
        $user->email_verified = true; // Importante: ya está verificado
        $user->status_id = $statusId;
        $user->salt = bin2hex(random_bytes(16));
        $user->save();
        
        Log::info('Usuario institucional creado exitosamente:', ['id' => $user->id, 'email' => $user->email]);

        // Asignar rol institucional (6)
        $this->assignUserRole($user->id, 6);
        
        // Obtener o crear un género (predeterminado M)
        $gender = Gender::firstOrCreate(['name' => 'M']);

        // Crear persona (responsable de la empresa)
        $person = new Person();
        $person->name = $data['nombre_responsable'];
        $person->last_name = $data['apellido_paterno'];
        $person->second_last_name = $data['apellido_materno'] ?? '';
        $person->gender_id = $gender->id;
        $person->user_id = $user->id;
        $person->birth_date = now()->subYears(30);
        $person->age = 30;
        $person->save();
        
        Log::info('Persona responsable creada con ID: ' . $person->id);

        // Crear contacto
        $contact = new Contact();
        $contact->person_id = $person->id;
        $contact->email = $data['email'];
        $contact->phone = $data['telefono'] ?? '';
        $contact->deleted = false;
        $contact->save();
        
        Log::info('Contacto creado con ID: ' . $contact->id);

        // Obtener o crear el tipo de empresa
        if (!empty($data['institucion_id']) && $data['institucion_id'] != 'OTRO') {
            $listCompany = ListCompany::find($data['institucion_id']);
            if (!$listCompany) {
                $listCompany = ListCompany::create(['name' => $data['nombre_empresa']]);
            }
        } else {
            $listCompany = ListCompany::firstOrCreate(['name' => $data['nombre_empresa']]);
        }

        // Crear empresa
        $company = new Company();
        $company->description = $data['descripcion'] ?? '';
        $company->list_companies_id = $listCompany->id;
        
        if (Schema::hasColumn('companies', 'user_id')) {
            $company->user_id = $user->id;
            Log::info('Empresa asociada al usuario: ' . $user->id);
        }
        
        // Manejar el teléfono
        if (!empty($data['telefono'])) {
            $phoneNumber = preg_replace('/\D/', '', $data['telefono']);
            if (strlen($phoneNumber) > 9) {
                $phoneNumber = substr($phoneNumber, -9);
            } 
            $company->phone = intval($phoneNumber);
        } else {
            $company->phone = 0;
        }
        
        $company->save();
        Log::info('Empresa creada con ID: ' . $company->id);

        // Crear relación entre empresa y contacto
        DB::table('company_contacts')->insert([
            'company_id' => $company->id, 
            'contact_id' => $contact->id,
            'created_at' => now(),
            'updated_at' => now()
        ]);
        Log::info('Relación empresa-contacto creada');
        
        return $user;
    }

    /**
     * Obtiene un ID de status existente o crea uno nuevo.
     *
     * @return int
     */
    private function getOrCreateStatusId()
    {
        $statusesExist = DB::table('statuses')->exists();
        
        if ($statusesExist) {
            $availableStatuses = DB::table('statuses')->pluck('id')->toArray();
            return $availableStatuses[0];
        } else {
            return DB::table('statuses')->insertGetId([
                'name' => 'Activo',
                'slug' => 'activo',
                'type' => 'user',
                'description' => 'Usuario con cuenta activa',
                'color' => '#28a745',
                'active' => true,
                'order' => 1,
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
    
    /**
     * Asigna un rol al usuario.
     * 
     * @param int $userId ID del usuario
     * @param int $roleId ID del rol a asignar
     * @return void
     */
    protected function assignUserRole($userId, $roleId)
    {
        try {
            // Intentar insertar en la tabla user_role
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
            
            // Intentar insertar en la tabla user_roles
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