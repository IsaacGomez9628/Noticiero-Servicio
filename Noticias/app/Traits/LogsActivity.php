<?php

namespace App\Traits;

use App\Models\ActivityLog;
use Illuminate\Support\Facades\Auth;

trait LogsActivity
{
    /**
     * Boot the trait and set up model event listeners
     */
    protected static function bootLogsActivity()
    {
        // Registrar actividad cuando se crea un modelo
        static::created(function ($model) {
            $model->logActivity('create', "Nuevo {$model->getModelName()} creado.");
        });

        // Registrar actividad cuando se actualiza un modelo
        static::updated(function ($model) {
            $model->logActivity('update', "{$model->getModelName()} actualizado.");
        });

        // Registrar actividad cuando se elimina un modelo
        static::deleted(function ($model) {
            $model->logActivity('delete', "{$model->getModelName()} eliminado.");
        });
    }

    /**
     * Registra una actividad para este modelo
     */
    public function logActivity($action, $details = null, $adminId = null)
    {
        // Obtener el ID del admin autenticado
        if (!$adminId) {
            $adminId = $this->getCurrentAdminId();
        }

        // Solo registrar si hay un admin autenticado
        if ($adminId) {
            ActivityLog::create([
                'admin_id' => $adminId,
                'object_type' => get_class($this),
                'object_id' => $this->id,
                'action' => $action,
                'details' => $details ?: $this->getDefaultDetails($action),
                'ip' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        }
    }

    /**
     * Obtiene el ID del admin autenticado
     */
    protected function getCurrentAdminId()
    {
        // Intentar obtener el admin desde la sesión o guard específico
        if (Auth::guard('admin')->check()) {
            return Auth::guard('admin')->id();
        }

        // Fallback: si el usuario autenticado es admin
        if (Auth::check()) {
            $user = Auth::user();
            
            // Verificar si el usuario tiene un rol de admin
            if (method_exists($user, 'hasRole') && $user->hasRole('admin')) {
                // Si existe un modelo Admin relacionado con este usuario
                if (method_exists($user, 'admin') && $user->admin) {
                    return $user->admin->id;
                }
            }
        }

        return null;
    }

    /**
     * Obtiene los detalles por defecto para una acción
     */
    protected function getDefaultDetails($action)
    {
        $modelName = $this->getModelName();
        
        $details = [
            'create' => "Nuevo {$modelName} registrado en el sistema.",
            'update' => "{$modelName} actualizado correctamente.",
            'delete' => "{$modelName} eliminado del sistema.",
            'view' => "{$modelName} consultado.",
            'register' => "Registro de {$modelName} procesado.",
            'cancel' => "{$modelName} cancelado.",
            'approve' => "{$modelName} aprobado.",
            'reject' => "{$modelName} rechazado.",
        ];

        return $details[$action] ?? "Acción '{$action}' realizada sobre {$modelName}.";
    }

    /**
     * Obtiene el nombre amigable del modelo
     */
    protected function getModelName()
    {
        $className = class_basename(get_class($this));
        
        $names = [
            'User' => 'usuario',
            'Event' => 'evento',
            'EventAttendance' => 'asistencia',
            'Admin' => 'administrador',
            'Company' => 'empresa',
            'Organizer' => 'organizador',
            'Location' => 'ubicación',
        ];

        return $names[$className] ?? strtolower($className);
    }

    /**
     * Registra una actividad personalizada
     */
    public function logCustomActivity($action, $details, $adminId = null)
    {
        $this->logActivity($action, $details, $adminId);
    }

    /**
     * Registra múltiples actividades de una vez
     */
    public function logMultipleActivities(array $activities, $adminId = null)
    {
        foreach ($activities as $activity) {
            $action = $activity['action'];
            $details = $activity['details'] ?? null;
            
            $this->logActivity($action, $details, $adminId);
        }
    }

    /**
     * Obtiene todas las actividades de este modelo
     */
    public function activities()
    {
        return $this->morphMany(ActivityLog::class, 'object');
    }

    /**
     * Obtiene las actividades recientes de este modelo
     */
    public function recentActivities($limit = 5)
    {
        return $this->activities()
                    ->with('admin')
                    ->orderBy('created_at', 'desc')
                    ->take($limit)
                    ->get();
    }
}