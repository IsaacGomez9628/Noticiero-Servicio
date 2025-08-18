<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Home\NoticiaController;
use App\Http\Controllers\Home\QuienesSomosController;
use App\Http\Controllers\EventoAsistenciaController;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\Auth\RegistroController;
use App\Http\Controllers\Auth\VerificationController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\Eventos\EventController as EventosEventController;
use App\Http\Controllers\ProfileController;
use App\Http\Middleware\EnsureEmailIsVerified;
use App\Http\Controllers\Admin\AdminAuthController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\EventController;
use App\Http\Controllers\Admin\OrganizerController;
use App\Http\Controllers\Admin\AdminSettingsController;

// Rutas para vistas principales (renderizan la SPA de React)
Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('welcome');

// Rutas de Home
Route::get('/home/loMasNuevo', [HomeController::class, 'loMasNuevo'])->name('home.loMasNuevo');
Route::get('/home/Quienes-Somos', [QuienesSomosController::class, 'index'])->name('quienes-somos');

// Rutas para eventos
Route::get('/eventos', [EventosEventController::class, 'index'])->name('eventos.index');

// Nuevas rutas con el formato solicitado
Route::get('/evento/{id}/detalles', [EventosEventController::class, 'show'])->name('eventos.show');
Route::get('/evento/{id}/ubicacion', [EventosEventController::class, 'location'])->name('eventos.location');
Route::get('/evento/{id}/registro', [EventosEventController::class, 'showRegistrationForm'])->name('eventos.registro.form');

// Rutas de compatibilidad (para mantener enlaces antiguos)
Route::get('/eventos/{id}', function($id) {
    return redirect()->route('eventos.show', $id);
});
Route::get('/eventos/{id}/registro', function($id) {
    return redirect()->route('eventos.registro.form', $id);
});

// Rutas para registro
Route::middleware('guest')->group(function () {
    // Rutas de registro
    Route::get('/registro', [RegistroController::class, 'index'])
        ->name('registro');
    
    Route::get('/registro/personal', [RegistroController::class, 'createPersonal'])
        ->name('registro.personal');
    
    Route::post('/registro/personal', [RegistroController::class, 'storePersonal'])
        ->name('registro.personal.store');
    
    Route::get('/registro/institucional', [RegistroController::class, 'createInstitucional'])
        ->name('registro.institucional');
    
    Route::post('/registro/institucional', [RegistroController::class, 'storeInstitucional'])
        ->name('registro.institucional.store');
    
    // Rutas de inicio de sesión
    Route::get('/login', [LoginController::class, 'showLoginForm'])
        ->name('login');
    
    Route::post('/login', [LoginController::class, 'login'])
        ->name('login.store');
        
    // Rutas de verificación de correo
    Route::get('/email/verify', [VerificationController::class, 'notice'])
        ->name('verification.notice');
        
    Route::post('/email/verify', [VerificationController::class, 'verify'])
        ->name('verification.verify');
        
    Route::post('/email/resend', [VerificationController::class, 'resend'])
        ->name('verification.resend');
});

// Otras rutas
Route::get('/noticias', [NoticiaController::class, 'index'])->name('noticias');

