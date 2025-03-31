<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\SocialNetwork>
 */
class SocialNetworkFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $socialNetworks = [
            ['name' => 'Facebook', 'icon' => 'facebook', 'url_pattern' => 'https://facebook.com/{username}'],
            ['name' => 'Twitter', 'icon' => 'twitter', 'url_pattern' => 'https://twitter.com/{username}'],
            ['name' => 'LinkedIn', 'icon' => 'linkedin', 'url_pattern' => 'https://linkedin.com/in/{username}'],
            ['name' => 'Instagram', 'icon' => 'instagram', 'url_pattern' => 'https://instagram.com/{username}'],
            ['name' => 'YouTube', 'icon' => 'youtube', 'url_pattern' => 'https://youtube.com/channel/{username}'],
            ['name' => 'TikTok', 'icon' => 'tiktok', 'url_pattern' => 'https://tiktok.com/@{username}'],
        ];
        
        $network = fake()->unique()->randomElement($socialNetworks);
        
        return [
            'name' => $network['name'],
            'icon' => $network['icon'],
            'url_pattern' => $network['url_pattern'],
            'deleted' => false,
        ];
    }
}