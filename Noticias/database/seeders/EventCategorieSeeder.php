<?php

namespace Database\Seeders;

use App\Models\Categorie;
use App\Models\Event;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class EventCategorieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = Event::all();
        $categories = Categorie::all();

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