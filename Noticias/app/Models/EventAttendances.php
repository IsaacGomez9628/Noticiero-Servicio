<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class EventAttendance extends Model
{
    use HasFactory, SoftDeletes;
    
    protected $fillable = [
        'event_id', 
        'user_id', 
        'nombre', 
        'email', 
        'telefono',
        'tipo_registro', 
        'status_id', 
        'institution_id',
        'informacion_adicional', 
        'codigo_registro',
        'ip_registro', 
        'user_agent'
    ];
    
    /**
     * Relación con el evento
     */
    public function event()
    {
        return $this->belongsTo(Event::class, 'event_id');
    }
    
    /**
     * Relación con el usuario (si está registrado)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    /**
     * Relación con la institución (si existe)
     */
    public function institution()
    {
        return $this->belongsTo(Organizer::class, 'institution_id');
    }
    
    /**
     * Relación con el estatus
     */
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
    
    /**
     * Generar un código de registro único
     */
    public static function generarCodigoRegistro()
    {
        return strtoupper(substr(md5(uniqid(rand(), true)), 0, 8));
    }
    
    /**
     * Verificar si la asistencia está confirmada
     */
    public function estaConfirmada()
    {
        // Asumiendo que tienes un estatus con slug 'confirmado'
        return $this->status->slug === 'confirmado';
    }
    
    /**
     * Verificar si la asistencia está cancelada
     */
    public function estaCancelada()
    {
        return $this->status->slug === 'cancelado';
    }
}