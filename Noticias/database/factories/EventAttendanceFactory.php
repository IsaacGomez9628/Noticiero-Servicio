<?php

namespace Database\Factories;

use App\Models\Event;
use App\Models\Organizer;
use App\Models\Status;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\EventAttendances>
 */
class EventAttendanceFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $registrationTypes = ['personal', 'group', 'corporate', 'invitation'];
        $userAgent = fake()->userAgent();
        
        // Get a random attendance status
        $attendanceStatus = Status::where('type', 'attendance')->inRandomOrder()->first();
        
        // If no status exists, create a default one
        if (!$attendanceStatus) {
            $attendanceStatus = Status::factory()->ofType('attendance')->create();
        }
        
        return [
            'event_id' => Event::factory(),
            'user_id' => fake()->boolean(70) ? User::factory() : null, // 70% have a user account
            'nombre' => fake()->name(),
            'email' => fake()->safeEmail(),
            'telefono' => fake()->phoneNumber(),
            'tipo_registro' => fake()->randomElement($registrationTypes),
            'status_id' => $attendanceStatus->id,
            'organizer_id' => fake()->boolean(30) ? Organizer::factory() : null, // 30% from organizers
            'informacion_adicional' => fake()->optional(0.4)->paragraph(), // 40% have additional info
            'codigo_registro' => Str::upper(Str::random(8)),
            'ip_registro' => $this->faker->ipv4(),
            'user_agent' => $userAgent,
        ];
    }
    
    /**
     * Configure for a specific event
     */
    public function forEvent(Event $event)
    {
        return $this->state(function (array $attributes) use ($event) {
            return [
                'event_id' => $event->id,
                'organizer_id' => $event->organizer_id,
            ];
        });
    }
}