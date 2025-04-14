<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;

class TestUserRoles extends Command
{
    protected $signature = 'test:user-roles {user_id?}';
    protected $description = 'Test user roles functionality';


    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user_id') ?? 1;
        $user = User::findOrFail($userId);
        
        $this->info("Testing roles for user: {$user->email}");
        $this->info("Roles relationship exists: " . (method_exists($user, 'roles') ? 'Yes' : 'No'));
        
        try {
            $roles = $user->roles()->get();
            $this->info("Roles count: " . $roles->count());
            $this->table(['ID', 'Name'], $roles->map(fn($role) => [$role->id, $role->name]));
            $this->info("Is institutional: " . ($user->isInstitutional() ? 'Yes' : 'No'));
        } catch (\Exception $e) {
            $this->error("Error: " . $e->getMessage());
        }
        
        return 0;
    }
}
