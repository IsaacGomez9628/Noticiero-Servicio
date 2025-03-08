<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'empresas';

    public $timestamps = false;


    protected $fillable = [
        'nombre',
        'descripcion',
        'contacto_id',
    ];

    // Convertir atributos a tipos nativos
    protected $casts = [
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function contacto()
    {
        return $this->belongsTo(Contacto::class);
    }

    public function microCredenciales()
    {
        return $this->hasMany(MicroCredencial::class);
    }
}