<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Sanctum\HasApiTokens;

class Admin extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\AdminsFactory> */
    use HasFactory, SoftDeletes, HasApiTokens;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'rol_id',
        'active'
    ];
    
    protected $hidden = [
        'password',
        'remember_token',
    ];
    
    // Relación con Rol (un admin pertenece a un rol)
    public function rol()
    {
        return $this->belongsTo(Rol::class, 'rol_id');
    }
    
    // Relación con Events (un admin puede tener muchos eventos)
    public function events()
    {
        return $this->hasMany(Event::class, 'admin_id');
    }
    
    // Relación con ActivityLogs (un admin puede tener muchos registros de actividad)
    public function activityLogs()
    {
        return $this->hasMany(ActivityLog::class, 'admin_id');
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }
    
    /**
     * Verifica si el usuario es un administrador
     * Este método es usado en el middleware HandleInertiaRequests
     * 
     * @return bool
     */
    public function isAdmin()
    {
        // Como este modelo es específicamente para administradores, siempre devolvemos true
        return true;
    }
}