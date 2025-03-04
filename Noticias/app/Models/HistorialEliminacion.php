<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class HistorialEliminacion extends Model
{
    use HasFactory;

    protected $table = 'historial_eliminaciones';
    
    public $timestamps = false;
    
    protected $fillable = [
        'tabla',
        'registro_id',
        'datos',
        'eliminado_por',
        'fecha_eliminacion',
        'motivo'
    ];
    
    protected $dates = [
        'fecha_eliminacion'
    ];
    
    protected $casts = [
        'datos' => 'json',
    ];
    
    // Este modelo no tiene relaciones directas a través de claves foráneas
    // pero podemos crear un método para buscar el usuario que eliminó el registro
    
    public function usuarioEliminador()
    {
        if (!$this->eliminado_por) {
            return null;
        }
        
        return Usuario::find($this->eliminado_por);
    }
    
    // Método para reconstruir el objeto eliminado a partir de los datos JSON
    public function getObjetoEliminadoAttribute()
    {
        return json_decode($this->datos);
    }
}