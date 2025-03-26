<?php

namespace Database\Seeders;

use App\Models\Permissions;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $modules = ['eventos', 'categorias', 'ubicaciones', 'organizadores', 'usuarios'];
        $actions = ['crear', 'ver', 'editar', 'eliminar'];

        foreach ($modules as $module) {
            foreach ($actions as $action) {
                $name = ucfirst($action) . ' ' . ucfirst($module);
                Permissions::create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'description' => "Permiso para $action $module",
                    'module' => $module,
                ]);
            }
        }
    }
}