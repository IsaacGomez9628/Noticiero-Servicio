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

    // Relación con locations (una ubicación puede tener una ubicación padre)
    public function contacts ()
    {
        return $this->hasMany(Contact::class);
    } 
    
    // Relación con Estate (una ubicación pertenece a una propiedad)
    public function estate()
    {
        return $this->belongsTo(Estate::class);
    }
    // Relación con City (una ubicación pertenece a una ciudad)
    public function city()
    {
        return $this->belongsTo(City::class);
    }
}