<?php

namespace Database\Seeders;

use App\Models\Categories;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategoriesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Música',
            'Teatro',
            'Deportes',
            'Conferencias',
            'Exposiciones',
            'Gastronomía',
            'Tecnología',
            'Arte',
            'Cine',
            'Literatura'
        ];

        foreach ($categories as $category) {
            Categories::create([
                'name' => $category,
                'slug' => Str::slug($category),
                'description' => "Eventos relacionados con $category",
                'active' => true,
            ]);
        }
    }
}