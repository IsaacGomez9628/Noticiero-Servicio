<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AsistenciaEvento extends Model
{
    use HasFactory;

    protected $table = 'asistencia_eventos';
    
    public $timestamps = false;
    
    protected $fillable = [
        'usuario_id',
        'evento_id',
        'status_id',
        'fecha_registro',
        'fecha_actualizacion',
        'nota_cancelacion',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por'
    ];
    
    protected $dates = [
        'fecha_registro',
        'fecha_actualizacion',
        'fecha_eliminacion'
    ];
    
    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
    
    public function evento()
    {
        return $this->belongsTo(Evento::class);
    }
    
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}