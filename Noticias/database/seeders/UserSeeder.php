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

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $activeStatus = Status::where('name', 'Active')
            ->where('type', 'user')
            ->first();
            
        if (!$activeStatus) {
            throw new \Exception("Active status not found. Please run StatusSeeder first.");
        }
 
        $adminRole = Rol::where('name', 'Administrador')->first();
        $editorRole = Rol::where('name', 'Editor')->first();
        $moderatorRole = Rol::where('name', 'Moderador')->first();
        $viewerRole = Rol::where('name', 'Visualizador')->first();
        $userRole = Rol::where('name', 'Usuario')->first();
        $maleGender = Gender::where('name', 'Masculino')->first();
        $femaleGender = Gender::where('name', 'Femenino')->first();
        
        
        $adminUser = $this->createUser(
            'Admin',
            'User',
            'admin@example.com',
            'admin123',
            $activeStatus->id,
            $maleGender->id,
            [$adminRole->id],
            35
        );

        $editorUser = $this->createUser(
            'Editor',
            'User',
            'editor@example.com',
            'editor123',
            $activeStatus->id,
            $femaleGender->id,
            [$editorRole->id],
            28
        );
        
        $moderatorUser = $this->createUser(
            'Moderator',
            'User',
            'moderator@example.com',
            'moderator123',
            $activeStatus->id,
            $maleGender->id,
            [$moderatorRole->id],
            42
        );
        
        $viewerUser = $this->createUser(
            'Viewer',
            'User',
            'viewer@example.com',
            'viewer123',
            $activeStatus->id,
            $femaleGender->id,
            [$viewerRole->id],
            30
        );

        for ($i = 1; $i <= 10; $i++) {
            $gender = rand(0, 1) === 0 ? $maleGender->id : $femaleGender->id;
            $this->createUser(
                "User{$i}",
                "Lastname{$i}",
                "user{$i}@example.com",
                "password",
                $activeStatus->id,
                $gender,
                [$userRole->id],
                rand(18, 65)
            );
        }
    }
    
    /**
     * Create a user with corresponding person record
     */
    private function createUser($firstName, $lastName, $email, $password, $statusId, $genderId, $roleIds, $age)
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

            Person::create([
                'name' => $firstName,
                'apellido_paterno' => $lastName,
                'apellido_materno' => '',
                'gender_id' => $genderId,
                'user_id' => $user->id,
                'age' => $age
            ]);
            
            foreach ($roleIds as $roleId) {
                $user->roles()->attach($roleId);
            }
            
            DB::commit();
            return $user;
            
        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }
}