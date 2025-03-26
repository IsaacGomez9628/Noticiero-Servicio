<?php

namespace Database\Seeders;

use App\Models\Admins;
use App\Models\Roles;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener los roles
        $adminRole = Roles::where('nombre', 'Administrador')->first();
        $editorRole = Roles::where('nombre', 'Editor')->first();
        $moderatorRole = Roles::where('nombre', 'Moderador')->first();
        $viewerRole = Roles::where('nombre', 'Visualizador')->first();

        // Crear admin principal
        Admins::create([
            'name' => 'Admin Principal',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'phone' => '555-123-4567',
            'rol_id' => $adminRole->id,
            'active' => true,
        ]);

        // Crear otros admins
        Admins::create([
            'name' => 'Editor Principal',
            'email' => 'editor@example.com',
            'password' => Hash::make('password'),
            'phone' => '555-234-5678',
            'rol_id' => $editorRole->id,
            'active' => true,
        ]);

        Admins::create([
            'name' => 'Moderador Principal',
            'email' => 'moderador@example.com',
            'password' => Hash::make('password'),
            'phone' => '555-345-6789',
            'rol_id' => $moderatorRole->id,
            'active' => true,
        ]);

        Admins::create([
            'name' => 'Visualizador Principal',
            'email' => 'visualizador@example.com',
            'password' => Hash::make('password'),
            'phone' => '555-456-7890',
            'rol_id' => $viewerRole->id,
            'active' => true,
        ]);

        // Crear algunos admins aleatorios adicionales
        Admins::factory(4)->create([
            'rol_id' => $adminRole->id
        ]);

        Admins::factory(3)->create([
            'rol_id' => $editorRole->id
        ]);
    }
}