<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Permissions>
 */
class PermissionsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $modules = ['eventos', 'categorias', 'ubicaciones', 'organizadores', 'usuarios'];
        $actions = ['crear', 'ver', 'editar', 'eliminar'];
        
        $module = fake()->randomElement($modules);
        $action = fake()->randomElement($actions);
        $name = ucfirst($action) . ' ' . ucfirst($module);
        
        return [
            'name' => $name,
            'slug' => Str::slug($name),
            'description' => "Permiso para $action $module",
            'module' => $module,
        ];
    }
}