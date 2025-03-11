<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use App\Models\Rol;

class Usuario extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';

    protected $fillable = [
        'persona_id',
        'empresa_id',
        'email',
        'password',
        'status_id',
        'rol_id',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'eliminado' => 'boolean',
        'fecha_eliminacion' => 'datetime',
    ];

    /**
     * Obtener la persona asociada al usuario
     */
    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }

    /**
     * Obtener la empresa asociada al usuario (si existe)
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    /**
     * Obtener el rol del usuario
     */
    public function rol()
    {
        return $this->belongsTo(Rol::class);
    }

    /**
     * Obtener el estado del usuario
     */
    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    /**
     * Relación con las asistencias a eventos
     */
    public function asistenciasEventos()
    {
        return $this->hasMany(AsistenciaEvento::class, 'usuario_id');
    }

    /**
     * Verificar si el usuario es administrador
     */
    public function esAdmin()
    {
        // Implementa esta lógica según tu estructura de roles
        // Por ejemplo:
        return $this->rol_id === 1 || $this->rol?->nombre === 'Administrador';
    }

    /**
     * Obtener el nombre completo del usuario
     */
    public function getNombreAttribute()
    {
        return $this->persona ? $this->persona->nombres . ' ' . $this->persona->apellidos : $this->email;
    }
}