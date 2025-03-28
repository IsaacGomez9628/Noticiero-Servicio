<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class User extends Authenticatable
{
    protected $fillable = [
        'person_id',
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
    ];

    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'user_role', 'user_id', 'rol_id');
    }
    
    public function person()
    {
        return $this->belongsTo(Person::class);
    }
    
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
    
    public function eventAttendances()
    {
        return $this->hasMany(EventAttendance::class);
    }
    
    /**
     * Saber que rol tiene un usuario en especifico
     */
    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }
    
    public function hasPermission($permissionName)
    {
        $cacheKey = "user_{$this->id}_permission_{$permissionName}";
        
        return Cache::remember($cacheKey, now()->addMinutes(60), function() use ($permissionName) {
            foreach ($this->roles as $role) {
                foreach ($role->permissions as $permission) {
                    if ($permission->name === $permissionName) {
                        return true;
                    }
                }
            }
            return false;
        });
    }
    
    /**
     * Checar si es administrador
     */
    public function isAdmin()
    {
        return $this->hasRole('Administrator');
    }
    
    // Saber si el usuario es super administrador   
    public function isSuperAdmin()
    {
        return $this->hasRole('SuperAdministrator');
    }
    
    // Obetener los permisos del usuario
    public function getAllPermissions()
    {
        $permissions = collect();
        
        foreach ($this->roles as $role) {
            $permissions = $permissions->merge($role->permissions);
        }
        
        return $permissions->unique('id');
    }

}