<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Comentario extends Model
{
    use HasFactory;

    protected $table = 'comentarios';

    public $timestamps = false;

    protected $fillable = [
        'usuario_id',
        'tipo_contenido_id',
        'noticia_id',
        'comentario',
        'status_id',
    ];

    protected $casts = [
        'fecha_creacion' => 'datetime',
        'fecha_actualizacion' => 'datetime', 
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }

    public function tipoContenido()
    {
        return $this->belongsTo(TipoContenido::class);
    }

    public function noticia()
    {
        return $this->belongsTo(Noticia::class);
    }
    
    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function scopeActivos($query)
    {
        return $query->where('eliminado', false);
    }

    public function scopeAprobados($query)
    {
        return $query->where('eliminado', false)
                    ->whereHas('status', function($q) {
                        $q->where('nombre', 'Aprobado');
                    });
    }

    public function estaAprobado()
    {
        return $this->status->nombre === 'Aprobado';
    }

    // Método para verificar si el comentario está pendiente
    public function estaPendiente()
    {
        return $this->status->nombre === 'Pendiente';
    }

    // Método para verificar si es un comentario de noticia
    public function esComentarioDeNoticia()
    {
        return $this->tipoContenido->nombre === 'Noticia';
    }

    // Método para verificar si es un comentario de evento
    public function esComentarioDeEvento()
    {
        return $this->tipoContenido->nombre === 'Evento';
    }
}