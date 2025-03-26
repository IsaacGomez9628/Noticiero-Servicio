<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Permissions extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionsFactory> */
    use HasFactory;
    
    // Relación muchos a muchos con Roles (un permiso puede estar en muchos roles)
    public function roles()
    {
        return $this->belongsToMany(Roles::class, 'permission_rol', 'permission_id', 'rol_id')
                    ->withTimestamps();
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLogs::class, 'object');
    }
}