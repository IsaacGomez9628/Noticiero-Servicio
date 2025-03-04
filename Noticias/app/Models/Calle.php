<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Calle extends Model
{
    use HasFactory;

    protected $table = 'calles';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'numero',
    ];


    protected $casts = [
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    public function direcciones()
    {
        return $this->hasMany(Direccion::class);
    }

    public function getDireccionCalleAttribute()
    {
        return $this->nombre . ($this->numero ? ' #' . $this->numero : '');
    }
}