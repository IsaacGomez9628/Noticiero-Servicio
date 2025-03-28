<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        $this->call([
            RolSeeder::class,
            PermissionSeeder::class,
            PermissionRolSeeder::class,
            AdminSeeder::class,
            CategorySeeder::class,
            EventStatusSeeder::class,
            OrganizerSeeder::class,
            LocationSeeder::class,
            EventSeeder::class,
            EventCategorieSeeder::class,
            ImageSeeder::class,
            GenderSeeder::class,
            StatusSeeder::class,
            RolPermissionSeeder::class,
            UserSeeder::class,
        ]);
    }
}
