<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            // Users, Roles and Permissions
            RolSeeder::class,
            PermissionSeeder::class,
            PermissionRolSeeder::class,
            
            // Locations
            GenderSeeder::class,
            StatusSeeder::class,
            CityEstateSeeder::class,
            
            // Events related
            AdminSeeder::class,
            CategorySeeder::class,
            EventStatusSeeder::class,
            OrganizerSeeder::class,
            LocationSeeder::class,
            EventSeeder::class,
            EventCategorieSeeder::class,
            ImageSeeder::class,
            
            // User related
            UserSeeder::class,
            RolPermissionSeeder::class,
            
            // Social media
            SocialNetworkSeeder::class,
            
            // Event attendances
            EventAttendanceSeeder::class,
        ]);
    }
}