<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MicroCredencial extends Model
{
    use HasFactory;

    protected $table = 'micro_credenciales';
    
    public $timestamps = false;
    
    protected $fillable = [
        'empresa_id',
        'responsable_id',
        'status_id',
        'titulo',
        'descripcion',
        'fecha_inicio',
        'fecha_fin',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por'
    ];
    
    protected $dates = [
        'fecha_inicio',
        'fecha_fin',
        'fecha_eliminacion'
    ];
    
    // Relaciones
    public function empresa()
    {
        return $this->belongsTo(Empresa::class);
    }
    
    public function responsable()
    {
        return $this->belongsTo(Persona::class, 'responsable_id');
    }
    
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}