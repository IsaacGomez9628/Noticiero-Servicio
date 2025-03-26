<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Admins extends Model
{
    /** @use HasFactory<\Database\Factories\AdminsFactory> */
    use HasFactory, SoftDeletes;
    
    // Relación con Rol (un admin pertenece a un rol)
    public function rol()
    {
        return $this->belongsTo(Roles::class, 'rol_id');
    }
    
    // Relación con Events (un admin puede tener muchos eventos)
    public function events()
    {
        return $this->hasMany(Events::class, 'admin_id');
    }
    
    // Relación con ActivityLogs (un admin puede tener muchos registros de actividad)
    public function activityLogs()
    {
        return $this->hasMany(ActivityLogs::class, 'admin_id');
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLogs::class, 'object');
    }
}