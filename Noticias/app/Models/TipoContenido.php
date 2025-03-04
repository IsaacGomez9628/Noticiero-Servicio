<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoContenido extends Model
{
    use HasFactory;

    protected $table = 'tipos_contenido';
    
    public $timestamps = false;
    
    protected $fillable = [
        'nombre',
        'descripcion',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por'
    ];
    
    protected $dates = [
        'fecha_eliminacion'
    ];
    
    // Relaciones
    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }
}