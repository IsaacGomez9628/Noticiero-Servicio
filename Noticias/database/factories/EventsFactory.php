<?php

namespace Database\Factories;

use App\Models\Admins;
use App\Models\EventStatus;
use App\Models\Locations;
use App\Models\Organizers;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Events>
 */
class EventsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $eventTypes = [
            'Concierto de', 
            'Festival de', 
            'Exposición de', 
            'Conferencia sobre', 
            'Taller de',
            'Encuentro de',
            'Feria de',
            'Congreso de'
        ];
        
        $eventThemes = [
            'Música', 
            'Arte', 
            'Ciencia', 
            'Tecnología', 
            'Literatura',
            'Gastronomía',
            'Cine',
            'Fotografía',
            'Historia',
            'Negocios'
        ];
        
        $title = fake()->randomElement($eventTypes) . ' ' . fake()->randomElement($eventThemes);
        
        // Fechas para eventos futuros (entre hoy y 6 meses adelante)
        $startDate = fake()->dateTimeBetween('now', '+6 months');
        $endDate = clone $startDate;
        date_add($endDate, date_interval_create_from_date_string(fake()->numberBetween(0, 5) . ' days'));
        
        // Horas de inicio y fin (formato HH:MM:SS)
        $startHour = fake()->numberBetween(8, 20) . ':00:00';
        $endHour = (fake()->numberBetween(8, 20) + 2) . ':00:00';
        
        // Precios
        $isFree = fake()->boolean(20); // 20% de probabilidad de ser gratuito
        $price = $isFree ? 0 : fake()->randomFloat(2, 50, 1000);
        
        return [
            'titule' => $title,
            'description' => fake()->paragraphs(3, true),
            'start_date' => $startDate,
            'end_date' => $endDate,
            'start_time' => $startHour,
            'end_time' => $endHour,
            'price' => $price,
            'its_free' => $isFree,
            'organizer_id' => Organizers::factory(),
            'location_id' => Locations::factory(),
            'admin_id' => Admins::factory(),
            'capacity' => fake()->numberBetween(50, 5000),
            'event_statuses_id' => EventStatus::factory(),
            'slug' => Str::slug($title . '-' . fake()->numberBetween(100, 999)),
        ];
    }
}