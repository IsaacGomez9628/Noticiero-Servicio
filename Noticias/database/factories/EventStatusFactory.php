<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EventStatus>
 */
class EventStatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $statuses = [
            ['name' => 'Programado', 'color' => '#3498db', 'order' => 1],
            ['name' => 'En Curso', 'color' => '#2ecc71', 'order' => 2],
            ['name' => 'Finalizado', 'color' => '#95a5a6', 'order' => 3],
            ['name' => 'Cancelado', 'color' => '#e74c3c', 'order' => 4],
            ['name' => 'Pospuesto', 'color' => '#f39c12', 'order' => 5]
        ];
        
        $status = fake()->unique()->randomElement($statuses);
        
        return [
            'name' => $status['name'],
            'slug' => Str::slug($status['name']),
            'color' => $status['color'],
            'description' => 'Estado: ' . $status['name'],
            'active' => true,
            'orden' => $status['order'],
        ];
    }
}