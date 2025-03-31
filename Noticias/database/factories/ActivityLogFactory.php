<?php

namespace Database\Factories;

use App\Models\Admin;
use App\Models\Event;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ActivityLogs>
 */
class ActivityLogFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $actions = ['create', 'update', 'delete', 'view', 'publish', 'unpublish'];
        $modelTypes = [
            Event::class => 'event',
        ];
        
        // Randomly select a model type
        $modelType = fake()->randomElement(array_keys($modelTypes));
        $modelId = 1; // Default ID
        
        // Get a random model ID if possible
        if ($modelType == Event::class && Event::count() > 0) {
            $modelId = Event::inRandomOrder()->first()->id;
        }
        
        return [
            'admin_id' => Admin::factory(),
            'object_type' => $modelType,
            'object_id' => $modelId,
            'action' => fake()->randomElement($actions),
            'details' => fake()->sentence(),
            'ip' => fake()->ipv4(),
            'user_agent' => fake()->userAgent(),
        ];
    }
}