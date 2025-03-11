<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Contacto;

class Direccion extends Model
{
    use HasFactory;

    protected $table = 'direcciones';

    public $timestamps = false;

    protected $fillable = [
        'calle_id',
        'ciudad_id',
        'estado_direccion_id',
        'codigo_postal',
    ];

    protected $casts = [
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    // Relaciones
    public function calle()
    {
        return $this->belongsTo(Calle::class);
    }

    public function ciudad()
    {
        return $this->belongsTo(Ciudad::class);
    }

    public function estado()
    {
        return $this->belongsTo(EstadoDireccion::class, 'estado_direccion_id');
    }

    public function contactos()
    {
        return $this->hasMany(Contacto::class);
    }

    public function eventos()
    {
        return $this->hasMany(Evento::class);
    }

    public function getDireccionCompletaAttribute()
{
    return $this->calle . ', ' . $this->ciudad->nombre . ', ' . $this->codigo_postal;
}
}