<?php

namespace Database\Seeders;

use App\Models\Admin;
use App\Models\Rol;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener los roles
        $adminRole = Rol::where('name', 'Administrador')->first();
        $editorRole = Rol::where('name', 'Editor')->first();
        $moderatorRole = Rol::where('name', 'Moderador')->first();
        $viewerRole = Rol::where('name', 'Visualizador')->first();

        // Crear admin principal
        Admin::create([
            'name' => 'Admin Principal',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'phone' => '555-123-4567',
            'rol_id' => $adminRole->id,
            'active' => true,
        ]);

        // Crear otros admins
        Admin::create([
            'name' => 'Editor Principal',
            'email' => 'editor@example.com',
            'password' => Hash::make('password'),
            'phone' => '555-234-5678',
            'rol_id' => $editorRole->id,
            'active' => true,
        ]);

        Admin::create([
            'name' => 'Moderador Principal',
            'email' => 'moderador@example.com',
            'password' => Hash::make('password'),
            'phone' => '555-345-6789',
            'rol_id' => $moderatorRole->id,
            'active' => true,
        ]);

        Admin::create([
            'name' => 'Visualizador Principal',
            'email' => 'visualizador@example.com',
            'password' => Hash::make('password'),
            'phone' => '555-456-7890',
            'rol_id' => $viewerRole->id,
            'active' => true,
        ]);

        // Crear algunos admins aleatorios adicionales
        Admin::factory(4)->create([
            'rol_id' => $adminRole->id
        ]);

        Admin::factory(3)->create([
            'rol_id' => $editorRole->id
        ]);
    }
}