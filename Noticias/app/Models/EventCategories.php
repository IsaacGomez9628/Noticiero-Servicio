<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventCategories extends Model
{
    /** @use HasFactory<\Database\Factories\EventCategoriesFactory> */
    use HasFactory;
    
    // Definir la tabla explícitamente
    protected $table = 'event_categories';
    
    // Relación con Event (una relación pertenece a un evento)
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    
    // Relación con Category (una relación pertenece a una categoría)
    public function category()
    {
        return $this->belongsTo(Categorie::class, 'categorie_id');
    }
}