<?php

namespace Database\Factories;

use App\Models\User;
use App\Models\Person;
use App\Models\Status;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\User>
 */
class UserFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */

     protected $fillable = [
        'person_id',
        'user_type_id',
        'status_id',
        'email',
        'salt',
        'password',
        'last_authentication',
        'blocked',
        'failed_password_attempts',
        'deleted'
    ];
    
    protected $hidden = [
        'password',
        'salt',
        'remember_token',
    ];
    
    protected $casts = [
        'blocked' => 'boolean',
        'deleted' => 'boolean',
        'last_authentication' => 'datetime',
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];
    
    /**
     * Get the person associated with the user.
     */
    public function person()
    {
        return $this->hasOne(Person::class);
    }
    
    public function definition(): array
    {
    
        $salt = Str::random(16);
        $activeStatus = Status::where('name', 'Active')
                             ->where('type', 'user')
                             ->first();
        
        if (!$activeStatus) {
            $activeStatus = Status::create([
                'name' => 'Active',
                'description' => 'Active user',
                'type' => 'user',
                'deleted' => false
            ]);
        }
        
        return [
            'status_id' => $activeStatus->id,
            'email' => fake()->unique()->safeEmail(),
            'salt' => $salt,
            'password' => Hash::make($salt . 'password'), 
            'last_authentication' => fake()->optional(0.7)->dateTimeThisMonth(),
            'blocked' => false,
            'failed_password_attempts' => 0,
            'deleted' => false,
        ];
    }
    
    /**
     * Indicate that the user should be blocked.
     */
    public function blocked(): static
    {
        return $this->state(fn (array $attributes) => [
            'blocked' => true,
            'failed_password_attempts' => 5,
        ]);
    }

    
}