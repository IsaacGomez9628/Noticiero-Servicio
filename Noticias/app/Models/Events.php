<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Events extends Model
{
    /** @use HasFactory<\Database\Factories\EventsFactory> */
    use HasFactory, SoftDeletes;
    
    // Relación con Organizer (un evento pertenece a un organizador)
    public function organizer()
    {
        return $this->belongsTo(Organizers::class);
    }
    
    // Relación con Location (un evento pertenece a una ubicación)
    public function location()
    {
        return $this->belongsTo(Locations::class);
    }
    
    // Relación con Admin (un evento pertenece a un administrador que lo creó)
    public function admin()
    {
        return $this->belongsTo(Admins::class);
    }
    
    // Relación con EventStatus (un evento pertenece a un estado)
    public function status()
    {
        return $this->belongsTo(EventStatus::class, 'event_statuses_id');
    }
    
    // Relación muchos a muchos con Categories (un evento puede tener muchas categorías)
    public function categories()
    {
        return $this->belongsToMany(Categories::class, 'event_categories', 'event_id', 'categorie_id')
                    ->withTimestamps();
    }
    
    // Relación polimórfica con Images (un evento puede tener muchas imágenes)
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