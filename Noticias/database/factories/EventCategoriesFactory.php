<?php

namespace Database\Factories;

use App\Models\Categories;
use App\Models\Events;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EventCategories>
 */
class EventCategoriesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'categorie_id' => Categories::factory(),
            'event_id' => Events::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}