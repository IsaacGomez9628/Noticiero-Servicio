<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class City extends Model
{
    use HasFactory;

    /**
     * Los atributos que se pueden asignar masivamente.
     */
    protected $fillable = [
        'name',
        'estate_id'
    ];

    /**
     * Relación: Una ciudad pertenece a un estado
     */
    public function estate()
    {
        return $this->belongsTo(Estate::class);
    }

    /**
     * Relación: Una ciudad tiene muchas ubicaciones
     */
    public function locations()
    {
        return $this->hasMany(Location::class);
    }

    /**
     * Scope para obtener ciudades por estado
     */
    public function scopeByEstate($query, $estateId)
    {
        return $query->where('estate_id', $estateId);
    }

    /**
     * Scope para búsqueda por nombre
     */
    public function scopeSearch($query, $search)
    {
        return $query->where('name', 'like', '%' . $search . '%');
    }

    /**
     * Obtener el nombre completo con estado
     */
    public function getFullNameAttribute()
    {
        return $this->name . ', ' . $this->estate->name;
    }
}