<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PermissionSeeder extends Seeder
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
                Permission::create([
                    'name' => $name,
                    'slug' => Str::slug($name),
                    'description' => "Permiso para $action $module",
                    'module' => $module,
                ]);
            }
        }
    }
}