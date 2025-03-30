<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;

use App\Models\Person;
use App\Models\User;
use App\Models\Company;
use App\Models\Contact;
use App\Models\UserType;
use App\Models\UserStatus;
use App\Models\Gender;
use App\Models\ListCompany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RegistroController extends Controller
{
    /**
     * Muestra la vista inicial del registro donde se selecciona el tipo
     */
    public function index()
    {
        // Lista de instituciones educativas y centros de investigación
        $instituciones = [
            'UPSRJ' => 'Universidad Politécnica de San Rosa Jáuregui',
            'UPQ' => 'Universidad Politécnica de Querétaro',
            'SEDEQ' => 'SEDEQ. Coordinación de Educación Superior',
            'UNAQ' => 'Universidad Nacional de Aeronáutica del Estado de Querétaro',
            'UTEQ' => 'Universidad Tecnológica del Estado de Querétaro',
            'UTC' => 'Universidad Tecnológica de corregidora',
            'UTSJR' => 'Universidad Tecnológica de San Juan del Río',
            'UAQ' => 'Universidad Autónoma de Querétaro',
            'TECNM' => 'Tecnológico Nacional de México',
            'ENES' => 'Escuela Nacional de Estudios Superiores campus Juriquilla',
            'CBENEQ' => 'Centenaria y Benemérita Escuela Normal del Estado de Querétaro',
            'UPN' => 'Universidad Pedagógica Nacional',
            'TECNM_QRO' => 'Tecnológico Nacional de México, campus Querétaro',
            'TECNM_SJR' => 'Tecnológico Nacional de México, campus San Juan del Río',
            'CCG_UNAM' => 'Centro de Ciencias Genómicas (CCG) - UNAM',
            'CCM_UNAM' => 'Centro de Ciencias Matemáticas (CCM) - UNAM',
            'CFATA_UNAM' => 'Centro de Física Aplicada y Tecnología Avanzada (CFATA) - UNAM',
            'CIGA_UNAM' => 'Centro de Investigaciones en Geografía Ambiental (CIGA) - UNAM',
            'CTV_UAQ' => 'Centro de Tecnologías para la Vivienda - UAQ',
            'CIM_UAQ' => 'Centro de investigación multidisciplinario (CIM) - UAQ',
            'CEDIT_UAQ' => 'Centro de diseño e innovación Tecnológica (CEDIT) - UAQ',
            'CICATA_IPN' => 'Centro de Investigación en Ciencia Aplicada y Tecnología Avanzada (CICATA-IPN)',
            'CIEEN_ENEQ' => 'Centro de Investigaciones Educativas CIEEN (ENEQ)',
            'ITESM_CQ' => 'Instituto Tecnológico y de Estudios Superiores de Monterrey, Campus Querétaro (ITESM-CQ)',
            'OTRO' => 'Otra institución o empresa'
        ];

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
        $institucion = $request->query('institucion');
        
        return Inertia::render('Auth/RegistroInstitucional', [
            'institucion' => $institucion
        ]);
    }

    /**
     * Procesa el registro de persona individual
     */
    public function storePersonal(Request $request)
    {
        // Validar datos con mensajes más detallados
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'second_last_name' => 'nullable|string|max:100',
            'birthdate' => 'nullable|date',
            'gender' => 'nullable|in:M,F,Other',
            'email' => 'required|email|max:100|unique:users,email',
            'password' => 'required|min:8|confirmed',
            'phone' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return redirect()->back()
                ->withErrors($validator)
                ->withInput()
                ->with('error_message', 'Error de validación: ' . implode(', ', $validator->errors()->all()));
        }

        try {
            // Iniciar transacción
            DB::beginTransaction();
            
            Log::info('Iniciando registro de usuario: ' . $request->email);

            // Obtener o crear Gender
            try {
                $genderCode = $request->gender ?: 'M';
                $gender = Gender::firstOrCreate(['name' => $genderCode]);
                Log::info('Gender encontrado/creado:', ['id' => $gender->id, 'name' => $gender->name]);
            } catch (\Exception $e) {
                Log::error('Error al obtener/crear gender:', ['error' => $e->getMessage()]);
                throw new \Exception('Error al obtener género: ' . $e->getMessage());
            }

            // Crear usuario - Usando solo las columnas que existen en la tabla users
            try {
                Log::info('Creando usuario...');
                
                $user = new User();
                $user->name = $request->name;  // Usar name en lugar de guardarlo solo en Person
                $user->email = $request->email;
                $user->password = Hash::make($request->password); // Hash directo sin salt
                $user->save();
                
                Log::info('Usuario creado exitosamente:', ['id' => $user->id, 'email' => $user->email]);
            } catch (\Exception $e) {
                Log::error('Error al crear usuario:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                throw new \Exception('Error al crear usuario: ' . $e->getMessage());
            }

            // Calcular la edad
            $age = 0;
            if ($request->birthdate) {
                $birthdate = new \DateTime($request->birthdate);
                $today = new \DateTime();
                $age = $birthdate->diff($today)->y;
                Log::info('Edad calculada:', ['age' => $age]);
            }

            // Crear persona
            try {
                Log::info('Creando persona...');
                
                $person = new Person();
                $person->name = $request->name;
                $person->last_name = $request->last_name;
                $person->second_last_name = $request->second_last_name;
                $person->gender_id = $gender->id;
                $person->user_id = $user->id;
                $person->birthdate = $request->birthdate ?: now();
                $person->age = $age;
                $person->save();
                
                Log::info('Persona creada exitosamente:', ['id' => $person->id, 'name' => $person->name]);
            } catch (\Exception $e) {
                Log::error('Error al crear persona:', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                throw new \Exception('Error al crear persona: ' . $e->getMessage());
            }

            // Crear contacto si hay teléfono
            if ($request->phone) {
                try {
                    Log::info('Creando contacto...');
                    
                    $contact = new Contact();
                    $contact->person_id = $person->id;
                    $contact->email = $request->email;
                    $contact->phone = $request->phone;
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

            // Redirección normal con Inertia
            return redirect()->route('login')
                ->with('success', 'Registro exitoso. Ahora puedes iniciar sesión con ' . $request->email);

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
        // Validar datos con los nuevos nombres de campos en inglés
        $validator = Validator::make($request->all(), [
            'name_empresa' => 'required|string|max:100',
            'description' => 'nullable|string',
            'responsible_name' => 'required|string|max:100',
            'last_name' => 'required|string|max:100',
            'second_last_name' => 'nullable|string|max:100',
            'email' => 'required|email|max:100|unique:users,email',
            'phone' => 'nullable|string|max:20',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Iniciar transacción
            DB::beginTransaction();
            
            Log::info('Iniciando registro institucional: ' . $request->email);

            // Obtener o crear un género (predeterminado M)
            $gender = Gender::firstOrCreate(['name' => 'M']);

            // Crear usuario - Solo usando columnas existentes
            $user = new User();
            $user->name = $request->responsible_name;
            $user->email = $request->email;
            $user->password = Hash::make($request->password);
            $user->save();
            Log::info('Usuario institucional creado con ID: ' . $user->id);

            // Crear persona (responsable de la empresa)
            Log::info('Creando persona responsable');
            $person = new Person();
            $person->name = $request->responsible_name;
            $person->last_name = $request->last_name;
            $person->second_last_name = $request->second_last_name;
            $person->gender_id = $gender->id;
            $person->user_id = $user->id;
            $person->birthdate = now(); // Fecha predeterminada
            $person->age = 0; // Edad predeterminada
            $person->save();
            Log::info('Persona responsable creada con ID: ' . $person->id);

            // Crear contacto
            Log::info('Creando contacto');
            $contact = new Contact();
            $contact->person_id = $person->id;
            $contact->email = $request->email;
            $contact->phone = $request->phone;
            $contact->deleted = false;
            $contact->save();
            Log::info('Contacto creado con ID: ' . $contact->id);

            // Obtener o crear el tipo de empresa predeterminado
            $listCompany = ListCompany::firstOrCreate(
                ['name' => 'Other'],
                []
            );

            // Crear empresa
            Log::info('Creando empresa');
            $company = new Company();
            $company->name = $request->name_empresa;
            $company->description = $request->description;
            $company->list_companies_id = $listCompany->id;
            
            // Solución para el problema del teléfono
            if ($request->phone) {
                // Eliminar caracteres no numéricos
                $phoneNumber = preg_replace('/\D/', '', $request->phone);
                // Limitar el número a 9 dígitos (para estar seguros)
                $phoneNumber = substr($phoneNumber, -9);
                // Si después de todo queda vacío, usar 0
                if (empty($phoneNumber)) {
                    $phoneNumber = '0';
                }
                // Asegurarse de que sea un número válido
                $phoneNumber = intval($phoneNumber);
                if ($phoneNumber > 999999999) {
                    $phoneNumber = 999999999; // Máximo valor seguro
                }
                $company->phone = $phoneNumber;
            } else {
                $company->phone = 0; // Valor predeterminado
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

            // Almacenar el ID de la empresa en la sesión (para uso posterior)
            session(['company_id' => $company->id]);

            DB::commit();

            // Redirección normal 
            return redirect()->route('login')
                ->with('success', 'Registro institucional exitoso. Ahora puede iniciar sesión.');

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
}