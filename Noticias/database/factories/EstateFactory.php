<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Estate>
 */
class EstateFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {

        $states = [
            'Querétaro', 'Guanajuato', 'Michoacán', 'Jalisco', 
            'Hidalgo', 'San Luis Potosí', 'Estado de México', 
            'Ciudad de México', 'Puebla', 'Veracruz'
        ];
        
        return [
            'name' => fake()->unique()->randomElement($states),
        ];
    }
}