<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoUsuario extends Model
{
    use HasFactory;

    protected $table = 'tipos_usuarios';
    
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
    public function usuarios()
    {
        return $this->hasMany(Usuario::class);
    }
}