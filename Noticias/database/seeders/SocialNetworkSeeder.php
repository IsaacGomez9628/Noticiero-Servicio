<?php

namespace Database\Seeders;

use App\Models\SocialNetwork;
use Illuminate\Database\Seeder;

class SocialNetworkSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $socialNetworks = [
            [
                'name' => 'Facebook',
                'icon' => 'facebook',
                'url_pattern' => 'https://facebook.com/{username}',
            ],
            [
                'name' => 'Twitter',
                'icon' => 'twitter',
                'url_pattern' => 'https://twitter.com/{username}',
            ],
            [
                'name' => 'LinkedIn',
                'icon' => 'linkedin',
                'url_pattern' => 'https://linkedin.com/in/{username}',
            ],
            [
                'name' => 'Instagram',
                'icon' => 'instagram',
                'url_pattern' => 'https://instagram.com/{username}',
            ],
            [
                'name' => 'YouTube',
                'icon' => 'youtube',
                'url_pattern' => 'https://youtube.com/channel/{username}',
            ],
            [
                'name' => 'TikTok',
                'icon' => 'tiktok',
                'url_pattern' => 'https://tiktok.com/@{username}',
            ],
        ];

        foreach ($socialNetworks as $network) {
            SocialNetwork::updateOrCreate(
                ['name' => $network['name']],
                [
                    'icon' => $network['icon'],
                    'url_pattern' => $network['url_pattern'],
                    'deleted' => false,
                ]
            );
        }
    }
}