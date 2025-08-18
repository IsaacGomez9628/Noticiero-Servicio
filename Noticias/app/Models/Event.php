<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class Event extends Model
{
    /** @use HasFactory<\Database\Factories\EventsFactory> */
    use HasFactory, SoftDeletes, LogsActivity;
    
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
    
    // Relación con Organizer (un evento pertenece a un organizador)
    public function organizer()
    {
        return $this->belongsTo(Organizer::class);
    }
    
    // Relación con Location (un evento pertenece a una ubicación)
    public function location()
    {
        return $this->belongsTo(Location::class);
    }
    
    // Relación con Admin (un evento pertenece a un administrador que lo creó)
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
    
    // Relación con EventStatus (un evento pertenece a un estado)
    public function status()
    {
        return $this->belongsTo(EventStatus::class, 'event_statuses_id');
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
    
    // Relación con EventAttendances (un evento puede tener muchas asistencias) - EXISTENTE
    public function eventAttendances()
    {
        return $this->hasMany(EventAttendance::class);
    }
    
    // ✅ NUEVA: Relación adicional (alias para compatibilidad) - ESTO SOLUCIONA EL ERROR
    public function attendances()
    {
        return $this->hasMany(EventAttendance::class, 'event_id');
    }
    
    // Método para obtener asistencias confirmadas
    public function confirmedAttendances()
    {
        return $this->eventAttendances()->whereHas('status', function($query) {
            $query->where('slug', 'confirmado');
        });
    }
    
    // Método para obtener asistencias pendientes
    public function pendingAttendances()
    {
        return $this->eventAttendances()->whereHas('status', function($query) {
            $query->where('slug', 'pendiente');
        });
    }
    
    // ✅ NUEVA: Obtener asistencias canceladas
    public function cancelledAttendances()
    {
        return $this->attendances()->whereHas('status', function($query) {
            $query->where('slug', 'cancelado');
        });
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }
    
    // ✅ NUEVOS: Métodos auxiliares para gestionar asistencias
    /**
     * Verificar si un usuario está registrado en este evento
     */
    public function isUserRegistered($userId)
    {
        return $this->attendances()->where('user_id', $userId)->exists();
    }
    
    /**
     * Obtener el total de asistentes confirmados
     */
    public function getTotalConfirmedAttendeesAttribute()
    {
        return $this->confirmedAttendances()->count();
    }
    
    /**
     * Verificar si el evento tiene cupos disponibles
     */
    public function hasAvailableSpots()
    {
        if (!$this->capacity) {
            return true; // Sin límite de capacidad
        }
        
        return $this->getTotalConfirmedAttendeesAttribute() < $this->capacity;
    }
    
    // Scope para eventos activos (no eliminados y con fecha futura)
    public function scopeActive($query)
    {
        return $query->whereNull('deleted_at')
                    ->where('start_date', '>=', now()->toDateString());
    }
    
    // Scope para eventos próximos (en los próximos 30 días)
    public function scopeUpcoming($query)
    {
        return $query->whereBetween('start_date', [
            now()->toDateString(),
            now()->addDays(30)->toDateString()
        ]);
    }
    
    // Accessor para obtener el nombre completo del evento con fecha
    public function getFullTitleAttribute()
    {
        return $this->titule . ' - ' . $this->start_date;
    }
    
    // Accessor para verificar si el evento ya pasó
    public function getIsPastAttribute()
    {
        return $this->start_date < now()->toDateString();
    }
    
    // Accessor para verificar si está próximo (en los próximos 7 días)
    public function getIsUpcomingAttribute()
    {
        return $this->start_date >= now()->toDateString() && 
               $this->start_date <= now()->addDays(7)->toDateString();
    }
}