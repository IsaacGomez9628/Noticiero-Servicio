<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class InteraccionNoticia extends Model
{
    use HasFactory;

    protected $table = 'interaccion_noticias';
    
    public $timestamps = false;
    
    protected $fillable = [
        'usuario_id',
        'noticia_id',
        'me_gusta',
        'guardado',
        'fecha_interaccion',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por'
    ];
    
    protected $dates = [
        'fecha_interaccion',
        'fecha_eliminacion'
    ];
    
    // Relaciones
    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
    
    public function noticia()
    {
        return $this->belongsTo(Noticia::class);
    }
}