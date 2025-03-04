<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class Usuario extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable;

    // Nombre de la tabla
    protected $table = 'usuarios';

    // No utilizamos timestamps estándar
    public $timestamps = false;

    // Atributos asignables masivamente
    protected $fillable = [
        'persona_id',
        'tipo_usuario_id',
        'status_id',
        'email',
        'password',
    ];

    // Ocultar estos atributos en las respuestas
    protected $hidden = [
        'password',
        'salt',
    ];

    // Convertir atributos a tipos nativos
    protected $casts = [
        'ultima_autenticacion' => 'datetime',
        'fecha_eliminacion' => 'datetime',
        'bloqueado' => 'boolean',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }

    public function tipoUsuario()
    {
        return $this->belongsTo(TipoUsuario::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function usuariosCreados()
    {
        return $this->hasMany(Usuario::class, 'creado_por_superadmin_id');
    }

    public function creadoPor()
    {
        return $this->belongsTo(Usuario::class, 'creado_por_superadmin_id');
    }

    public function noticias()
    {
        return $this->hasMany(Noticia::class, 'autor_id');
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }

    public function eventos()
    {
        return $this->hasMany(Evento::class, 'organizador_id');
    }

    public function asistenciaEventos()
    {
        return $this->hasMany(AsistenciaEvento::class);
    }

    public function interaccionesNoticias()
    {
        return $this->hasMany(InteraccionNoticia::class);
    }

    public function notificaciones()
    {
        return $this->hasMany(Notificacion::class);
    }

    // Scope para obtener solo usuarios activos
    public function scopeActivos($query)
    {
        return $query->where('eliminado', false);
    }

    // Método para verificar si es administrador
    public function esAdmin()
    {
        return $this->tipoUsuario->nombre === 'Administrador';
    }

    // Método para verificar si es editor
    public function esEditor()
    {
        return $this->tipoUsuario->nombre === 'Editor';
    }
}