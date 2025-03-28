<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Image extends Model
{
    /** @use HasFactory<\Database\Factories\ImagesFactory> */
    use HasFactory;
    
    // Relación polimórfica (una imagen puede pertenecer a cualquier modelo)
    public function imageable()
    {
        return $this->morphTo();
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }
}