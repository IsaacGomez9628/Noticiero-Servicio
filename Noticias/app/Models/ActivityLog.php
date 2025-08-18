<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLog extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'admin_id',
        'object_type',
        'object_id',
        'action',
        'details',
        'ip',
        'user_agent'
    ];
    
    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];
    
    // Relación con Admin (un log pertenece a un administrador)
    public function admin()
    {
        return $this->belongsTo(Admin::class);
    }
    
    // Relación polimórfica con el objeto sobre el que se realizó la acción
    public function object()
    {
        return $this->morphTo();
    }
    
    // Scope para actividades de hoy
    public function scopeToday($query)
    {
        return $query->whereDate('created_at', today());
    }
    
    // Scope para actividades de esta semana
    public function scopeThisWeek($query)
    {
        return $query->whereBetween('created_at', [
            now()->startOfWeek(),
            now()->endOfWeek()
        ]);
    }
    
    // Scope para actividades recientes (últimas 24 horas)
    public function scopeRecent($query)
    {
        return $query->where('created_at', '>=', now()->subDay());
    }
    
    // Scope para filtrar por tipo de acción
    public function scopeByAction($query, $action)
    {
        return $query->where('action', $action);
    }
    
    // Scope para filtrar por tipo de objeto
    public function scopeByObjectType($query, $objectType)
    {
        return $query->where('object_type', $objectType);
    }
    
    // Método estático para registrar una actividad
    public static function logActivity($adminId, $object, $action, $details = null, $ip = null, $userAgent = null)
    {
        return static::create([
            'admin_id' => $adminId,
            'object_type' => get_class($object),
            'object_id' => $object->id,
            'action' => $action,
            'details' => $details,
            'ip' => $ip ?? request()->ip(),
            'user_agent' => $userAgent ?? request()->userAgent(),
        ]);
    }
    
    // Accessor para obtener un resumen de la actividad
    public function getSummaryAttribute()
    {
        $adminName = $this->admin ? $this->admin->name : 'Sistema';
        $action = $this->getActionNameAttribute();
        $objectName = $this->getObjectNameAttribute();
        
        return "{$adminName} {$action} {$objectName}";
    }
    
    // Accessor para obtener el nombre de la acción en español
    public function getActionNameAttribute()
    {
        $actions = [
            'create' => 'creó',
            'update' => 'actualizó',
            'delete' => 'eliminó',
            'view' => 'visualizó',
            'register' => 'registró',
            'cancel' => 'canceló',
            'approve' => 'aprobó',
            'reject' => 'rechazó',
        ];
        
        return $actions[$this->action] ?? $this->action;
    }
    
    // Accessor para obtener el nombre del objeto
    public function getObjectNameAttribute()
    {
        $objects = [
            'App\Models\User' => 'un usuario',
            'App\Models\Event' => 'un evento',
            'App\Models\EventAttendance' => 'una asistencia',
            'App\Models\Admin' => 'un administrador',
            'App\Models\Company' => 'una empresa',
        ];
        
        return $objects[$this->object_type] ?? 'un elemento';
    }
    
    // Accessor para obtener el ícono de la acción
    public function getActionIconAttribute()
    {
        $icons = [
            'create' => 'plus',
            'update' => 'edit',
            'delete' => 'trash',
            'view' => 'eye',
            'register' => 'user-plus',
            'cancel' => 'x',
            'approve' => 'check',
            'reject' => 'x',
        ];
        
        return $icons[$this->action] ?? 'activity';
    }
}