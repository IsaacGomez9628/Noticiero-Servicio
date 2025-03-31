<?php

namespace Database\Seeders;

use App\Models\Gender;
use App\Models\Person;
use App\Models\User;
use Illuminate\Database\Seeder;
use Carbon\Carbon;

class PersonSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {

        $existingUsers = User::whereDoesntHave('person')->get();
        
        $genders = Gender::all();
        if ($genders->isEmpty()) {
            $this->command->info('No genders found. Running GenderSeeder first...');
            $this->call(GenderSeeder::class);
            $genders = Gender::all();
        }
        
        foreach ($existingUsers as $user) {
            $gender = $genders->random();
            $birthDate = Carbon::parse(fake()->dateTimeBetween('-80 years', '-18 years'));
            $age = $birthDate->diffInYears(Carbon::now());
            
            Person::create([
                'name' => fake()->firstName(),
                'last_name' => fake()->lastName(),
                'second_last_name' => fake()->lastName(),
                'gender_id' => $gender->id,
                'user_id' => $user->id,
                'birth_date' => $birthDate,
                'age' => $age,
            ]);
        }
        
        $additionalCount = max(0, 20 - $existingUsers->count());
        
        if ($additionalCount > 0) {
            $this->command->info("Creating {$additionalCount} additional persons with new users...");
            
            for ($i = 0; $i < $additionalCount; $i++) {
                $gender = $genders->random();
                $birthDate = Carbon::parse(fake()->dateTimeBetween('-80 years', '-18 years'));
                $age = $birthDate->diffInYears(Carbon::now());

                $user = User::factory()->create();
                
                Person::create([
                    'name' => fake()->firstName(),
                    'last_name' => fake()->lastName(),
                    'second_last_name' => fake()->lastName(),
                    'gender_id' => $gender->id,
                    'user_id' => $user->id,
                    'birth_date' => $birthDate,
                    'age' => $age,
                ]);
            }
        }

        $this->command->info('Person records created: ' . Person::count());
    }
}