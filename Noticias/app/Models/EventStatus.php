<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventStatus extends Model
{
    /** @use HasFactory<\Database\Factories\EventStatusFactory> */
    use HasFactory;
    
    // Relación con Events (un estado puede tener muchos eventos)
    public function events()
    {
        return $this->hasMany(Events::class, 'event_statuses_id');
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLogs::class, 'object');
    }
}