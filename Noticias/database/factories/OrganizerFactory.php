<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Organizers>
 */
class OrganizerFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $companyName = fake()->company();
        
        return [
            'name' => $companyName,
            'email' => fake()->companyEmail(),
            'phone' => fake()->phoneNumber(),
            'description' => fake()->paragraph(),
            'web_site' => 'https://www.' . fake()->domainName(),
            'social_media' => '@' . preg_replace('/\s+/', '', strtolower($companyName)),
            'direction' => fake()->address(),
            'city' => fake()->city(),
            'logo' => null, // Aquí se puede asignar una ruta a un logo si se tiene
            'active' => true,
        ];
    }
}