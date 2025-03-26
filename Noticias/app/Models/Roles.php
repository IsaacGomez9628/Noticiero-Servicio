<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Roles extends Model
{
    /** @use HasFactory<\Database\Factories\RolesFactory> */
    use HasFactory;
    
    // Especificar el nombre de la tabla ya que no sigue la convención
    protected $table = 'rols';
    
    // Relación con Admins (un rol puede tener muchos administradores)
    public function admins()
    {
        return $this->hasMany(Admins::class, 'rol_id');
    }
    
    // Relación muchos a muchos con Permissions (un rol puede tener muchos permisos)
    public function permissions()
    {
        return $this->belongsToMany(Permissions::class, 'permission_rol', 'rol_id', 'permission_id')
                    ->withTimestamps();
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLogs::class, 'object');
    }
}