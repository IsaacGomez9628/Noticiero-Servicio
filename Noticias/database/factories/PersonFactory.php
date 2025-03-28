<?php

namespace Database\Factories;

use App\Models\Gender;
use App\Models\Person;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Person>
 */
class PersonFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'name' => fake()->firstName(),
            'apellido_paterno' => fake()->lastName(),
            'apellido_materno' => fake()->lastName(),
            'gender_id' => Gender::inRandomOrder()->first()->id ?? 1,
            'user_id' => User::factory(),
            'age' => fake()->numberBetween(18, 80),
        ];
    }
}