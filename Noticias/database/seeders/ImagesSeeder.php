<?php

namespace Database\Seeders;

use App\Models\Events;
use App\Models\Images;
use App\Models\Organizers;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ImagesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear imágenes para eventos
        $events = Events::all();
        foreach ($events as $event) {
            // Entre 1 y 4 imágenes por evento
            $numImages = rand(1, 4);
            $mainImageSet = false;
            
            for ($i = 0; $i < $numImages; $i++) {
                // El primer evento siempre es la imagen principal
                $isPrincipal = !$mainImageSet;
                if ($isPrincipal) {
                    $mainImageSet = true;
                }

                // Generar URL de imagen de placeholder
                $width = rand(800, 1200);
                $height = rand(600, 800);
                $imageId = rand(1, 1000);
                
                Images::create([
                    'imageable_id' => $event->id,
                    'imageable_type' => Events::class,
                    'ruta' => "https://picsum.photos/id/{$imageId}/{$width}/{$height}",
                    'nombre_original' => 'imagen_evento_' . $event->id . '_' . ($i+1) . '.jpg',
                    'alt_texto' => 'Imagen para: ' . $event->titule,
                    'orden' => $i + 1,
                    'es_principal' => $isPrincipal,
                ]);
            }
        }

        // Crear logos para organizadores
        $organizers = Organizers::all();
        foreach ($organizers as $organizer) {
            $imageId = rand(1, 1000);
            
            Images::create([
                'imageable_id' => $organizer->id,
                'imageable_type' => Organizers::class,
                'ruta' => "https://picsum.photos/id/{$imageId}/300/300",
                'nombre_original' => 'logo_' . Str::slug($organizer->name) . '.jpg',
                'alt_texto' => 'Logo de ' . $organizer->name,
                'orden' => 1,
                'es_principal' => true,
            ]);
        }
    }
}