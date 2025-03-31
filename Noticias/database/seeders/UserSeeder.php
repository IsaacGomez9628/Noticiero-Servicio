<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Person;
use App\Models\Status;
use App\Models\Gender;
use App\Models\Rol;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Check if we have required data
        $activeStatus = Status::where('name', 'Active')
            ->where('type', 'user')
            ->first();
            
        if (!$activeStatus) {
            $this->command->info('Active status not found. Running StatusSeeder first...');
            $this->call(StatusSeeder::class);
            $activeStatus = Status::where('name', 'Active')
                ->where('type', 'user')
                ->first();
            
            if (!$activeStatus) {
                throw new \Exception("Active status not found even after running StatusSeeder.");
            }
        }
        
        // Get roles
        $adminRole = Rol::where('name', 'Administrador')->first();
        $editorRole = Rol::where('name', 'Editor')->first();
        $moderatorRole = Rol::where('name', 'Moderador')->first();
        $viewerRole = Rol::where('name', 'Visualizador')->first();
        $userRole = Rol::where('name', 'Usuario')->first();
        
        if (!$adminRole || !$userRole) {
            $this->command->info('Required roles not found. Running RolSeeder first...');
            $this->call(RolSeeder::class);
            
            $adminRole = Rol::where('name', 'Administrador')->first();
            $editorRole = Rol::where('name', 'Editor')->first();
            $moderatorRole = Rol::where('name', 'Moderador')->first();
            $viewerRole = Rol::where('name', 'Visualizador')->first();
            $userRole = Rol::where('name', 'Usuario')->first();
        }
        
        // Get genders
        $maleGender = Gender::where('name', 'Masculino')->first();
        $femaleGender = Gender::where('name', 'Femenino')->first();
        $otherGender = Gender::where('name', 'Otro')->first();
        
        if (!$maleGender || !$femaleGender) {
            $this->command->info('Genders not found. Running GenderSeeder first...');
            $this->call(GenderSeeder::class);
            
            $maleGender = Gender::where('name', 'Masculino')->first();
            $femaleGender = Gender::where('name', 'Femenino')->first();
            $otherGender = Gender::where('name', 'Otro')->first();
        }
        
        // Create main users with specific roles
        $this->command->info('Creating primary users...');
        
        // Admin user
        $adminUser = $this->createUser(
            'Admin',
            'Sistema',
            'Querétaro',
            'admin@example.com',
            'admin123',
            $activeStatus->id,
            $maleGender->id,
            [$adminRole->id],
            Carbon::now()->subYears(35)
        );

        // Editor user
        $editorUser = $this->createUser(
            'Editor',
            'Principal',
            'Sistema',
            'editor@example.com',
            'editor123',
            $activeStatus->id,
            $femaleGender->id,
            [$editorRole->id],
            Carbon::now()->subYears(28)
        );
        
        // Moderator user
        $moderatorUser = $this->createUser(
            'Moderador',
            'Control',
            'Sistema',
            'moderator@example.com',
            'moderator123',
            $activeStatus->id,
            $maleGender->id,
            [$moderatorRole->id],
            Carbon::now()->subYears(42)
        );
        
        // Viewer user
        $viewerUser = $this->createUser(
            'Visualizador',
            'Monitoreo',
            'Sistema',
            'viewer@example.com',
            'viewer123',
            $activeStatus->id,
            $femaleGender->id,
            [$viewerRole->id],
            Carbon::now()->subYears(30)
        );
        
        $this->command->info('Creating regular users...');
        
        $spanishFirstNames = [
            'Miguel', 'Carlos', 'Alejandro', 'José', 'Francisco', 'Juan', 'Eduardo', 'Fernando', 'Ricardo', 'Diego',
            'María', 'Laura', 'Ana', 'Sofía', 'Claudia', 'Gabriela', 'Mariana', 'Patricia', 'Verónica', 'Adriana'
        ];
        
        $spanishLastNames = [
            'García', 'Rodríguez', 'López', 'Martínez', 'González', 'Pérez', 'Sánchez', 'Ramírez', 'Torres', 'Flores',
            'Vargas', 'Castillo', 'Ortiz', 'Mendoza', 'Cruz', 'Hernández', 'Vega', 'Reyes', 'Morales', 'Castro'
        ];
        
        // Create 15 regular users with realistic Spanish names
        for ($i = 1; $i <= 15; $i++) {
            $gender = rand(0, 1) === 0 ? $maleGender->id : $femaleGender->id;
            
            // Choose name based on gender
            if ($gender === $maleGender->id) {
                $firstName = $spanishFirstNames[array_rand(array_slice($spanishFirstNames, 0, 10))];
            } else {
                $firstName = $spanishFirstNames[array_rand(array_slice($spanishFirstNames, 10, 10)) + 10];
            }
            
            $lastName1 = $spanishLastNames[array_rand($spanishLastNames)];
            $lastName2 = $spanishLastNames[array_rand($spanishLastNames)];
            
            // Generate a unique email that looks more realistic
            $email = strtolower($firstName) . '.' . strtolower($lastName1) . $i . '@example.com';
            
            // Random birth date between 18 and 65 years ago
            $birthDate = Carbon::now()->subYears(rand(18, 65))->subDays(rand(0, 364));
            
            $this->createUser(
                $firstName,
                $lastName1,
                $lastName2,
                $email,
                'password',
                $activeStatus->id,
                $gender,
                [$userRole->id],
                $birthDate
            );
        }
        
        $this->command->info('Total users created: ' . User::count());
        $this->command->info('Total person records created: ' . Person::count());
    }
    
    /**
     * Create a user with corresponding person record
     */
    private function createUser($firstName, $lastName, $secondLastName, $email, $password, $statusId, $genderId, $roleIds, $birthDate)
    {
        try {
            DB::beginTransaction();
            
            $salt = Str::random(16);
            
            $user = User::create([
                'status_id' => $statusId,
                'email' => $email,
                'salt' => $salt,
                'password' => Hash::make($salt . $password),
                'last_authentication' => null,
                'blocked' => false,
                'failed_password_attempts' => 0,
                'deleted' => false,
            ]);

            $age = Carbon::parse($birthDate)->age;
            
            Person::create([
                'name' => $firstName,
                'last_name' => $lastName,
                'second_last_name' => $secondLastName,
                'gender_id' => $genderId,
                'user_id' => $user->id,
                'birth_date' => $birthDate,
                'age' => $age
            ]);
            
            foreach ($roleIds as $roleId) {
                DB::table('user_role')->insert([
                    'user_id' => $user->id,
                    'rol_id' => $roleId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
            
            DB::commit();
            return $user;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}