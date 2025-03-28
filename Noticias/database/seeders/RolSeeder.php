<?php

namespace Database\Seeders;

use App\Models\Rol;
use Illuminate\Database\Seeder;

class RolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = [
            [
                'name' => 'Administrador',
                'slug' => 'administrador',
                'description' => 'Control total del sistema',
                'active' => true,
            ],
            [
                'name' => 'Editor',
                'slug' => 'editor',
                'description' => 'Puede crear y editar contenido',
                'active' => true,
            ],
            [
                'name' => 'Moderador',
                'slug' => 'moderador',
                'description' => 'Puede revisar y aprobar contenido',
                'active' => true,
            ],
            [
                'name' => 'Visualizador',
                'slug' => 'visualizador',
                'description' => 'Solo puede ver contenido',
                'active' => true,
            ],
            [
                'name' => 'Usuario',
                'slug' => 'usuario',
                'description' => 'Usuario regular sin privilegios administrativos',
                'active' => true,
            ],
        ];

        foreach ($roles as $role) {
            Rol::create($role);
        }
    }
}