// Rutas para usuarios autenticados
Route::middleware(['auth', EnsureEmailIsVerified::class])->group(function () {
    // Dashboard y sus funcionalidades
    Route::get('/dashboard', [DashboardController::class, 'index'])
        ->name('dashboard');
    
    // Gestión de eventos
    Route::get('/dashboard/crear-evento', [DashboardController::class, 'createEvent'])
        ->name('dashboard.crear-evento');

    Route::get('/dashboard/panel', [DashboardController::class, 'panel'])
        ->name('dashboard.panel');
    
    // Funcionalidad real de eventos
    Route::post('/eventos', [EventosEventController::class, 'store'])
        ->name('eventos.store');
    
    Route::get('/eventos/{id}/editar', [EventosEventController::class, 'edit'])
        ->name('eventos.edit');
    
    Route::put('/eventos/{id}', [EventosEventController::class, 'update'])
        ->name('eventos.update');
    
    Route::delete('/eventos/{id}', [EventosEventController::class, 'destroy'])
        ->name('eventos.destroy');
    
    // Gestión de noticias
    Route::get('/dashboard/crear-noticia', [DashboardController::class, 'createNews'])
        ->name('dashboard.crear-noticia');
    
    // Funcionalidad real de noticias
    Route::post('/noticias', [NoticiaController::class, 'store'])
        ->name('noticias.store');
    
    Route::get('/noticias/{id}/editar', [NoticiaController::class, 'edit'])
        ->name('noticias.edit');
    
    Route::put('/noticias/{id}', [NoticiaController::class, 'update'])
        ->name('noticias.update');
    
    Route::delete('/noticias/{id}', [NoticiaController::class, 'destroy'])
        ->name('noticias.destroy');
    
    // Rutas para editar perfil
    Route::get('/perfil/editar', [ProfileController::class, 'edit'])
        ->name('perfil.edit');
    
    Route::post('/perfil/actualizar', [ProfileController::class, 'update'])
        ->name('perfil.update');
    
    // Registro de eventos
    Route::get('/evento/{id}/registro', [EventoAsistenciaController::class, 'showRegistrationForm'])
        ->name('eventos.registro.form');
 
    Route::post('/evento/{id}/registro', [EventoAsistenciaController::class, 'register'])
        ->name('eventos.registro');
    
    Route::post('/evento/{id}/registro/institucional', [EventoAsistenciaController::class, 'registrarInstitucional'])
        ->name('eventos.registro.institucional');
    
    Route::get('/evento/{id}/confirmacion', [EventoAsistenciaController::class, 'showConfirmation'])
        ->name('eventos.confirmacion');
    
    Route::get('/mis-asistencias', [EventoAsistenciaController::class, 'misAsistencias'])
        ->name('eventos.mis-asistencias');
    
    Route::post('/asistencia/{id}/cancelar', [EventoAsistenciaController::class, 'cancelarAsistencia'])
        ->name('eventos.asistencia.cancelar');
    
    // Cierre de sesión
    Route::post('/logout', [LoginController::class, 'logout'])
        ->name('logout');
});

