<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contacto extends Model
{
    use HasFactory;

    // Nombre de la tabla
    protected $table = 'contactos';

    public $timestamps = false;

    protected $fillable = [
        'persona_id',
        'direccion_id',
        'tipo_contacto_id',
        'email',
        'telefono',
    ];

    // Convertir atributos a tipos nativos
    protected $casts = [
        'fecha_actualizacion_atributo' => 'datetime',
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }

    public function direccion()
    {
        return $this->belongsTo(Direccion::class);
    }

    public function tipoContacto()
    {
        return $this->belongsTo(TipoContacto::class);
    }

    public function empresas()
    {
        return $this->hasMany(Empresa::class);
    }
}