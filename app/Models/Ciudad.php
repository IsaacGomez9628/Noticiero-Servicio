<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Ciudad extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'ciudades';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
    ];

    protected $casts = [
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    public function direcciones()
    {
        return $this->hasMany(Direccion::class);
    }
}