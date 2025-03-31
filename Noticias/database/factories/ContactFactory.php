<?php

namespace Database\Factories;

use App\Models\SocialNetwork;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\ContactType>
 */
class ContactTypeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'social_network_id' => SocialNetwork::factory(),
            'profile_url' => fake()->userName(),
            'deleted' => false,
            'deleted_at' => null,
        ];
    }
    
    /**
     * Configure the factory for a specific social network.
     */
    public function forSocialNetwork(SocialNetwork $socialNetwork)
    {
        return $this->state(function (array $attributes) use ($socialNetwork) {
            return [
                'social_network_id' => $socialNetwork->id,
                'profile_url' => str_replace(
                    '{username}', 
                    fake()->userName(), 
                    $socialNetwork->url_pattern
                ),
            ];
        });
    }
}