<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Noticia extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'noticias';

    // No utilizamos timestamps estándar
    public $timestamps = false;

    // Atributos asignables masivamente
    protected $fillable = [
        'status_id',
        'autor_id',
        'multimedia_id',
        'titulo',
        'contenido',
        'visitas',
    ];

    // Convertir atributos a tipos nativos
    protected $casts = [
        'fecha_creacion' => 'datetime',
        'ultima_edicion' => 'datetime',
        'fecha_eliminacion' => 'datetime',
        'visitas' => 'integer',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function status()
    {
        return $this->belongsTo(Status::class);
    }

    public function autor()
    {
        return $this->belongsTo(Usuario::class, 'autor_id');
    }

    public function multimedia()
    {
        return $this->belongsTo(Multimedia::class);
    }

    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }

    public function interacciones()
    {
        return $this->hasMany(InteraccionNoticia::class);
    }

    // Scope para obtener solo noticias activas
    public function scopeActivas($query)
    {
        return $query->where('eliminado', false);
    }

    // Scope para obtener noticias publicadas
    public function scopePublicadas($query)
    {
        return $query->where('eliminado', false)
                    ->whereHas('status', function($q) {
                        $q->where('nombre', 'Publicada');
                    });
    }

    // Método para obtener un resumen del contenido
    public function getResumenAttribute($length = 150)
    {
        return strlen($this->contenido) > $length 
            ? substr($this->contenido, 0, $length) . '...' 
            : $this->contenido;
    }

    // Método para incrementar visitas
    public function incrementarVisitas()
    {
        $this->increment('visitas');
        return $this;
    }
}