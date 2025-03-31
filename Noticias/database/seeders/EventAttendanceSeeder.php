<?php

namespace Database\Seeders;

use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\User;
use App\Models\Status;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class EventAttendanceSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $events = Event::all();
        $users = User::all();
        
        $pendingStatus = Status::where('type', 'attendance')->where('name', 'Pending')->first();
        $confirmedStatus = Status::where('type', 'attendance')->where('name', 'Confirmed')->first();
        $rejectedStatus = Status::where('type', 'attendance')->where('name', 'Rejected')->first();
    
        $pendingId = $pendingStatus ? $pendingStatus->id : 4;
        $confirmedId = $confirmedStatus ? $confirmedStatus->id : 5;
        $rejectedId = $rejectedStatus ? $rejectedStatus->id : 6;
        
        $statusIds = [$pendingId, $confirmedId, $confirmedId, $confirmedId, $rejectedId]; 
        
 
        foreach ($events as $event) {

            $attendeeCount = rand(10, 50);
            
            for ($i = 0; $i < $attendeeCount; $i++) {
            
                $useRegisteredUser = rand(1, 100) <= 70 && $users->count() > 0;
                
                $userData = [];
                
                if ($useRegisteredUser) {
                    $user = $users->random();
                    $userData = [
                        'user_id' => $user->id,
                        'nombre' => null,
                        'email' => $user->email,
                    ];
                } else {
                    $userData = [
                        'user_id' => null,
                        'nombre' => fake()->name(),
                        'email' => fake()->unique()->safeEmail(),
                    ];
                }
                
                $registrationType = fake()->randomElement(['personal', 'group', 'corporate', 'invitation']);
                $statusId = fake()->randomElement($statusIds);
                
                EventAttendance::create(array_merge($userData, [
                    'event_id' => $event->id,
                    'telefono' => fake()->phoneNumber(),
                    'tipo_registro' => $registrationType,
                    'status_id' => $statusId,
                    'organizer_id' => $event->organizer_id,
                    'informacion_adicional' => fake()->optional(0.3)->paragraph(),
                    'codigo_registro' => Str::upper(Str::random(8)),
                    'ip_registro' => fake()->ipv4(),
                    'user_agent' => fake()->userAgent(),
                ]));
            }
        }
    }
}