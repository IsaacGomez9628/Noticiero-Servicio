<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\City>
 */
class CityFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $cities = [
            'Querétaro', 'San Juan del Río', 'Corregidora', 'El Marqués', 
            'Tequisquiapan', 'Ezequiel Montes', 'Colón', 'Pedro Escobedo', 
            'Amealco', 'Jalpan de Serra', 'Cadereyta', 'Pinal de Amoles'
        ];
        
        return [
            'name' => fake()->unique()->randomElement($cities),
        ];
    }
}