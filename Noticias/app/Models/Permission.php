<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permission extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionsFactory> */
    use HasFactory;
    
    // Relación muchos a muchos con Roles (un permiso puede estar en muchos roles)
    public function roles()
    {
        return $this->belongsToMany(Rol::class, 'permission_rol', 'permission_id', 'rol_id')
                    ->withTimestamps();
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }
}