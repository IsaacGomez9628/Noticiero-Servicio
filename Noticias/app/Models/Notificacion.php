<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Notificacion extends Model
{
    use HasFactory;

    protected $table = 'notificaciones';
    
    public $timestamps = false;
    
    protected $fillable = [
        'usuario_id',
        'tipo_notificacion_id',
        'referencia_id',
        'titulo',
        'contenido',
        'fecha_creacion',
        'fecha_lectura',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por'
    ];
    
    protected $dates = [
        'fecha_creacion',
        'fecha_lectura',
        'fecha_eliminacion'
    ];
    
    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
    
    public function tipoNotificacion()
    {
        return $this->belongsTo(ReferenciaNotificacion::class, 'tipo_notificacion_id');
    }
    
    public function referencia()
    {
        return $this->belongsTo(ReferenciaNotificacion::class, 'referencia_id');
    }
    
    public function marcarComoLeida()
    {
        $this->fecha_lectura = now();
        return $this->save();
    }
    
    public function scopeNoLeidas($query)
    {
        return $query->whereNull('fecha_lectura')
                     ->where('eliminado', 0);
    }
}