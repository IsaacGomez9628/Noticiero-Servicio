<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Multimedia extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'multimedia';

    // No utilizamos timestamps estándar
    public $timestamps = false;

    // Atributos asignables masivamente
    protected $fillable = [
        'url',
        'nombre',
        'tamaño',
        'formato',
    ];

    // Convertir atributos a tipos nativos
    protected $casts = [
        'fecha_actualizacion' => 'datetime',
        'fecha_eliminacion' => 'datetime',
        'tamaño' => 'integer',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function noticias()
    {
        return $this->hasMany(Noticia::class);
    }

    public function eventos()
    {
        return $this->hasMany(Evento::class);
    }

    public function miembros()
    {
        return $this->hasMany(Miembro::class);
    }

    // Scope para obtener solo multimedia activa
    public function scopeActivos($query)
    {
        return $query->where('eliminado', false);
    }

    // Método para obtener la URL completa
    public function getUrlCompleteAttribute()
    {
        if (filter_var($this->url, FILTER_VALIDATE_URL)) {
            return $this->url;
        }
        
        return asset('storage/' . $this->url);
    }

    // Método para obtener la extensión del archivo
    public function getExtensionAttribute()
    {
        return pathinfo($this->url, PATHINFO_EXTENSION);
    }

    // Método para verificar si es una imagen
    public function esImagen()
    {
        $imageFormats = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        return in_array(strtolower($this->getExtensionAttribute()), $imageFormats);
    }

    // Método para verificar si es un video
    public function esVideo()
    {
        $videoFormats = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'];
        return in_array(strtolower($this->getExtensionAttribute()), $videoFormats);
    }
}