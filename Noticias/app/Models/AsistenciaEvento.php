<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsistenciaEvento extends Model
{
    use HasFactory;

    /**
     * El nombre de la tabla asociada con el modelo.
     *
     * @var string
     */
    protected $table = 'asistencia_eventos';

    /**
     * Los atributos que son asignables en masa.
     *
     * @var array
     */
    protected $fillable = [
        'evento_id',
        'usuario_id',
        'empresa_id',
        'status_id',
        'nombre',
        'email',
        'es_titular',
        'asistio',
        'fecha_registro',
        'fecha_confirmacion'
    ];

    /**
     * Los atributos que deben convertirse a tipos nativos.
     *
     * @var array
     */
    protected $casts = [
        'es_titular' => 'boolean',
        'asistio' => 'boolean',
        'fecha_registro' => 'datetime',
        'fecha_confirmacion' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    /**
     * Obtiene el evento asociado a esta asistencia.
     */
    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }

    /**
     * Obtiene el usuario asociado a esta asistencia, si existe.
     */
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    /**
     * Obtiene la empresa asociada a esta asistencia, si existe.
     */
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }

    /**
     * Obtiene el estado de esta asistencia.
     */
    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    /**
     * Scope para filtrar asistencias confirmadas.
     */
    public function scopeConfirmadas($query)
    {
        return $query->whereNotNull('fecha_confirmacion');
    }

    /**
     * Scope para filtrar por asistentes que asistieron al evento.
     */
    public function scopeAsistieron($query)
    {
        return $query->where('asistio', true);
    }

    /**
     * Scope para filtrar por titulares (representantes principales).
     */
    public function scopeTitulares($query)
    {
        return $query->where('es_titular', true);
    }

    /**
     * Scope para filtrar asistencias por evento.
     */
    public function scopePorEvento($query, $eventoId)
    {
        return $query->where('evento_id', $eventoId);
    }
}