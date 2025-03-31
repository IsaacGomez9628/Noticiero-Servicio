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
        $gender = Gender::inRandomOrder()->first();
        
        // If no gender exists in the database, provide a default ID (you may need to adjust this)
        $genderId = $gender ? $gender->id : 1;
        
        return [
            'name' => $this->faker->firstName(),
            'last_name' => $this->faker->lastName(),
            'second_last_name' => $this->faker->lastName(),
            'gender_id' => $genderId,
            'user_id' => User::factory(),
            'birth_date' => $this->faker->dateTimeBetween('-80 years', '-18 years'),
            'age' => $this->faker->numberBetween(18, 80),
        ];
    }
}