<?php

namespace Database\Seeders;

use App\Models\EventStatus;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventStatusSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $statuses = [
            ['name' => 'Programado', 'color' => '#3498db', 'order' => 1],
            ['name' => 'En Curso', 'color' => '#2ecc71', 'order' => 2],
            ['name' => 'Finalizado', 'color' => '#95a5a6', 'order' => 3],
            ['name' => 'Cancelado', 'color' => '#e74c3c', 'order' => 4],
            ['name' => 'Pospuesto', 'color' => '#f39c12', 'order' => 5]
        ];

        foreach ($statuses as $status) {
            EventStatus::create([
                'name' => $status['name'],
                'slug' => Str::slug($status['name']),
                'color' => $status['color'],
                'description' => 'Estado: ' . $status['name'],
                'active' => true,
                'orden' => $status['order'],
            ]);
        }
    }
}