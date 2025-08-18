<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Traits\LogsActivity;

class EventAttendance extends Model
{
    use HasFactory, SoftDeletes, LogsActivity;
    
    protected $fillable = [
        'event_id',
        'user_id',
        'company_id',
        'nombre',
        'email',
        'telefono',
        'tipo_registro',
        'status_id',
        'organizer_id',
        'informacion_adicional',
        'codigo_registro',
        'ip_registro',
        'user_agent'
    ];
    
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
    
    // Relación con Event (una asistencia pertenece a un evento)
    public function event()
    {
        return $this->belongsTo(Event::class);
    }
    
    // Relación con User (una asistencia puede pertenecer a un usuario)
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    // Relación con Company (una asistencia puede pertenecer a una empresa)
    public function company()
    {
        return $this->belongsTo(Company::class);
    }
    
    // Relación con Status (una asistencia pertenece a un estado)
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
    
    // Relación con Organizer (una asistencia puede pertenecer a un organizador)
    public function organizer()
    {
        return $this->belongsTo(Organizer::class);
    }
    
    // Relación polimórfica para registrar actividades sobre este modelo
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }
    
    // Scope para asistencias confirmadas
    public function scopeConfirmed($query)
    {
        return $query->whereHas('status', function($q) {
            $q->where('slug', 'confirmado');
        });
    }
    
    // Scope para asistencias pendientes
    public function scopePending($query)
    {
        return $query->whereHas('status', function($q) {
            $q->where('slug', 'pendiente');
        });
    }
    
    // Scope para asistencias canceladas
    public function scopeCancelled($query)
    {
        return $query->whereHas('status', function($q) {
            $q->where('slug', 'cancelado');
        });
    }
    
    // Scope para asistencias de hoy
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }
    
    // Scope para asistencias de esta semana
    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }
    
    // Scope para asistencias de este mes
    public function scopeThisMonth($query)
    {
        return $query->whereMonth('created_at', now()->month)
                    ->whereYear('created_at', now()->year);
    }
    
    // Accessor para obtener el nombre del asistente
    public function getAttendeeNameAttribute()
    {
        if ($this->user && $this->user->person) {
            return $this->user->person->getFullNameAttribute();
        }
        
        return $this->nombre ?? 'Sin nombre';
    }
    
    // Accessor para verificar si es registro personal o institucional
    public function getIsPersonalRegistrationAttribute()
    {
        return $this->tipo_registro === 'personal';
    }
    
    // Accessor para verificar si es registro institucional
    public function getIsInstitutionalRegistrationAttribute()
    {
        return $this->tipo_registro === 'institucional';
    }
    
    // Método para obtener el color del estado
    public function getStatusColorAttribute()
    {
        if (!$this->status) return 'gray';
        
        $colors = [
            'confirmado' => 'green',
            'pendiente' => 'yellow',
            'cancelado' => 'red',
            'rechazado' => 'red',
        ];
        
        return $colors[$this->status->slug] ?? 'gray';
    }
    
    // Boot method para generar código de registro automáticamente
    protected static function boot()
    {
        parent::boot();
        
        static::creating(function ($attendance) {
            if (empty($attendance->codigo_registro)) {
                $attendance->codigo_registro = static::generateUniqueCode();
            }
        });
    }
    
    // Método para generar código único de registro
    private static function generateUniqueCode()
    {
        do {
            $code = strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
        } while (static::where('codigo_registro', $code)->exists());
        
        return $code;
    }
}