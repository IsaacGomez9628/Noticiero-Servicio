<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    use HasFactory;

    protected $table = 'eventos';

    public $timestamps = false;

    protected $fillable = [
        'direccion_id',
        'status_id',
        'organizador_id',
        'titulo',
        'capacidad',
        'fecha_inicio',
        'fecha_fin',
        'multimedia_id',
        'descripcion',
    ];

    protected $casts = [
        'fecha_inicio' => 'datetime',
        'fecha_fin' => 'datetime',
        'fecha_eliminacion' => 'datetime',
        'capacidad' => 'integer',
        'eliminado' => 'boolean',
    ];

    public function direccion()
    {
        return $this->belongsTo(Direccion::class);
    }

    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function organizador()
    {
        return $this->belongsTo(Usuario::class, 'organizador_id');
    }

    public function multimedia()
    {
        return $this->belongsTo(Multimedia::class);
    }

    public function asistencias()
    {
        return $this->hasMany(AsistenciaEvento::class);
    }

    // Scope para obtener solo eventos activos
    public function scopeActivos($query)
    {
        return $query->where('eliminado', false);
    }

    // Scope para obtener eventos próximos
    public function scopeProximos($query)
    {
        return $query->where('eliminado', false)
                    ->where('fecha_inicio', '>=', now())
                    ->whereHas('status', function($q) {
                        $q->where('nombre', 'Programado');
                    })
                    ->orderBy('fecha_inicio', 'asc');
    }

    // Método para obtener un resumen de la descripción
    public function getResumenAttribute($length = 150)
    {
        if (!$this->descripcion) return null;
        
        return strlen($this->descripcion) > $length 
            ? substr($this->descripcion, 0, $length) . '...' 
            : $this->descripcion;
    }

    // Método para verificar si el evento está en curso
    public function estaEnCurso()
    {
        $now = now();
        return $now->greaterThanOrEqualTo($this->fecha_inicio) && 
               ($this->fecha_fin === null || $now->lessThanOrEqualTo($this->fecha_fin));
    }

    // Método para verificar si el evento ya terminó
    public function haTerminado()
    {
        return $this->fecha_fin !== null && now()->greaterThan($this->fecha_fin);
    }

    // Método para obtener número de asistentes confirmados
    public function getAsistentesConfirmadosAttribute()
    {
        return $this->asistencias()
                    ->whereHas('status', function($q) {
                        $q->where('nombre', 'Activo');
                    })
                    ->count();
    }
}