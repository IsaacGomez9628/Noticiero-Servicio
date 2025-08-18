<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Organizer extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'name',
        'email',
        'phone',
        'description',
        'web_site',
        'social_media',
        'direction',
        'city',
        'logo',
        'active'
    ];
    
    protected $casts = [
        'active' => 'boolean',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];
    
    // Relación con Events
    public function events()
    {
        return $this->hasMany(Event::class);
    }
    
    // Relación polimórfica con Images
    public function images()
    {
        return $this->morphMany(Image::class, 'imageable');
    }
    
    // Relación polimórfica para actividades
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }
    
    // Accessor para obtener la URL completa del logo
    public function getLogoUrlAttribute()
    {
        if ($this->logo) {
            return asset('storage/' . $this->logo);
        }
        return null;
    }
}