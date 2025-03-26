<?php

namespace Database\Factories;

use App\Models\Locations;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Locations>
 */
class LocationsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Ciudades de Querétaro
        $city = 'Querétaro';
        
        // Lugares comunes para eventos
        $venues = [
            'Centro de Convenciones', 
            'Teatro Municipal', 
            'Estadio', 
            'Auditorio', 
            'Plaza Principal',
            'Parque',
            'Salón de Eventos',
            'Centro Cultural',
            'Universidad'
        ];
        
        $name = $this->faker->randomElement($venues) . ' de ' . $city;
        
        // Coordenadas aproximadas de Querétaro
        $lat = $this->faker->latitude(20.55, 20.65);
        $lng = $this->faker->longitude(-100.45, -100.35);
        
        return [
            'name' => $name,
            'direction' => $this->faker->streetAddress(),
            'city' => $city,
            'estate' => 'Querétaro',
            'country' => 'México',
            'zip_code' => $this->faker->numberBetween(76000, 76904),
            'latitude' => $lat,
            'length' => $lng,
            'link_google_maps' => "https://maps.google.com/?q=$lat,$lng",
            'active' => true,
        ];
    }
}