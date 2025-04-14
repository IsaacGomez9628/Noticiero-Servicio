<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Rol extends Model
{
    /** @use HasFactory<\Database\Factories\RolesFactory> */
    use HasFactory;
    
    // Especificar el nombre de la tabla ya que no sigue la convención
    protected $table = 'rols';

    protected $fillable = [
        'name',
        'slug',
        'description',
        'active'
    ];
    
    // Relación con Admins (un rol puede tener muchos administradores)
    public function admins()
    {
        return $this->hasMany(Admin::class, 'rol_id');
    }
    
    // Relación muchos a muchos con Permissions (un rol puede tener muchos permisos)
    public function permissions()
    {
        return $this->belongsToMany(Permission::class, 'permission_rol', 'rol_id', 'permission_id')
                    ->withTimestamps();
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }

    public function users()
    {
        return $this->belongsToMany(User::class, 'user_rols', 'rol_id', 'user_id');
    }
}