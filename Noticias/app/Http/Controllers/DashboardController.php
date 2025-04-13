<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\EventAttendance;
use App\Models\Event;
use App\Models\Company;
use App\Models\User;
use Inertia\Inertia;

class DashboardController extends BaseController
{
    /**
     * Muestra el dashboard principal del usuario.
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        if (!Auth::check()) {
            // Redirigir al login si no hay usuario autenticado
            return redirect()->route('login');
        }
        
        $user = User::find(Auth::id());
        
        // Obtener las asistencias del usuario
        $eventAttendances = EventAttendance::where('user_id', $user->id)
            ->with(['event', 'event.location', 'status'])
            ->orderBy('created_at', 'desc')
            ->take(5)  // Limitamos a los 5 más recientes
            ->get();
        
        // Si es usuario institucional, obtener también las asistencias de su empresa
        $companyAttendances = collect();
        
        // Verificar si el usuario es institucional
        $isInstitutional = false;
        if (method_exists($user, 'isInstitutional')) {
            $isInstitutional = $user->isInstitutional();
        } else {
            $userRoles = $user->roles()->pluck('id')->toArray();
            $isInstitutional = in_array(6, $userRoles);
        }
        
        if ($isInstitutional) {
            // Obtener IDs de empresas del usuario
            $empresasIds = [];
            if (method_exists($user, 'companies')) {
                $empresasIds = $user->companies()->pluck('id');
            } else {
                $empresasIds = Company::where('user_id', $user->id)->pluck('id');
            }
            
            if (count($empresasIds) > 0) {
                $companyAttendances = EventAttendance::whereIn('company_id', $empresasIds)
                ->whereNot('user_id', $user->id)
                ->with(['event', 'event.location', 'status'])
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();
            }
        }
        
        // Contar próximos eventos
        $upcomingEventsCount = Event::whereDate('start_date', '>=', now())
            ->count();

        
        
        return Inertia::render('Dashboard', [
            'eventAttendances' => $eventAttendances,
            'companyAttendances' => $companyAttendances,
            'upcomingEventsCount' => $upcomingEventsCount,
            'user' => $user,
        ]);
    }

    /**
     * Muestra la página para crear eventos (solo visual por ahora).
     *
     * @return \Inertia\Response
     */
    public function createEvent()
    {
        return Inertia::render('Dashboard/CreateEvent');
    }

    /**
     * Muestra la página para crear noticias (solo visual por ahora).
     *
     * @return \Inertia\Response
     */
    public function createNews()
    {
        return Inertia::render('Dashboard/CreateNews');
    }

    /**
     * Muestra el panel de control con estadísticas.
     * 
     * @return \Inertia\Response
     */
    public function panel()
    {
        
        if (!Auth::check()) {
            // Redirigir al login si no hay usuario autenticado
            return redirect()->route('login');
        }

        // Obtener el nombre del usuario
        $user = Auth::user();
        $userName = $user->person ? $user->person->getFullNameAttribute() : $user->email;
        
        // Obtener las asistencias del usuario
        $eventAttendances = EventAttendance::where('user_id', $user->id)
            ->with(['event', 'event.location', 'status'])
            ->orderBy('created_at', 'desc')
            ->get();
        
        // Estadísticas para el panel de control
        $stats = [
            'total_registros' => $eventAttendances->count(),
            'registros_confirmados' => $eventAttendances->filter(function($attendance) {
                return $attendance->status && $attendance->status->slug === 'confirmado';
            })->count(),
            'registros_pendientes' => $eventAttendances->filter(function($attendance) {
                return $attendance->status && $attendance->status->slug !== 'confirmado' && $attendance->status->slug !== 'cancelado';
            })->count(),
            'registros_cancelados' => $eventAttendances->filter(function($attendance) {
                return $attendance->status && $attendance->status->slug === 'cancelado';
            })->count(),
        ];
        
        $isInstitutional = false;
        if (method_exists($user, 'isInstitutional')) {
            $isInstitutional = $user->isInstitutional();
        } else {
            $userRoles = $user->roles()->pluck('id')->toArray();
            $isInstitutional = in_array(6, $userRoles);
        }

        // Obtener empresas del usuario
        $empresasIds = [];
        if (method_exists($user, 'companies')) {
            $empresasIds = $user->companies()->pluck('id');
        } else {
            $empresasIds = Company::where('user_id', $user->id)->pluck('id');
        }
        
        // Si es usuario institucional, agregar estadísticas de registros institucionales
        if ($isInstitutional) {
            // Obtener IDs de empresas del usuario
            $empresasIds = [];
            if (method_exists($user, 'companies')) {
                $empresasIds = $user->companies()->pluck('id');
            } else {
                $empresasIds = Company::where('user_id', $user->id)->pluck('id');
            }
            
            if (count($empresasIds) > 0) {
                $companyAttendances = EventAttendance::whereIn('institution_id', $empresasIds)
                    ->whereNot('user_id', $user->id)  // Excluir al usuario para evitar duplicados
                    ->with(['event', 'event.location', 'status'])
                    ->get();
                
                $stats['total_registros_institucionales'] = $companyAttendances->count();
                $stats['institucional_confirmados'] = $companyAttendances->filter(function($attendance) {
                    return $attendance->status && $attendance->status->slug === 'confirmado';
                })->count();
            }
        }
    
        return Inertia::render('Dashboard/PanelControl', [
            'eventAttendances' => $eventAttendances,
            'stats' => $stats,
            'user' => $user,
            'userName' => $userName,
        ]);
    }
}