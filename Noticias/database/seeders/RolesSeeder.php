<?php

namespace Database\Seeders;

use App\Models\Roles;
use Illuminate\Database\Seeder;

class RolesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'nombre' => 'Administrador',
                'slug' => 'administrador',
                'descripcion' => 'Control total del sistema',
                'activo' => true,
            ],
            [
                'nombre' => 'Editor',
                'slug' => 'editor',
                'descripcion' => 'Puede crear y editar contenido',
                'activo' => true,
            ],
            [
                'nombre' => 'Moderador',
                'slug' => 'moderador',
                'descripcion' => 'Puede revisar y aprobar contenido',
                'activo' => true,
            ],
            [
                'nombre' => 'Visualizador',
                'slug' => 'visualizador',
                'descripcion' => 'Solo puede ver contenido',
                'activo' => true,
            ],
        ];

        foreach ($roles as $role) {
            Roles::create($role);
        }
    }
}