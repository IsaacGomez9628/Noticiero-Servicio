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
            ],
            [
                'name' => 'Programado',
                'slug' => 'programado',
                'type' => 'evento',
                'description' => 'El evento está programado y aún no ha ocurrido',
                'color' => '#4F46E5', // Indigo
                'active' => true,
                'order' => 1
            ],
            [
                'name' => 'En curso',
                'slug' => 'en-curso',
                'type' => 'evento',
                'description' => 'El evento está actualmente en progreso',
                'color' => '#10B981', // Emerald
                'active' => true,
                'order' => 2
            ],
            [
                'name' => 'Finalizado',
                'slug' => 'finalizado',
                'type' => 'evento',
                'description' => 'El evento ha finalizado',
                'color' => '#6B7280', // Gray
                'active' => true,
                'order' => 3
            ],
            [
                'name' => 'Cancelado',
                'slug' => 'cancelado',
                'type' => 'evento',
                'description' => 'El evento ha sido cancelado',
                'color' => '#EF4444', // Red
                'active' => true,
                'order' => 4
            ],
            [
                'name' => 'Pospuesto',
                'slug' => 'pospuesto',
                'type' => 'evento',
                'description' => 'El evento ha sido pospuesto',
                'color' => '#F59E0B', // Amber
                'active' => true,
                'order' => 5
            ]
        ];

        $attendanceStatuses = [
            [
                'name' => 'Confirmado',
                'slug' => 'confirmado',
                'type' => 'asistencia',
                'description' => 'Asistencia confirmada',
                'color' => '#10B981', // Emerald
                'active' => true,
                'order' => 1
            ],
            [
                'name' => 'Pendiente',
                'slug' => 'pendiente',
                'type' => 'asistencia',
                'description' => 'Asistencia registrada pero pendiente de confirmación',
                'color' => '#F59E0B', // Amber
                'active' => true,
                'order' => 2
            ],
            [
                'name' => 'Cancelado',
                'slug' => 'cancelado',
                'type' => 'asistencia',
                'description' => 'Asistencia cancelada por el usuario',
                'color' => '#EF4444', // Red
                'active' => true,
                'order' => 3
            ],
            [
                'name' => 'Asistió',
                'slug' => 'asistio',
                'type' => 'asistencia',
                'description' => 'El usuario asistió al evento',
                'color' => '#10B981', // Emerald
                'active' => true,
                'order' => 4
            ],
            [
                'name' => 'No asistió',
                'slug' => 'no-asistio',
                'type' => 'asistencia',
                'description' => 'El usuario no asistió al evento',
                'color' => '#6B7280', // Gray
                'active' => true,
                'order' => 5
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

        foreach ($attendanceStatuses as $status) {
            Status::updateOrCreate(
                ['type' => $status['type'], 'slug' => $status['slug']],
                $status
            );
        }
    }
}