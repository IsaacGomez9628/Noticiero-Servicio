<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Persona extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'personas';

    // No utilizamos timestamps estándar
    public $timestamps = false;

    // Atributos asignables masivamente
    protected $fillable = [
        'nombres',
        'apellido_paterno',
        'apellido_materno',
        'fecha_nacimiento',
        'genero',
    ];

    // Convertir atributos a tipos nativos
    protected $casts = [
        'fecha_nacimiento' => 'date',
        'fecha_registro' => 'datetime',
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function usuarios()
    {
        return $this->hasMany(Usuario::class);
    }

    public function contactos()
    {
        return $this->hasMany(Contacto::class);
    }

    public function miembros()
    {
        return $this->hasMany(Miembro::class);
    }

    // Scope para obtener solo personas activas
    public function scopeActivas($query)
    {
        return $query->where('eliminado', false);
    }

    // Método para obtener nombre completo
    public function getNombreCompletoAttribute()
    {
        if ($this->apellido_materno) {
            return "{$this->nombres} {$this->apellido_paterno} {$this->apellido_materno}";
        }
        
        return "{$this->nombres} {$this->apellido_paterno}";
    }
}