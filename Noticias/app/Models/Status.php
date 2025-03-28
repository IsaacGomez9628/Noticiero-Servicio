<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'nombre',
        'slug',
        'tipo',
        'descripcion',
        'color',
        'activo',
        'orden'
    ];
    
    /**
     * Relación polimórfica para todos los modelos que utilizan este estatus
     */
    public function statusable()
    {
        return $this->morphTo();
    }
    
    /**
     * Obtener estatus por tipo y slug
     */
    public static function findByTypeAndSlug($tipo, $slug)
    {
        return self::where('tipo', $tipo)
                  ->where('slug', $slug)
                  ->where('activo', true)
                  ->first();
    }
    
    /**
     * Obtener todos los estatus de un tipo determinado
     */
    public static function getByType($tipo)
    {
        return self::where('tipo', $tipo)
                  ->where('activo', true)
                  ->orderBy('orden')
                  ->get();
    }
}