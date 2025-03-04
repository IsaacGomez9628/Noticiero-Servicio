<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoContacto extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'tipos_contacto';

    // No utilizamos timestamps estándar
    public $timestamps = false;

    // Atributos asignables masivamente
    protected $fillable = [
        'red_social_id',
        'url_perfil',
    ];

    // Convertir atributos a tipos nativos
    protected $casts = [
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function redSocial()
    {
        return $this->belongsTo(RedSocial::class);
    }

    public function contactos()
    {
        return $this->hasMany(Contacto::class);
    }

    // Método para obtener la URL completa del perfil
    public function getUrlPerfilCompletoAttribute()
    {
        if (!$this->url_perfil || !$this->redSocial) {
            return null;
        }
        
        // Si ya es una URL completa, devolverla
        if (filter_var($this->url_perfil, FILTER_VALIDATE_URL)) {
            return $this->url_perfil;
        }
        
        // Construir la URL completa
        return $this->redSocial->url_base . '/' . ltrim($this->url_perfil, '/');
    }
}