<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ListCompany>
 */
class ListCompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
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
      
        $acronym = fake()->unique()->randomElement(array_keys($instituciones));
        $fullName = $instituciones[$acronym];
        
        return [
            'name' => $fullName,
        ];
    }
}