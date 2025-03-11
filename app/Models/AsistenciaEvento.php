<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsistenciaEvento extends Model
{
    use HasFactory;

    protected $table = 'asistencia_eventos';

    protected $fillable = [
        'evento_id',
        'usuario_id',
        'empresa_id',
        'nombre',
        'email',
        'es_titular',
        'status_id',
        'asistio',
        'fecha_registro',
        'fecha_confirmacion',
    ];

    protected $casts = [
        'es_titular' => 'boolean',
        'asistio' => 'boolean',
        'fecha_registro' => 'datetime',
        'fecha_confirmacion' => 'datetime',
    ];

    // Relación con el evento
    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }

    // Relación con el usuario (si está registrado)
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    // Relación con la empresa
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    // Relación con el status
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}