<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Event;
use App\Models\EventAttendance;
use App\Models\Admin;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use Inertia\Inertia;

class AdminDashboardController extends Controller
{
    /**
     * Muestra el dashboard principal del administrador con estadísticas reales
     */
    public function index()
    {
        // Obtener estadísticas del sistema
        $dashboardStats = $this->getDashboardStats();
        
        // Obtener actividad reciente
        $recentActivity = $this->getRecentActivity();
        
        // Obtener datos adicionales
        $additionalData = $this->getAdditionalData();
        
        return Inertia::render('Admin/Dashboard', [
            'dashboardStats' => $dashboardStats,
            'recentActivity' => $recentActivity,
            'additionalData' => $additionalData
        ]);
    }
    
    /**
     * Obtiene las estadísticas principales del dashboard
     */
    private function getDashboardStats()
    {
        return [
            // Total de usuarios registrados
            'users' => User::count(),
            
            // Eventos activos (no eliminados y con fecha futura o actual)
            'activeEvents' => Event::where('start_date', '>=', Carbon::now()->toDateString())
                                   ->whereNull('deleted_at')
                                   ->count(),
            
            // Total de registros de asistencia
            'attendances' => EventAttendance::whereNull('deleted_at')->count(),
            
            // Administradores activos (no eliminados)
            'activeAdmins' => Admin::whereNull('deleted_at')->count(),
            
            // Estadísticas adicionales
            'totalEvents' => Event::count(), // Todos los eventos
            'pendingAttendances' => EventAttendance::whereHas('status', function($query) {
                $query->where('slug', 'pendiente');
            })->count(),
            'confirmedAttendances' => EventAttendance::whereHas('status', function($query) {
                $query->where('slug', 'confirmado');
            })->count(),
            'cancelledAttendances' => EventAttendance::whereHas('status', function($query) {
                $query->where('slug', 'cancelado');
            })->count(),
        ];
    }
    
    /**
     * Obtiene la actividad reciente del sistema
     */
    private function getRecentActivity()
    {
        return ActivityLog::with(['admin', 'object'])
            ->orderBy('created_at', 'desc')
            ->take(10)
            ->get()
            ->map(function ($activity) {
                return [
                    'id' => $activity->id,
                    'action' => $this->formatAction($activity->action, $activity->object_type),
                    'user' => $activity->admin ? $activity->admin->name : 'Sistema',
                    'date' => $activity->created_at->format('d/m/Y H:i'),
                    'details' => $activity->details ?? $this->generateDetails($activity),
                    'tag' => $this->getActionTag($activity->action),
                    'tagColor' => $this->getActionColor($activity->action),
                ];
            });
    }
    
    /**
     * Obtiene datos adicionales para el dashboard
     */
    private function getAdditionalData()
    {
        return [
            // Eventos por mes (últimos 6 meses)
            'eventsPerMonth' => $this->getEventsPerMonth(),
            
            // Usuarios registrados por mes (últimos 6 meses)
            'usersPerMonth' => $this->getUsersPerMonth(),
            
            // Top 5 eventos con más asistencias
            'topEvents' => $this->getTopEvents(),
            
            // Estadísticas de hoy
            'todayStats' => $this->getTodayStats(),
        ];
    }
    
    /**
     * Formatea la acción para mostrar en la actividad reciente
     */
    private function formatAction($action, $objectType)
    {
        $actions = [
            'create' => 'Creación',
            'update' => 'Actualización',
            'delete' => 'Eliminación',
            'view' => 'Visualización',
            'register' => 'Registro',
            'cancel' => 'Cancelación',
        ];
        
        $objects = [
            'App\Models\User' => 'de Usuario',
            'App\Models\Event' => 'de Evento',
            'App\Models\EventAttendance' => 'de Asistencia',
            'App\Models\Admin' => 'de Administrador',
        ];
        
        $actionText = $actions[$action] ?? ucfirst($action);
        $objectText = $objects[$objectType] ?? 'de Elemento';
        
        return $actionText . ' ' . $objectText;
    }
    
    /**
     * Genera detalles automáticos si no existen
     */
    private function generateDetails($activity)
    {
        $details = [
            'create' => 'Nuevo elemento creado en el sistema.',
            'update' => 'Información actualizada correctamente.',
            'delete' => 'Elemento eliminado del sistema.',
            'register' => 'Nuevo registro en el sistema.',
            'cancel' => 'Registro cancelado.',
        ];
        
        return $details[$activity->action] ?? 'Actividad registrada en el sistema.';
    }
    
    /**
     * Obtiene el tag de la acción
     */
    private function getActionTag($action)
    {
        $tags = [
            'create' => 'Creación',
            'register' => 'Registro',
            'update' => 'Actualización',
            'delete' => 'Eliminación',
            'cancel' => 'Cancelación',
            'view' => 'Consulta',
        ];
        
        return $tags[$action] ?? 'Actividad';
    }
    
    /**
     * Obtiene el color del tag según la acción
     */
    private function getActionColor($action)
    {
        $colors = [
            'create' => 'green',
            'register' => 'green',
            'update' => 'blue',
            'delete' => 'red',
            'cancel' => 'red',
            'view' => 'gray',
        ];
        
        return $colors[$action] ?? 'gray';
    }
    
    /**
     * Obtiene eventos por mes (últimos 6 meses)
     */
    private function getEventsPerMonth()
    {
        return Event::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'period' => Carbon::create($item->year, $item->month)->format('M Y'),
                    'count' => $item->count
                ];
            });
    }
    
    /**
     * Obtiene usuarios registrados por mes (últimos 6 meses)
     */
    private function getUsersPerMonth()
    {
        return User::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('COUNT(*) as count')
            )
            ->where('created_at', '>=', Carbon::now()->subMonths(6))
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'period' => Carbon::create($item->year, $item->month)->format('M Y'),
                    'count' => $item->count
                ];
            });
    }
    
    /**
     * Obtiene los 5 eventos con más asistencias
     */
    private function getTopEvents()
    {
        return Event::withCount('eventAttendances')
            ->orderBy('event_attendances_count', 'desc')
            ->take(5)
            ->get()
            ->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->titule,
                    'attendances_count' => $event->event_attendances_count,
                    'start_date' => $event->start_date
                ];
            });
    }
    
    /**
     * Obtiene estadísticas del día actual
     */
    private function getTodayStats()
    {
        $today = Carbon::today();
        
        return [
            'newUsers' => User::whereDate('created_at', $today)->count(),
            'newAttendances' => EventAttendance::whereDate('created_at', $today)->count(),
            'newEvents' => Event::whereDate('created_at', $today)->count(),
            'activities' => ActivityLog::whereDate('created_at', $today)->count(),
        ];
    }
    
    /**
     * API endpoint para obtener solo las estadísticas (para actualizaciones AJAX)
     */
    public function getStats()
    {
        return response()->json([
            'success' => true,
            'data' => $this->getDashboardStats()
        ]);
    }
    
    /**
     * API endpoint para obtener solo la actividad reciente
     */
    public function getActivity()
    {
        return response()->json([
            'success' => true,
            'data' => $this->getRecentActivity()
        ]);
    }
}