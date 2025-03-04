<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoDireccion extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'estados_direcciones';

    // No utilizamos timestamps estándar
    public $timestamps = false;

    // Atributos asignables masivamente
    protected $fillable = [
        'nombre',
    ];

    // Convertir atributos a tipos nativos
    protected $casts = [
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function direcciones()
    {
        return $this->hasMany(Direccion::class);
    }
}