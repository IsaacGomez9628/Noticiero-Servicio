<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ReferenciaNotificacion extends Model
{
    use HasFactory;

    protected $table = 'referencia_notificaciones';
    
    public $timestamps = false;
    
    protected $fillable = [
        'nombre',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por'
    ];
    
    protected $dates = [
        'fecha_eliminacion'
    ];
    
    // Relaciones
    public function notificacionesTipo()
    {
        return $this->hasMany(Notificacion::class, 'tipo_notificacion_id');
    }
    
    public function notificacionesReferencia()
    {
        return $this->hasMany(Notificacion::class, 'referencia_id');
    }
}