// ============================================
// RUTAS DE ADMINISTRACIÓN - TODO EN UN SOLO LUGAR
// ============================================
Route::prefix('admin')->group(function () {
    // ===== RUTAS PÚBLICAS DE ADMIN (sin autenticación) =====
    Route::get('/login', function () {
        return Inertia::render('Admin/AdminLoginCheck');
    })->name('admin.login');
    
    Route::get('/create', function () {
        return Inertia::render('Admin/AdminCreateForm');
    })->name('admin.create');
    
    // API endpoints públicos para administración
    Route::get('/check', [AdminAuthController::class, 'checkAdmin']);
    Route::post('/login', [AdminAuthController::class, 'login']);
    Route::post('/create-first', [AdminAuthController::class, 'createFirstAdmin']);
    Route::post('/create', [AdminAuthController::class, 'createAdmin']);
    
    // ===== RUTAS PROTEGIDAS DE ADMIN (requieren autenticación) =====
    Route::middleware(['auth:sanctum', \App\Http\Middleware\AdminAuth::class])->group(function () {
        // 🔥 Dashboard de admin CON DATOS REALES + MÉTRICAS ADICIONALES
        Route::get('/dashboard', function () {
            // ✅ MANTENER: Estadísticas originales que YA FUNCIONAN
            $dashboardStats = [
                'users' => \App\Models\User::count(),
                'activeEvents' => \App\Models\Event::where('start_date', '>=', now()->toDateString())->count(),
                'attendances' => \App\Models\EventAttendance::count(),
                'activeAdmins' => \App\Models\Admin::count(),
            ];
            
            // ✅ MANTENER: Actividad reciente que YA FUNCIONA
            $recentActivity = [];
            try {
                if (class_exists('\App\Models\ActivityLog')) {
                    $recentActivity = \App\Models\ActivityLog::with('admin')
                        ->orderBy('created_at', 'desc')
                        ->take(10)
                        ->get()
                        ->map(function ($activity) {
                            return [
                                'id' => $activity->id,
                                'action' => $activity->action ?? 'Acción',
                                'user' => $activity->admin ? $activity->admin->name : 'Sistema',
                                'date' => $activity->created_at->format('d/m/Y H:i'),
                                'details' => $activity->details ?? 'Actividad en el sistema',
                                'tag' => ucfirst($activity->action ?? 'Actividad'),
                                'tagColor' => match($activity->action ?? 'default') {
                                    'create', 'register' => 'green',
                                    'update' => 'blue',
                                    'delete' => 'red',
                                    'cancel' => 'red',
                                    'view' => 'gray',
                                    default => 'gray'
                                },
                            ];
                        });
                }
            } catch (\Exception $e) {
                // Si hay error con ActivityLog, continuar sin actividad
                $recentActivity = [];
            }
            
            // 🆕 NUEVO: Métricas adicionales (SIN afectar las anteriores)
            $additionalMetrics = [];
            try {
                $additionalMetrics = [
                    // Usuarios por mes (últimos 6 meses)
                    'usersPerMonth' => \App\Models\User::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
                        ->where('created_at', '>=', now()->subMonths(6))
                        ->groupBy('year', 'month')
                        ->orderBy('year', 'desc')
                        ->orderBy('month', 'desc')
                        ->get()
                        ->map(function ($item) {
                            return [
                                'period' => \Carbon\Carbon::create($item->year, $item->month)->format('M Y'),
                                'count' => $item->count
                            ];
                        }),
                    
                    // Eventos más populares (por asistencias)
                    'topEvents' => \App\Models\Event::withCount('eventAttendances')
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
                        }),
                    
                    // Métricas de crecimiento
                    'growthMetrics' => [
                        'usersThisMonth' => \App\Models\User::whereMonth('created_at', now()->month)
                            ->whereYear('created_at', now()->year)->count(),
                        'usersLastMonth' => \App\Models\User::whereMonth('created_at', now()->subMonth()->month)
                            ->whereYear('created_at', now()->subMonth()->year)->count(),
                        'eventsThisMonth' => \App\Models\Event::whereMonth('created_at', now()->month)
                            ->whereYear('created_at', now()->year)->count(),
                        'eventsLastMonth' => \App\Models\Event::whereMonth('created_at', now()->subMonth()->month)
                            ->whereYear('created_at', now()->subMonth()->year)->count(),
                    ],
                    
                    // Estadísticas por categorías de eventos
                    'eventStats' => [
                        'upcoming' => \App\Models\Event::where('start_date', '>', now())->count(),
                        'ongoing' => \App\Models\Event::where('start_date', '<=', now())
                            ->where('end_date', '>=', now())->count(),
                        'completed' => \App\Models\Event::where('end_date', '<', now())->count(),
                    ],
                ];
            } catch (\Exception $e) {
                // Si hay error con métricas adicionales, continuar sin ellas
                $additionalMetrics = [];
            }
            
            // ✅ MANTENER: Datos adicionales originales + AGREGAR nuevas métricas
            $additionalData = [
                'todayStats' => [
                    'newUsers' => \App\Models\User::whereDate('created_at', today())->count(),
                    'newEvents' => \App\Models\Event::whereDate('created_at', today())->count(),
                    'newAttendances' => \App\Models\EventAttendance::whereDate('created_at', today())->count(),
                    'activities' => class_exists('\App\Models\ActivityLog') ? \App\Models\ActivityLog::whereDate('created_at', today())->count() : 0,
                ],
                // 🆕 NUEVO: Agregar métricas adicionales
                'additionalMetrics' => $additionalMetrics,
            ];
            
            return Inertia::render('Admin/AdminDashboard', [
                'dashboardStats' => $dashboardStats,
                'recentActivity' => $recentActivity,
                'additionalData' => $additionalData
            ]);
        })->name('admin.dashboard');
        
        // ===== VISTAS INERTIA (renderizan páginas) =====
        // Vistas de usuarios
        Route::get('/users', [UserController::class, 'index'])
            ->name('admin.users');
        
        Route::get('/users/create', [UserController::class, 'create'])
            ->name('admin.users.create');
        
        Route::get('/users/{id}/edit', [UserController::class, 'edit'])
            ->name('admin.users.edit');
        
        Route::get('/users/{id}', [UserController::class, 'show'])
            ->name('admin.users.show');
        
        // Vistas de eventos
        Route::get('/events', [EventController::class, 'index'])
            ->name('admin.events');
        
        Route::get('/events/create', [EventController::class, 'create'])
            ->name('admin.events.create');
        
        Route::get('/events/{id}/edit', [EventController::class, 'edit'])
            ->name('admin.events.edit');
        
        Route::get('/events/{id}', [EventController::class, 'show'])
            ->name('admin.events.show');

        // Vistas de organizadores
        Route::get('/organizers', [OrganizerController::class, 'index'])
            ->name('admin.organizers');

        Route::get('/organizers/create', [OrganizerController::class, 'create'])
            ->name('admin.organizers.create');

        Route::get('/organizers/{id}/edit', [OrganizerController::class, 'edit'])
            ->name('admin.organizers.edit');

        Route::get('/organizers/{id}', [OrganizerController::class, 'show'])
            ->name('admin.organizers.show');

        

        
        // ✅ NUEVAS: Rutas para gestión de asistencias desde admin
        Route::get('/events/{id}/attendances', [EventController::class, 'showAttendances'])
            ->name('admin.events.attendances');
        
        Route::patch('/events/{eventId}/attendances/{attendanceId}/status', [EventController::class, 'updateAttendanceStatus'])
            ->name('admin.events.attendance.update-status');
        
        Route::get('/events/{id}/attendances/export', [EventController::class, 'exportAttendances'])
            ->name('admin.events.attendances.export');
            
        // Vista de roles
        Route::get('/roles', function () {
            return Inertia::render('Admin/Roles/Index');
        })->name('admin.roles');
        
        // Vista de configuración
        Route::get('/settings', [AdminSettingsController::class, 'index'])
            ->name('admin.settings');
        
        // ===== API ENDPOINTS (devuelven JSON) =====
        Route::prefix('api')->group(function () {
            // ✅ MANTENER: API endpoints existentes que YA FUNCIONAN
            Route::get('/dashboard/stats', function () {
                $stats = [
                    'users' => \App\Models\User::count(),
                    'activeEvents' => \App\Models\Event::where('start_date', '>=', now()->toDateString())->count(),
                    'attendances' => \App\Models\EventAttendance::count(),
                    'activeAdmins' => \App\Models\Admin::count(),
                ];
                
                return response()->json(['success' => true, 'data' => $stats]);
            })->name('admin.api.dashboard.stats');
            
            Route::get('/dashboard/activity', function () {
                $activity = [];
                try {
                    if (class_exists('\App\Models\ActivityLog')) {
                        $activity = \App\Models\ActivityLog::with('admin')
                            ->orderBy('created_at', 'desc')
                            ->take(10)
                            ->get()
                            ->map(function ($log) {
                                return [
                                    'id' => $log->id,
                                    'action' => $log->action ?? 'Acción',
                                    'user' => $log->admin ? $log->admin->name : 'Sistema',
                                    'date' => $log->created_at->format('d/m/Y H:i'),
                                    'details' => $log->details ?? 'Actividad en el sistema',
                                    'tag' => ucfirst($log->action ?? 'Actividad'),
                                    'tagColor' => match($log->action ?? 'default') {
                                        'create', 'register' => 'green',
                                        'update' => 'blue',
                                        'delete' => 'red',
                                        'cancel' => 'red',
                                        'view' => 'gray',
                                        default => 'gray'
                                    },
                                ];
                            });
                    }
                } catch (\Exception $e) {
                    $activity = [];
                }
                
                return response()->json(['success' => true, 'data' => $activity]);
            })->name('admin.api.dashboard.activity');

            // 🆕 NUEVO: API endpoints para métricas adicionales
            Route::get('/dashboard/metrics', function () {
                try {
                    $metrics = [
                        // Usuarios por mes
                        'usersPerMonth' => \App\Models\User::selectRaw('YEAR(created_at) as year, MONTH(created_at) as month, COUNT(*) as count')
                            ->where('created_at', '>=', now()->subMonths(6))
                            ->groupBy('year', 'month')
                            ->orderBy('year', 'desc')
                            ->orderBy('month', 'desc')
                            ->get()
                            ->map(function ($item) {
                                return [
                                    'period' => \Carbon\Carbon::create($item->year, $item->month)->format('M Y'),
                                    'count' => $item->count
                                ];
                            }),
                        
                        // Eventos más populares
                        'topEvents' => \App\Models\Event::withCount('eventAttendances')
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
                            }),
                        
                        // Métricas de crecimiento
                        'growthMetrics' => [
                            'usersThisMonth' => \App\Models\User::whereMonth('created_at', now()->month)
                                ->whereYear('created_at', now()->year)->count(),
                            'usersLastMonth' => \App\Models\User::whereMonth('created_at', now()->subMonth()->month)
                                ->whereYear('created_at', now()->subMonth()->year)->count(),
                            'eventsThisMonth' => \App\Models\Event::whereMonth('created_at', now()->month)
                                ->whereYear('created_at', now()->year)->count(),
                            'eventsLastMonth' => \App\Models\Event::whereMonth('created_at', now()->subMonth()->month)
                                ->whereYear('created_at', now()->subMonth()->year)->count(),
                        ],
                    ];
                    
                    return response()->json(['success' => true, 'data' => $metrics]);
                } catch (\Exception $e) {
                    return response()->json(['success' => false, 'error' => 'Error al obtener métricas']);
                }
            })->name('admin.api.dashboard.metrics');

            // 🆕 NUEVO: Endpoint para exportar datos
            Route::get('/dashboard/export', function () {
                try {
                    $exportData = [
                        'fecha_reporte' => now()->format('Y-m-d H:i:s'),
                        'estadisticas_generales' => [
                            'usuarios' => \App\Models\User::count(),
                            'eventos_activos' => \App\Models\Event::where('start_date', '>=', now()->toDateString())->count(),
                            'asistencias' => \App\Models\EventAttendance::count(),
                            'administradores' => \App\Models\Admin::count(),
                        ],
                        'metricas_crecimiento' => [
                            'usuarios_mes_actual' => \App\Models\User::whereMonth('created_at', now()->month)
                                ->whereYear('created_at', now()->year)->count(),
                            'eventos_mes_actual' => \App\Models\Event::whereMonth('created_at', now()->month)
                                ->whereYear('created_at', now()->year)->count(),
                        ],
                        'eventos_populares' => \App\Models\Event::withCount('eventAttendances')
                            ->orderBy('event_attendances_count', 'desc')
                            ->take(10)
                            ->get()
                            ->map(function ($event) {
                                return [
                                    'titulo' => $event->titule,
                                    'asistencias' => $event->event_attendances_count,
                                    'fecha_inicio' => $event->start_date
                                ];
                            }),
                        'actividad_reciente' => class_exists('\App\Models\ActivityLog') 
                            ? \App\Models\ActivityLog::with('admin')
                                ->orderBy('created_at', 'desc')
                                ->take(20)
                                ->get()
                                ->map(function ($log) {
                                    return [
                                        'accion' => $log->action,
                                        'usuario' => $log->admin ? $log->admin->name : 'Sistema',
                                        'fecha' => $log->created_at->format('Y-m-d H:i:s'),
                                        'detalles' => $log->details
                                    ];
                                })
                            : []
                    ];
                    
                    return response()->json($exportData)
                        ->header('Content-Disposition', 'attachment; filename="dashboard-report-' . now()->format('Y-m-d') . '.json"');
                        
                } catch (\Exception $e) {
                    return response()->json(['success' => false, 'error' => 'Error al exportar datos']);
                }
            })->name('admin.api.dashboard.export');
            
            // Endpoints de usuarios
            Route::get('/users', [UserController::class, 'apiIndex'])
                ->name('admin.api.users');
            
            Route::get('/users/{id}', [UserController::class, 'apiShow'])
                ->name('admin.api.users.show');
            
            Route::post('/users', [UserController::class, 'store'])
                ->name('admin.api.users.store');
            
            Route::put('/users/{id}', [UserController::class, 'update'])
                ->name('admin.api.users.update');
            
            Route::delete('/users/{id}', [UserController::class, 'destroy'])
                ->name('admin.api.users.destroy');
            
            Route::patch('/users/{id}/toggle-status', [UserController::class, 'toggleStatus'])
                ->name('admin.api.users.toggle-status');
            
            Route::post('/users/{id}/reset-password', [UserController::class, 'resetPassword'])
                ->name('admin.api.users.reset-password');
            
            Route::get('/users/export', [UserController::class, 'export'])
                ->name('admin.api.users.export');
            
            Route::get('/stats/users', [UserController::class, 'getUserStats'])
                ->name('admin.api.users.stats');
            
            // Endpoints de eventos
            Route::get('/events', [EventController::class, 'apiIndex'])
                ->name('admin.api.events');
            
            Route::get('/events/{id}', [EventController::class, 'apiShow'])
                ->name('admin.api.events.show');
            
            Route::post('/events', [EventController::class, 'store'])
                ->name('admin.api.events.store');
            
            Route::put('/events/{id}', [EventController::class, 'update'])
                ->name('admin.api.events.update');
            
            Route::delete('/events/{id}', [EventController::class, 'destroy'])
                ->name('admin.api.events.destroy');
            
            Route::patch('/events/{id}/toggle-status', [EventController::class, 'toggleStatus'])
                ->name('admin.api.events.toggle-status');
            
            Route::get('/stats/events', [EventController::class, 'getEventStats'])
                ->name('admin.api.events.stats');

            // Endpoints de organizadores
            Route::get('/organizers', [OrganizerController::class, 'apiIndex'])
                ->name('admin.api.organizers');

            Route::get('/organizers/{id}', [OrganizerController::class, 'apiShow'])
                ->name('admin.api.organizers.show');

            Route::post('/organizers', [OrganizerController::class, 'store'])
                ->name('admin.api.organizers.store');

            Route::put('/organizers/{id}', [OrganizerController::class, 'update'])
                ->name('admin.api.organizers.update');

            Route::delete('/organizers/{id}', [OrganizerController::class, 'destroy'])
                ->name('admin.api.organizers.destroy');

            Route::patch('/organizers/{id}/toggle-status', [OrganizerController::class, 'toggleStatus'])
                ->name('admin.api.organizers.toggle-status');

            Route::get('/stats/organizers', [OrganizerController::class, 'getOrganizerStats'])
                ->name('admin.api.organizers.stats');
            
            // Endpoints de configuración
            Route::get('/settings/info', [AdminSettingsController::class, 'getAdminInfo'])
                ->name('admin.api.settings.info');
            
            Route::put('/settings/profile', [AdminSettingsController::class, 'updateProfile'])
                ->name('admin.api.settings.profile');
            
            Route::put('/settings/password', [AdminSettingsController::class, 'updatePassword'])
                ->name('admin.api.settings.password');
        });
        
        // Otros endpoints protegidos
        Route::post('/logout', [AdminAuthController::class, 'logout'])
            ->name('admin.logout');
        
        Route::get('/me', [AdminAuthController::class, 'getCurrentAdmin'])
            ->name('admin.me');
        
        // Gestión de eventos y asistencias (rutas existentes mantenidas)
        Route::get('/eventos/{id}/asistentes', [EventoAsistenciaController::class, 'listarAsistentes'])
            ->name('admin.eventos.asistentes');
        
        Route::patch('/eventos/{id}/asistentes/{asistenciaId}', [EventoAsistenciaController::class, 'actualizarAsistencia'])
            ->name('admin.eventos.asistencia.actualizar');
    });
});

// ===== RUTA CATCH-ALL =====
// Ruta catch-all - debe estar al final
Route::get('/{any}', [HomeController::class, 'index'])->where('any', '.*');