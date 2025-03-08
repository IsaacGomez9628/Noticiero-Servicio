<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Miembro extends Model
{
    use HasFactory;

    protected $table = 'miembros';
    
    public $timestamps = false;
    
    protected $fillable = [
        'persona_id',
        'cargo_id',
        'status_id',
        'multimedia_id',
        'descripcion_profesional',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por'
    ];
    
    protected $dates = [
        'fecha_eliminacion'
    ];
    
    // Relaciones
    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }
    
    public function cargo()
    {
        return $this->belongsTo(Cargo::class);
    }
    
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
    
    public function multimedia()
    {
        return $this->belongsTo(Multimedia::class);
    }
}