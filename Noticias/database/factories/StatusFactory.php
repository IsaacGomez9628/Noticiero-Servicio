<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Status>
 */
class StatusFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $types = ['user', 'attendance', 'event', 'registration'];
        $names = ['Active', 'Inactive', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Cancelled'];
        
        $type = fake()->randomElement($types);
        $name = fake()->randomElement($names);
        
        $colorMap = [
            'Active' => '#28a745',    
            'Inactive' => '#dc3545',  
            'Pending' => '#ffc107',  
            'Confirmed' => '#28a745', 
            'Rejected' => '#dc3545', 
            'Completed' => '#0066cc', 
            'Cancelled' => '#6c757d', 
        ];
        
        $color = $colorMap[$name] ?? '#6c757d';
        
        return [
            'name' => $name,
            'slug' => Str::slug($name . '-' . $type),
            'type' => $type,
            'description' => $name . ' ' . $type,
            'color' => $color,
            'active' => true,
            'order' => fake()->numberBetween(1, 5),
        ];
    }
    
    /**
     * Configure for a specific type
     */
    public function ofType(string $type)
    {
        return $this->state(function (array $attributes) use ($type) {
            $name = $attributes['name'] ?? $this->faker->word();
            return [
                'type' => $type,
                'slug' => Str::slug($name . '-' . $type),
            ];
        });
    }
}