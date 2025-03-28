<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Categorie extends Model
{
    /** @use HasFactory<\Database\Factories\CategoriesFactory> */
    use HasFactory;
    
    // Relación muchos a muchos con Events (una categoría puede tener muchos eventos)
    public function events()
    {
        return $this->belongsToMany(Event::class, 'event_categories', 'categorie_id', 'event_id')
                    ->withTimestamps();
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }
}