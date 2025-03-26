<?php

namespace Database\Factories;

use App\Models\Roles;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Hash;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Admins>
 */
class AdminsFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'password' => Hash::make('password'), // contraseña predeterminada
            'phone' => fake()->phoneNumber(),
            'rol_id' => Roles::factory(), // Crear un rol si no se proporciona uno
            'active' => true,
            'remember_token' => Str::random(10),
        ];
    }
}