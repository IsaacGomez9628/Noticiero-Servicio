<?php

namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Cache;

class User extends Authenticatable
{
    protected $fillable = [
        'name',
        'email',
        'password',
        'status_id',
        'salt',
        'last_authentication',
        'blocked',
        'failed_password_attempts',
        'deleted',
        'email_verified',
        'email_verified_at'
    ];
    
    protected $hidden = [
        'password',
        'salt',
        'remember_token',
    ];
    
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'last_authentication' => 'datetime',
        'blocked' => 'boolean',
        'deleted' => 'boolean',
        'email_verified' => 'boolean',
    ];

    /**
     * Obtener los roles del usuario.
     * Esta función intentará usar cualquiera de las tablas (user_role o user_roles)
     * dependiendo de cuál exista.
     */
    public function roles()
    {
        try {
            // Primero intenta user_role
            return $this->belongsToMany(Rol::class, 'user_role', 'user_id', 'rol_id');
        } catch (\Exception $e) {
            // Si falla, intenta user_roles
            return $this->belongsToMany(Rol::class, 'user_roles', 'user_id', 'rol_id');
        }
    }
    
    /**
     * Relación con la persona asociada
     */
    public function person()
    {
        return $this->hasOne(Person::class);
    }
    
    /**
     * Relación con el estado del usuario
     */
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
    
    /**
     * Relación con las asistencias a eventos
     */
    public function eventAttendances()
    {
        return $this->hasMany(EventAttendance::class);
    }
    
    /**
     * Relación con las empresas asociadas
     * Un usuario institucional puede tener una o más empresas
     */
    public function companies()
    {
        return $this->hasMany(Company::class);
    }
    
    /**
     * Saber que rol tiene un usuario en especifico
     */
    public function hasRole($roleName)
    {
        return $this->roles()->where('name', $roleName)->exists();
    }
    
    /**
     * Verifica si el usuario tiene un permiso específico
     */
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
     * Comprueba si es administrador
     */
    public function isAdmin()
    {
        return $this->hasRole('Administrator');
    }
    
    /**
     * Comprueba si es super administrador
     */
    public function isSuperAdmin()
    {
        return $this->hasRole('SuperAdministrator');
    }
    
    /**
     * Comprueba si es usuario institucional
     */
    public function isInstitutional()
    {
        return $this->hasRole('Institucional');
    }
    
    /**
     * Comprueba si es usuario personal
     */
    public function isPersonal()
    {
        return $this->hasRole('Usuario');
    }
    
    /**
     * Obtiene todos los permisos del usuario
     */
    public function getAllPermissions()
    {
        $permissions = collect();
        
        foreach ($this->roles as $role) {
            $permissions = $permissions->merge($role->permissions);
        }
        
        return $permissions->unique('id');
    }

    /**
     * Comprueba si el usuario tiene al menos uno de los permisos dados
     */
    public function hasAnyPermission($permissions)
    {
        foreach ($permissions as $permission) {
            if ($this->hasPermission($permission)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Comprueba si el usuario tiene todos los permisos dados
     */
    public function hasAllPermissions($permissions)
    {
        foreach ($permissions as $permission) {
            if (!$this->hasPermission($permission)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Alias para hasPermission
     */
    public function hasPermissionTo($permission)
    {
        return $this->hasPermission($permission);
    }

    /**
     * Comprueba si el email ha sido verificado
     */
    public function hasVerifiedEmail(): bool
    {
        return $this->email_verified;
    }

    /**
     * Marca el email como verificado
     */
    public function markEmailAsVerified(): bool
    {
        return $this->forceFill([
            'email_verified' => true,
            'email_verified_at' => $this->freshTimestamp(),
        ])->save();
    }
    
    /**
     * Relación con el token de verificación de email
     */
    public function verificationToken()
    {
        return $this->hasOne(EmailVerificationToken::class);
    }
}