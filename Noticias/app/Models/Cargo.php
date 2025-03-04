<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cargo extends Model
{
    use HasFactory;

    protected $table = 'cargos';

    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'descripcion',
    ];

    protected $casts = [
        'fecha_eliminacion' => 'datetime',
        'eliminado' => 'boolean',
    ];

    public function miembros()
    {
        return $this->hasMany(Miembro::class);
    }
}
