<?php

namespace Database\Factories;

use App\Models\Events;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Images>
 */
class ImagesFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        // Usamos placeholders para generar imágenes de ejemplo
        $width = $this->faker->numberBetween(800, 1200);
        $height = $this->faker->numberBetween(600, 800);
        $imageId = $this->faker->numberBetween(1, 1000);
        
        return [
            'ruta' => "https://picsum.photos/id/{$imageId}/{$width}/{$height}",
            'nombre_original' => 'imagen_' . $this->faker->word() . '.jpg',
            'alt_texto' => $this->faker->sentence(4),
            'orden' => $this->faker->numberBetween(1, 10),
            'es_principal' => $this->faker->boolean(20), // 20% de probabilidad de ser la imagen principal
        ];
    }
    
    /**
     * Configurar la imagen para eventos
     */
    public function forEvent()
    {
        return $this->state(function (array $attributes) {
            return [
                'imageable_type' => Events::class,
                'imageable_id' => Events::factory(),
            ];
        });
    }
}