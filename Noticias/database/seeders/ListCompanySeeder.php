<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\ListCompany;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class ListCompanySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Lista de instituciones educativas y centros de investigación
        $instituciones = [
            'Universidad Politécnica de San Rosa Jáuregui',
            'Universidad Politécnica de Querétaro',
            'SEDEQ. Coordinación de Educación Superior',
            'Universidad Nacional de Aeronáutica del Estado de Querétaro',
            'Universidad Tecnológica del Estado de Querétaro',
            'Universidad Tecnológica de corregidora',
            'Universidad Tecnológica de San Juan del Río',
            'Universidad Autónoma de Querétaro',
            'Tecnológico Nacional de México',
            'Escuela Nacional de Estudios Superiores campus Juriquilla',
            'Centenaria y Benemérita Escuela Normal del Estado de Querétaro',
            'Universidad Pedagógica Nacional',
            'Tecnológico Nacional de México, campus Querétaro',
            'Tecnológico Nacional de México, campus San Juan del Río',
            'Centro de Ciencias Genómicas (CCG) - UNAM',
            'Centro de Ciencias Matemáticas (CCM) - UNAM',
            'Centro de Física Aplicada y Tecnología Avanzada (CFATA) - UNAM',
            'Centro de Investigaciones en Geografía Ambiental (CIGA) - UNAM',
            'Centro de Tecnologías para la Vivienda - UAQ',
            'Centro de investigación multidisciplinario (CIM) - UAQ',
            'Centro de diseño e innovación Tecnológica (CEDIT) - UAQ',
            'Centro de Investigación en Ciencia Aplicada y Tecnología Avanzada (CICATA-IPN)',
            'Centro de Investigaciones Educativas CIEEN (ENEQ)',
            'Instituto Tecnológico y de Estudios Superiores de Monterrey, Campus Querétaro (ITESM-CQ)',
            'Otra institución o empresa'
        ];

        $this->command->info('Iniciando la carga de instituciones...');
        $count = 0;

        // Insertar cada institución solo si no existe ya
        foreach ($instituciones as $institucion) {
            try {
                $exists = ListCompany::where('name', $institucion)->exists();
                
                if (!$exists) {
                    ListCompany::create([
                        'name' => $institucion
                    ]);
                    $count++;
                }
            } catch (\Exception $e) {
                $this->command->error("Error al insertar institución {$institucion}: " . $e->getMessage());
                Log::error("Error en ListCompaniesSeeder: " . $e->getMessage());
            }
        }

        $this->command->info("Se insertaron {$count} nuevas instituciones.");
    }
}