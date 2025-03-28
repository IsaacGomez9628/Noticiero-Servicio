<?php

namespace Database\Factories;

use App\Models\Categorie;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EventCategories>
 */
class EventCategorieFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'categorie_id' => Categorie::factory(),
            'event_id' => Event::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}