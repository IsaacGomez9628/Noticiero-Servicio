<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Locations extends Model
{
    /** @use HasFactory<\Database\Factories\LocationsFactory> */
    use HasFactory;
    
    // Relación con Events (una ubicación puede tener muchos eventos)
    public function events()
    {
        return $this->hasMany(Events::class);
    }
    
    // Relación polimórfica con Images (una ubicación puede tener imágenes)
    public function images()
    {
        return $this->morphMany(Images::class, 'imageable');
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLogs::class, 'object');
    }
}