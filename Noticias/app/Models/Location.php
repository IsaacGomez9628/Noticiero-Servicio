<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    /** @use HasFactory<\Database\Factories\LocationsFactory> */
    use HasFactory;

    protected $fillable = [
        'name', 
        'direction', 
        'estate_id',
        'city_id',
        'country',
        'zip_code',
        'latitude',
        'length',
        'link_google_maps',
        'active'
    ];
    
    protected $casts = [
        'estate_id' => 'integer',
        'city_id' => 'integer',
        'latitude' => 'decimal:8',
        'length' => 'decimal:8',
        'active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime'
    ];
    
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

    // Relación con contacts (una ubicación puede tener contactos)
    public function contacts()
    {
        return $this->hasMany(Contact::class);
    } 
    
    // Relación con Estate (una ubicación pertenece a un estado)
    public function estate()
    {
        return $this->belongsTo(Estate::class);
    }
    
    // Relación con City (una ubicación pertenece a una ciudad)
    public function city()
    {
        return $this->belongsTo(City::class);
    }
    
    // Scope para ubicaciones activas
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }
    
    // Accesor para obtener la dirección completa
    public function getFullAddressAttribute()
    {
        $parts = [];
        
        if ($this->direction) {
            $parts[] = $this->direction;
        }
        
        if ($this->city) {
            $parts[] = $this->city->name;
        }
        
        if ($this->estate) {
            $parts[] = $this->estate->name;
        }
        
        if ($this->country) {
            $parts[] = $this->country;
        }
        
        if ($this->zip_code) {
            $parts[] = 'C.P. ' . $this->zip_code;
        }
        
        return implode(', ', $parts);
    }
    
    // Accesor para obtener las coordenadas
    public function getCoordinatesAttribute()
    {
        if ($this->latitude && $this->length) {
            return [
                'lat' => (float) $this->latitude,
                'lng' => (float) $this->length
            ];
        }
        
        return null;
    }
}