<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Categories>
 */
class CategoriesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $categories = [
            'Música', 
            'Teatro', 
            'Deportes', 
            'Conferencias', 
            'Exposiciones',
            'Gastronomía',
            'Tecnología',
            'Arte',
            'Cine',
            'Literatura'
        ];
        
        $name = fake()->unique()->randomElement($categories);
        
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => fake()->paragraph(),
            'active' => true,
        ];
    }
}