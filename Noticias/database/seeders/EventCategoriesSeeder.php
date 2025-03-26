<?php

namespace Database\Seeders;

use App\Models\Categories;
use App\Models\Events;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventCategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = Events::all();
        $categories = Categories::all();

        // Asignar de 1 a 3 categorías a cada evento
        foreach ($events as $event) {
            // Seleccionar entre 1 y 3 categorías aleatorias sin repetir
            $randomCategories = $categories->random(rand(1, 3));
            
            foreach ($randomCategories as $category) {
                DB::table('event_categories')->insert([
                    'categorie_id' => $category->id,
                    'event_id' => $event->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }
    }
}