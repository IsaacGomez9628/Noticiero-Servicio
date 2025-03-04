<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RedSocial extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'redes_sociales';

    // No utilizamos timestamps estándar
    public $timestamps = false;

    // Atributos asignables masivamente
    protected $fillable = [
        'nombre',
        'url_base',
    ];

    // Convertir atributos a tipos nativos
    protected $casts = [
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function tiposContacto()
    {
        return $this->hasMany(TipoContacto::class);
    }
}