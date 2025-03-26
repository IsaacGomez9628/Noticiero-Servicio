<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organizers extends Model
{
    /** @use HasFactory<\Database\Factories\OrganizersFactory> */
    use HasFactory, SoftDeletes;
    
    // Relación con Events (un organizador puede tener muchos eventos)
    public function events()
    {
        return $this->hasMany(Events::class);
    }
    
    // Relación polimórfica con Images (un organizador puede tener imágenes, como su logo)
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