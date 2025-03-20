<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Persona;
use App\Models\Usuario;
use App\Models\Empresa;
use App\Models\Contacto;
use App\Models\TipoUsuario;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
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
        // Validar datos
        $validator = Validator::make($request->all(), [
            'nombres' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'fecha_nacimiento' => 'nullable|date',
            'genero' => 'nullable|in:M,F,Otro',
            'email' => 'required|email|max:100|unique:usuarios,email',
            'password' => 'required|min:8|confirmed',
            'telefono' => 'nullable|string|max:20',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Iniciar transacción
            DB::beginTransaction();

            // Crear persona
            $persona = Persona::create([
                'nombres' => $request->nombres,
                'apellido_paterno' => $request->apellido_paterno,
                'apellido_materno' => $request->apellido_materno,
                'fecha_nacimiento' => $request->fecha_nacimiento,
                'genero' => $request->genero,
                'fecha_registro' => now(),
                'eliminado' => false
            ]);

            // Crear contacto
            if ($request->telefono) {
                Contacto::create([
                    'persona_id' => $persona->id,
                    'email' => $request->email,
                    'telefono' => $request->telefono,
                    'fecha_actualizacion_atributo' => now(),
                    'eliminado' => false
                ]);
            }

            // Obtener tipo de usuario "Personal"
            $tipoUsuarioPersonal = TipoUsuario::where('nombre', 'Personal')->first();
            if (!$tipoUsuarioPersonal) {
                // Si no existe, lo creamos
                $tipoUsuarioPersonal = TipoUsuario::create([
                    'nombre' => 'Personal',
                    'descripcion' => 'Usuario personal',
                    'eliminado' => false
                ]);
            }

            // Obtener status "Activo"
            $statusActivo = Status::where('nombre', 'Activo')->where('tipo', 'usuario')->first();
            if (!$statusActivo) {
                // Si no existe, lo creamos
                $statusActivo = Status::create([
                    'nombre' => 'Activo',
                    'descripcion' => 'Usuario activo',
                    'tipo' => 'usuario',
                    'eliminado' => false
                ]);
            }

            // Generar salt
            $salt = Str::random(16);

            // Crear usuario
            Usuario::create([
                'persona_id' => $persona->id,
                'tipo_usuario_id' => $tipoUsuarioPersonal->id,
                'status_id' => $statusActivo->id,
                'email' => $request->email,
                'salt' => $salt,
                'password' => Hash::make($salt . $request->password),
                'ultima_autenticacion' => null,
                'bloqueado' => false,
                'intentos_fallidos_contraseña' => 0,
                'eliminado' => false
            ]);

            DB::commit();

            // Redireccionar al login con mensaje de éxito
            return redirect()->route('login')
                ->with('success', 'Registro exitoso. Ahora puedes iniciar sesión.');

        } catch (\Exception $e) {
            // Revertir transacción en caso de error
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error al registrar usuario: ' . $e->getMessage())
                ->withInput();
        }
    }

    /**
     * Procesa el registro de institución/empresa
     */
    public function storeInstitucional(Request $request)
    {
        // Validar datos
        $validator = Validator::make($request->all(), [
            'nombre_empresa' => 'required|string|max:100',
            'descripcion' => 'nullable|string',
            'nombre_responsable' => 'required|string|max:100',
            'apellido_paterno' => 'required|string|max:100',
            'apellido_materno' => 'nullable|string|max:100',
            'email' => 'required|email|max:100|unique:usuarios,email',
            'telefono' => 'nullable|string|max:20',
            'password' => 'required|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return redirect()->back()->withErrors($validator)->withInput();
        }

        try {
            // Iniciar transacción
            DB::beginTransaction();

            // Crear persona (responsable de la empresa)
            $persona = Persona::create([
                'nombres' => $request->nombre_responsable,
                'apellido_paterno' => $request->apellido_paterno,
                'apellido_materno' => $request->apellido_materno,
                'fecha_registro' => now(),
                'eliminado' => false
            ]);

            // Crear contacto
            $contacto = Contacto::create([
                'persona_id' => $persona->id,
                'email' => $request->email,
                'telefono' => $request->telefono,
                'fecha_actualizacion_atributo' => now(),
                'eliminado' => false
            ]);

            // Crear empresa
            $empresa = Empresa::create([
                'nombre' => $request->nombre_empresa,
                'descripcion' => $request->descripcion,
                'contacto_id' => $contacto->id,
                'eliminado' => false
            ]);

            // Obtener tipo de usuario "Institucional"
            $tipoUsuarioInstitucional = TipoUsuario::where('nombre', 'Institucional')->first();
            if (!$tipoUsuarioInstitucional) {
                // Si no existe, lo creamos
                $tipoUsuarioInstitucional = TipoUsuario::create([
                    'nombre' => 'Institucional',
                    'descripcion' => 'Usuario institucional o empresarial',
                    'eliminado' => false
                ]);
            }

            // Obtener status "Activo"
            $statusActivo = Status::where('nombre', 'Activo')->where('tipo', 'usuario')->first();
            if (!$statusActivo) {
                // Si no existe, lo creamos
                $statusActivo = Status::create([
                    'nombre' => 'Activo',
                    'descripcion' => 'Usuario activo',
                    'tipo' => 'usuario',
                    'eliminado' => false
                ]);
            }

            // Generar salt
            $salt = Str::random(16);

            // Crear usuario
            $usuario = Usuario::create([
                'persona_id' => $persona->id,
                'tipo_usuario_id' => $tipoUsuarioInstitucional->id,
                'status_id' => $statusActivo->id,
                'email' => $request->email,
                'salt' => $salt,
                'password' => Hash::make($salt . $request->password),
                'ultima_autenticacion' => null,
                'bloqueado' => false,
                'intentos_fallidos_contraseña' => 0,
                'eliminado' => false
            ]);

            // Almacenamos el ID de la empresa en la sesión (para uso posterior)
            session(['empresa_id' => $empresa->id]);

            DB::commit();

            // Redireccionar al login con mensaje de éxito
            return redirect()->route('login')
                ->with('success', 'Registro institucional exitoso. Ahora puede iniciar sesión.');

        } catch (\Exception $e) {
            // Revertir transacción en caso de error
            DB::rollBack();
            return redirect()->back()
                ->with('error', 'Error al registrar institución: ' . $e->getMessage())
                ->withInput();
        }
    }
}