<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    /** @use HasFactory<\Database\Factories\LocationsFactory> */
    use HasFactory;
    
    // Relación con Events (una ubicación puede tener muchos eventos)
    public function events()
    {
        return $this->hasMany(Event::class);
    }
    
    // Relación polimórfica con Images (una ubicación puede tener imágenes)
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }
}