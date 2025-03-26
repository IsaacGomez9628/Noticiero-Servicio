<?php

namespace Database\Factories;

use App\Models\Permissions;
use App\Models\Roles;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\PermissionRol>
 */
class PermissionRolFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'permission_id' => Permissions::factory(),
            'rol_id' => Roles::factory(),
            'created_at' => now(),
            'updated_at' => now(),
        ];
    }
}