<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Event extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = [
        'titule',
        'description',
        'start_date',
        'end_date',
        'start_time',
        'end_time',
        'price',
        'its_free',
        'organizer_id',
        'location_id',
        'admin_id',
        'capacity',
        'event_statuses_id',
        'slug'
    ];

    protected $casts = [
        'its_free' => 'boolean',
        'price' => 'decimal:2',
        'capacity' => 'integer',
        'start_date' => 'date',
        'end_date' => 'date'
    ];

    // Relaciones
    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function status()
    {
        return $this->belongsTo(EventStatus::class, 'event_statuses_id');
    }

    public function organizer()
    {
        return $this->belongsTo(Organizer::class, 'organizer_id'); // Cambiar de Admin a Organizer
    }

    public function admin()
    {
        return $this->belongsTo(Admin::class, 'admin_id');
    }

    public function attendances()
    {
        return $this->hasMany(EventAttendance::class);
    }

        // Relación muchos a muchos con Categories (un evento puede tener muchas categorías)
    public function categories()
    {
        return $this->belongsToMany(Categorie::class, 'event_categories', 'event_id', 'categorie_id')
                    ->withTimestamps();
    }
    
    // Relación polimórfica con Images (un evento puede tener muchas imágenes)
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