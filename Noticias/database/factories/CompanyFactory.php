<?php

namespace Database\Factories;

use App\Models\ListCompany;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Company>
 */
class CompanyFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'list_companies_id' => ListCompany::factory(),
            'description' => fake()->paragraph(),
            'phone' => fake()->numberBetween(1000000000, 9999999999),
        ];
    }
}