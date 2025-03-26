<?php

namespace Database\Seeders;

use App\Models\Organizers;
use Illuminate\Database\Seeder;

class OrganizersSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $organizers = [
            [
                'name' => 'Secretaría de Cultura de Querétaro',
                'email' => 'cultura@queretaro.gob.mx',
                'phone' => '442-123-4567',
                'description' => 'Entidad gubernamental encargada de promover y difundir la cultura en el estado de Querétaro.',
                'web_site' => 'https://www.cultura.queretaro.gob.mx',
                'social_media' => '@CulturaQro',
                'direction' => 'Av. Constituyentes s/n, Centro Histórico',
                'city' => 'Querétaro',
                'active' => true,
            ],
            [
                'name' => 'Querétaro Convention Bureau',
                'email' => 'info@queretarocb.mx',
                'phone' => '442-234-5678',
                'description' => 'Organismo dedicado a la promoción de eventos y congresos en la ciudad de Querétaro.',
                'web_site' => 'https://www.queretarocb.mx',
                'social_media' => '@QroCB',
                'direction' => 'Blvd. Bernardo Quintana 204, Col. Carretas',
                'city' => 'Querétaro',
                'active' => true,
            ],
            [
                'name' => 'Asociación Vitivinícola de Querétaro',
                'email' => 'contacto@vitivinicolaqro.org',
                'phone' => '442-345-6789',
                'description' => 'Agrupación de productores de vino en la región que promueven el turismo enológico.',
                'web_site' => 'https://www.vinosdequeretaro.com',
                'social_media' => '@VinosQro',
                'direction' => 'Carretera a Tequisquiapan km 22, Ezequiel Montes',
                'city' => 'Querétaro',
                'active' => true,
            ],
            [
                'name' => 'Universidad Autónoma de Querétaro',
                'email' => 'extension@uaq.mx',
                'phone' => '442-456-7890',
                'description' => 'Institución educativa que organiza eventos académicos, culturales y deportivos a lo largo del año.',
                'web_site' => 'https://www.uaq.mx',
                'social_media' => '@UAQueretaro',
                'direction' => 'Centro Universitario, Cerro de las Campanas s/n',
                'city' => 'Querétaro',
                'active' => true,
            ],
            [
                'name' => 'Cámara de Comercio de Querétaro',
                'email' => 'eventos@camaradecomercioqro.org',
                'phone' => '442-567-8901',
                'description' => 'Organismo empresarial que impulsa el desarrollo económico a través de ferias y exposiciones.',
                'web_site' => 'https://www.camaradecomercioqro.org',
                'social_media' => '@CanacoComerciojQro',
                'direction' => 'Av. 5 de Febrero 1304, Col. San Pablo',
                'city' => 'Querétaro',
                'active' => true,
            ],
            [
                'name' => 'Colectivo Cultural Queretano',
                'email' => 'colectivoculturalqro@gmail.com',
                'phone' => '442-678-9012',
                'description' => 'Grupo de artistas y gestores culturales que promueven actividades artísticas independientes.',
                'web_site' => 'https://www.colectivoculturalqro.org',
                'social_media' => '@ColectivoCulturalQro',
                'direction' => 'Calle Hidalgo 18, Centro Histórico',
                'city' => 'Querétaro',
                'active' => true,
            ],
            [
                'name' => 'Consejo Estatal del Deporte',
                'email' => 'indereq@queretaro.gob.mx',
                'phone' => '442-789-0123',
                'description' => 'Entidad gubernamental dedicada a la promoción del deporte en todas sus disciplinas.',
                'web_site' => 'https://www.indereq.gob.mx',
                'social_media' => '@INDEREQro',
                'direction' => 'Av. Estadio s/n, Centro Sur',
                'city' => 'Querétaro',
                'active' => true,
            ],
            [
                'name' => 'Asociación de Hoteles de Querétaro',
                'email' => 'info@hotelesqueretaro.org',
                'phone' => '442-890-1234',
                'description' => 'Agrupación de empresarios hoteleros que impulsan eventos para atraer turismo.',
                'web_site' => 'https://www.hotelesqueretaro.org',
                'social_media' => '@HotelesQro',
                'direction' => 'Av. 5 de Febrero 1680, Col. San Pablo',
                'city' => 'Querétaro',
                'active' => true,
            ],
        ];

        foreach ($organizers as $organizer) {
            Organizers::create($organizer);
        }
    }
}