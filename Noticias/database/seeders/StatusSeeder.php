<?php

namespace Database\Seeders;

use App\Models\Status;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            [
                'name' => 'Active',
                'description' => 'Active user',
                'type' => 'user',
                'active' => true,
                'color' => '#28a745', // verde
                'order' => 1
            ],
            [
                'name' => 'Inactive',
                'description' => 'Inactive user',
                'type' => 'user',
                'active' => true,
                'color' => '#dc3545', // rojo
                'order' => 2
            ],
            [
                'name' => 'Pending',
                'description' => 'Pending verification',
                'type' => 'user',
                'active' => true,
                'color' => '#ffc107', // amarillo
                'order' => 3
            ],
            [
                'name' => 'Pending',
                'description' => 'Pending attendance',
                'type' => 'attendance',
                'active' => true,
                'color' => '#ffc107', // amarillo
                'order' => 1
            ],
            [
                'name' => 'Confirmed',
                'description' => 'Confirmed attendance',
                'type' => 'attendance',
                'active' => true,
                'color' => '#28a745', // verde
                'order' => 2
            ],
            [
                'name' => 'Rejected',
                'description' => 'Rejected attendance',
                'type' => 'attendance',
                'active' => true,
                'color' => '#dc3545', // rojo
                'order' => 3
            ]
        ];

        foreach ($statuses as $status) {
            // Generar slug a partir del nombre
            $slug = Str::slug($status['name']);
            
            // Si hay varios con el mismo nombre, diferenciar por tipo
            if ($status['type'] != 'user') {
                $slug .= '-' . $status['type'];
            }
            
            Status::updateOrCreate(
                ['name' => $status['name'], 'type' => $status['type']],
                [
                    'name' => $status['name'],
                    'slug' => $slug,
                    'type' => $status['type'],
                    'description' => $status['description'],
                    'color' => $status['color'],
                    'active' => $status['active'],
                    'order' => $status['order']
                ]
            );
        }
    }
}