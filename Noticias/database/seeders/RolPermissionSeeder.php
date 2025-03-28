<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\Permission;
use App\Models\Rol;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class RolPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = Rol::all();
        
        $rolePermissions = [
            'Administrator' => [
                'Create events', 'View events', 'Edit events', 'Delete events',
                'Create categories', 'View categories', 'Edit categories', 'Delete categories',
                'Create locations', 'View locations', 'Edit locations', 'Delete locations',
                'Create organizers', 'View organizers', 'Edit organizers', 'Delete organizers',
                'Create users', 'View users', 'Edit users', 'Delete users',
            ],
            'Editor' => [
                'Create events', 'View events', 'Edit events',
                'Create categories', 'View categories', 'Edit categories',
                'Create locations', 'View locations', 'Edit locations',
                'Create organizers', 'View organizers', 'Edit organizers',
                'View users',
            ],
            'Moderator' => [
                'View events', 'Edit events',
                'View categories', 'Edit categories',
                'View locations', 'Edit locations',
                'View organizers', 'Edit organizers',
                'View users',
            ],
            'Viewer' => [
                'View events',
                'View categories',
                'View locations',
                'View organizers',
                'View users',
            ],
            'User' => [
                'View events',
            ],
        ];
        
        foreach ($roles as $role) {
            if (isset($rolePermissions[$role->name])) {
                $permissionNames = $rolePermissions[$role->name];
                
                foreach ($permissionNames as $permissionName) {
                    $permission = Permission::where('name', $permissionName)->first();
                    
                    if ($permission) {
                        $exists = DB::table('permission_role')
                            ->where('permission_id', $permission->id)
                            ->where('role_id', $role->id)
                            ->exists();
                            
                        if (!$exists) {
                            DB::table('permission_role')->insert([
                                'permission_id' => $permission->id,
                                'role_id' => $role->id,
                                'created_at' => now(),
                                'updated_at' => now(),
                            ]);
                        }
                    }
                }
            }
        }
    }
}