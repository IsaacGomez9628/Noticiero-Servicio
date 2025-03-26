<?php

namespace Database\Seeders;

use App\Models\Admins;
use App\Models\EventStatus;
use App\Models\Events;
use App\Models\Locations;
use App\Models\Organizers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener modelos existentes
        $admins = Admins::all();
        $locations = Locations::all();
        $organizers = Organizers::all();
        $statuses = EventStatus::all();

        // Eventos predefinidos para Querétaro
        $events = [
            [
                'titule' => 'Festival de la Vendimia Querétaro',
                'description' => 'Celebración anual de la cosecha de uva y la producción vinícola en la región. Disfruta de degustaciones, charlas, gastronomía y música en vivo.',
                'start_date' => now()->addDays(30),
                'end_date' => now()->addDays(32),
                'start_time' => '12:00:00',
                'end_time' => '22:00:00',
                'price' => 450.00,
                'its_free' => false,
                'capacity' => 2000,
                'slug' => 'festival-vendimia-queretaro',
            ],
            [
                'titule' => 'Feria Internacional del Queso y el Vino',
                'description' => 'Evento gastronómico que reúne a los mejores productores de quesos y vinos de la región y el mundo. Incluye catas dirigidas, maridajes y talleres.',
                'start_date' => now()->addDays(45),
                'end_date' => now()->addDays(47),
                'start_time' => '11:00:00',
                'end_time' => '21:00:00',
                'price' => 350.00,
                'its_free' => false,
                'capacity' => 1500,
                'slug' => 'feria-queso-vino',
            ],
            [
                'titule' => 'Encuentro de Danza Contemporánea',
                'description' => 'Encuentro que reúne a compañías de danza nacionales e internacionales, presentando lo mejor de la danza contemporánea actual.',
                'start_date' => now()->addDays(20),
                'end_date' => now()->addDays(23),
                'start_time' => '19:00:00',
                'end_time' => '21:30:00',
                'price' => 200.00,
                'its_free' => false,
                'capacity' => 800,
                'slug' => 'encuentro-danza-contemporanea',
            ],
            [
                'titule' => 'HAY Festival Querétaro',
                'description' => 'Festival internacional que reúne a escritores, periodistas, científicos y pensadores para debatir ideas y presentar sus obras en diversos formatos.',
                'start_date' => now()->addDays(60),
                'end_date' => now()->addDays(65),
                'start_time' => '10:00:00',
                'end_time' => '22:00:00',
                'price' => 0.00,
                'its_free' => true,
                'capacity' => 5000,
                'slug' => 'hay-festival-queretaro',
            ],
            [
                'titule' => 'Querétaro Tech Summit',
                'description' => 'Conferencia tecnológica que reúne a expertos en innovación, startups, inteligencia artificial y transformación digital para compartir conocimientos y experiencias.',
                'start_date' => now()->addDays(25),
                'end_date' => now()->addDays(26),
                'start_time' => '09:00:00',
                'end_time' => '18:00:00',
                'price' => 1500.00,
                'its_free' => false,
                'capacity' => 1000,
                'slug' => 'queretaro-tech-summit',
            ],
            [
                'titule' => 'Festival Barroco de Querétaro',
                'description' => 'Celebración que pone en valor la herencia barroca de la ciudad a través de conciertos, exposiciones, recorridos y conferencias.',
                'start_date' => now()->addDays(80),
                'end_date' => now()->addDays(87),
                'start_time' => '11:00:00',
                'end_time' => '20:00:00',
                'price' => 100.00,
                'its_free' => false,
                'capacity' => 1200,
                'slug' => 'festival-barroco-queretaro',
            ],
            [
                'titule' => 'Feria Nacional del Libro de Querétaro',
                'description' => 'Una de las ferias del libro más importantes del país, con presentaciones de autores nacionales e internacionales, talleres, lecturas y actividades para toda la familia.',
                'start_date' => now()->addDays(15),
                'end_date' => now()->addDays(30),
                'start_time' => '10:00:00',
                'end_time' => '20:00:00',
                'price' => 0.00,
                'its_free' => true,
                'capacity' => 10000,
                'slug' => 'feria-nacional-libro-queretaro',
            ],
            [
                'titule' => 'Campeonato Nacional de Atletismo',
                'description' => 'Competencia deportiva que reúne a los mejores atletas del país en diversas modalidades de atletismo, clasificatoria para competencias internacionales.',
                'start_date' => now()->addDays(40),
                'end_date' => now()->addDays(42),
                'start_time' => '08:00:00',
                'end_time' => '19:00:00',
                'price' => 50.00,
                'its_free' => false,
                'capacity' => 3000,
                'slug' => 'campeonato-nacional-atletismo',
            ],
            [
                'titule' => 'Encuentro Gastronómico de Querétaro',
                'description' => 'Festival culinario que celebra la riqueza gastronómica de la región, con chefs invitados, demostraciones, degustaciones y talleres de cocina tradicional.',
                'start_date' => now()->addDays(55),
                'end_date' => now()->addDays(57),
                'start_time' => '13:00:00',
                'end_time' => '23:00:00',
                'price' => 250.00,
                'its_free' => false,
                'capacity' => 2000,
                'slug' => 'encuentro-gastronomico-queretaro',
            ],
            [
                'titule' => 'Expo Vivienda Querétaro',
                'description' => 'La feria inmobiliaria más importante de la región, donde desarrolladores y agencias presentan sus proyectos residenciales y comerciales con precios especiales.',
                'start_date' => now()->addDays(70),
                'end_date' => now()->addDays(72),
                'start_time' => '10:00:00',
                'end_time' => '20:00:00',
                'price' => 0.00,
                'its_free' => true,
                'capacity' => 5000,
                'slug' => 'expo-vivienda-queretaro',
            ],
            [
                'titule' => 'Festival del Globo Querétaro',
                'description' => 'Espectáculo de globos aerostáticos con participantes nacionales e internacionales, incluyendo vuelos, exhibiciones nocturnas, música en vivo y actividades familiares.',
                'start_date' => now()->addDays(90),
                'end_date' => now()->addDays(92),
                'start_time' => '06:00:00',
                'end_time' => '22:00:00',
                'price' => 180.00,
                'its_free' => false,
                'capacity' => 8000,
                'slug' => 'festival-globo-queretaro',
            ],
            [
                'titule' => 'Semana de la Moda Querétaro',
                'description' => 'Evento de moda que presenta las colecciones de diseñadores locales y nacionales, promoviendo el talento queretano y las nuevas tendencias en diseño textil.',
                'start_date' => now()->addDays(65),
                'end_date' => now()->addDays(68),
                'start_time' => '16:00:00',
                'end_time' => '22:00:00',
                'price' => 300.00,
                'its_free' => false,
                'capacity' => 600,
                'slug' => 'semana-moda-queretaro',
            ],
        ];

        // Crear eventos predefinidos
        foreach ($events as $eventData) {
            // Asignar ubicación de Querétaro específicamente
            Events::create([
                'titule' => $eventData['titule'],
                'description' => $eventData['description'],
                'start_date' => $eventData['start_date'],
                'end_date' => $eventData['end_date'],
                'start_time' => $eventData['start_time'],
                'end_time' => $eventData['end_time'],
                'price' => $eventData['price'],
                'its_free' => $eventData['its_free'],
                'organizer_id' => $organizers->random()->id,
                'location_id' => $locations->random()->id,
                'admin_id' => $admins->random()->id,
                'capacity' => $eventData['capacity'],
                'event_statuses_id' => $statuses->random()->id,
                'slug' => $eventData['slug'],
            ]);
        }
    }
}