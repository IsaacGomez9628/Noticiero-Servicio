<?php

namespace Database\Seeders;

use App\Models\Permissions;
use App\Models\Roles;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PermissionRolSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener todos los roles y permisos
        $roles = Roles::all();
        $permissions = Permissions::all();

        // Asignar permisos a roles según su nivel de acceso
        foreach ($roles as $role) {
            switch ($role->nombre) {
                case 'Administrador':
                    // Administrador tiene todos los permisos
                    foreach ($permissions as $permission) {
                        DB::table('permission_rol')->insert([
                            'permission_id' => $permission->id,
                            'rol_id' => $role->id,
                            'created_at' => now(),
                            'updated_at' => now(),
                        ]);
                    }
                    break;

                case 'Editor':
                    // Editor puede crear, ver y editar, pero no eliminar
                    foreach ($permissions as $permission) {
                        if (!str_contains($permission->name, 'Eliminar')) {
                            DB::table('permission_rol')->insert([
                                'permission_id' => $permission->id,
                                'rol_id' => $role->id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                    break;

                case 'Moderador':
                    // Moderador puede ver y editar, pero no crear ni eliminar
                    foreach ($permissions as $permission) {
                        if (str_contains($permission->name, 'Ver') || str_contains($permission->name, 'Editar')) {
                            DB::table('permission_rol')->insert([
                                'permission_id' => $permission->id,
                                'rol_id' => $role->id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                    break;

                case 'Visualizador':
                    // Visualizador solo puede ver
                    foreach ($permissions as $permission) {
                        if (str_contains($permission->name, 'Ver')) {
                            DB::table('permission_rol')->insert([
                                'permission_id' => $permission->id,
                                'rol_id' => $role->id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                    break;
            }
        }
    }
}