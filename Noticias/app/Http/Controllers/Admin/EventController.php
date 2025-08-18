<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\Location;
use App\Models\EventStatus;
use App\Models\Admin;
use App\Models\EventAttendance; // ✅ AGREGADO
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

class EventController extends Controller
{
    /**
     * Display the events list page (Inertia view)
     */
    public function index(Request $request)
    {
        return Inertia::render('Admin/Events/Index', [
            'events' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'from' => null,
                'to' => null
            ],
            'filters' => $request->all(),
            'statuses' => EventStatus::all(),
            'locations' => Location::all()
        ]);
    }

    /**
     * API endpoint for getting events list with filters and pagination
     */
    public function apiIndex(Request $request)
    {
        \Log::info('EventController apiIndex llamado', [
            'all_params' => $request->all()
        ]);
        
        // ✅ CORREGIDO: Agregada la relación 'attendances'
        $query = Event::with(['location', 'status', 'organizer', 'admin', 'attendances']);
        
        // Búsqueda por título o descripción
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('titule', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%")
                  ->orWhere('slug', 'like', "%{$search}%");
            });
        }
        
        // Filtro por estado
        if ($request->filled('status_id')) {
            $query->where('event_statuses_id', $request->status_id);
        }
        
        // Filtro por ubicación
        if ($request->filled('location_id')) {
            $query->where('location_id', $request->location_id);
        }
        
        // Filtro por precio (gratis o de pago)
        if ($request->has('its_free') && $request->its_free !== '') {
            $query->where('its_free', $request->its_free == '1');
        }
        
        // Filtro por rango de fechas
        if ($request->filled('date_from')) {
            $query->where('start_date', '>=', $request->date_from);
        }
        
        if ($request->filled('date_to')) {
            $query->where('end_date', '<=', $request->date_to);
        }
        
        // Ordenamiento
        $sortField = $request->sort_by ?? 'created_at';
        $sortOrder = $request->sort_order ?? 'desc';
        $query->orderBy($sortField, $sortOrder);
        
        // Paginación
        $eventsPaginated = $query->paginate($request->per_page ?? 10);
        
        // Transformar los datos
        $transformedData = [];
        foreach ($eventsPaginated->items() as $event) {
            $transformedData[] = [
                'id' => $event->id,
                'titule' => $event->titule,
                'description' => Str::limit($event->description, 100),
                'start_date' => Carbon::parse($event->start_date)->format('d/m/Y'),
                'end_date' => Carbon::parse($event->end_date)->format('d/m/Y'),
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'price' => $event->price,
                'its_free' => $event->its_free,
                'capacity' => $event->capacity,
                'location' => $event->location ? $event->location->name : 'Sin ubicación',
                'status' => [
                    'id' => $event->status ? $event->status->id : null,
                    'name' => $event->status ? $event->status->name : 'Sin estado',
                    'color' => $this->getStatusColor($event->event_statuses_id)
                ],
                'organizer' => $event->organizer ? $event->organizer->name : 'Sin organizador',
                'admin' => $event->admin ? $event->admin->name : 'Sin admin',
                'slug' => $event->slug,
                'created_at' => Carbon::parse($event->created_at)->format('d/m/Y H:i'),
                // ✅ CORREGIDO: Uso de la relación 'attendances'
                'attendees_count' => $event->attendances ? $event->attendances->count() : 0
            ];
        }
        
        $events = [
            'data' => $transformedData,
            'current_page' => $eventsPaginated->currentPage(),
            'last_page' => $eventsPaginated->lastPage(),
            'per_page' => $eventsPaginated->perPage(),
            'total' => $eventsPaginated->total(),
            'from' => $eventsPaginated->firstItem(),
            'to' => $eventsPaginated->lastItem()
        ];
        
        return response()->json([
            'events' => $events,
            'filters' => [
                'search' => $request->search,
                'status_id' => $request->status_id,
                'location_id' => $request->location_id,
                'its_free' => $request->its_free,
                'date_from' => $request->date_from,
                'date_to' => $request->date_to
            ],
            'statuses' => EventStatus::all(),
            'locations' => Location::all()
        ]);
    }
    
    /**
     * Show the form for creating a new event
     */
    public function create()
    {
        $locations = Location::all();
        $statuses = EventStatus::all();
        $organizers = \App\Models\Organizer::all();  // O puedes usar User si los organizadores son usuarios
        
        return Inertia::render('Admin/Events/Create', [
            'locations' => $locations,
            'statuses' => $statuses,
            'organizers' => $organizers
        ]);
    }
    
    /**
     * Store a newly created event in storage (API endpoint)
     */
    public function store(Request $request)
    {
        \Log::info('=====================================');
        \Log::info('Store event method called');
        \Log::info('Request data:', $request->all());
        \Log::info('=====================================');
        
        $rules = [
            'titule' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required',
            'end_time' => 'required',
            'price' => 'required_if:its_free,false|numeric|min:0',
            'its_free' => 'required|boolean',
            'capacity' => 'required|integer|min:1',
            'location_id' => 'required|exists:locations,id',
            'event_statuses_id' => 'required|exists:event_statuses,id',
            'organizer_id' => 'nullable|exists:organizers,id'
        ];
        
        $validated = $request->validate($rules);
        
        try {
            DB::beginTransaction();
            
            // Generar slug único
            $slug = Str::slug($validated['titule']);
            $originalSlug = $slug;
            $count = 1;
            
            while (Event::where('slug', $slug)->exists()) {
                $slug = $originalSlug . '-' . $count;
                $count++;
            }
            
            // Obtener el admin actual
            $adminId = auth()->guard('admin')->id() ?? $request->user()->id;
            
            // Crear evento
            $eventData = [
                'titule' => $validated['titule'],
                'description' => $validated['description'],
                'start_date' => $validated['start_date'],
                'end_date' => $validated['end_date'],
                'start_time' => $validated['start_time'],
                'end_time' => $validated['end_time'],
                'price' => $validated['its_free'] ? 0 : $validated['price'],
                'its_free' => $validated['its_free'],
                'capacity' => $validated['capacity'],
                'location_id' => $validated['location_id'],
                'event_statuses_id' => $validated['event_statuses_id'],
                'organizer_id' => $validated['organizer_id'] ?? $adminId,
                'admin_id' => $adminId,
                'slug' => $slug
            ];
            
            $event = Event::create($eventData);
            
            \Log::info('Event created with ID: ' . $event->id);
            
            DB::commit();
            
            // Cargar relaciones
            $event->load(['location', 'status', 'organizer', 'admin']);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Evento creado exitosamente',
                'event' => $event
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error creating event: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear el evento: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * ✅ ACTUALIZADO: Display the specified event (Vista Inertia)
     */
    public function show($id)
    {
        $event = Event::with(['location', 'status', 'organizer', 'admin', 'attendances.status'])
                      ->findOrFail($id);
        
        $eventData = $this->transformEventData($event);
        
        return Inertia::render('Admin/Events/Show', [
            'event' => $eventData
        ]);
    }

    /**
     * ✅ ACTUALIZADO: API endpoint for getting event data
     */
    public function apiShow($id)
    {
        $event = Event::with(['location', 'status', 'organizer', 'admin', 'attendances.status'])
                      ->findOrFail($id);
        
        $eventData = $this->transformEventData($event);
        
        return response()->json($eventData);
    }

    /**
     * ✅ ACTUALIZADO: Transform event data for responses
     */
    private function transformEventData($event)
    {
        // Cargar attendances si no están cargadas
        if (!$event->relationLoaded('attendances')) {
            $event->load('attendances.status');
        }
        
        return [
            'id' => $event->id,
            'titule' => $event->titule,
            'description' => $event->description,
            'start_date' => $event->start_date,
            'end_date' => $event->end_date,
            'start_time' => $event->start_time,
            'end_time' => $event->end_time,
            'price' => $event->price,
            'its_free' => $event->its_free,
            'capacity' => $event->capacity,
            'location' => $event->location,
            'status' => $event->status,
            'organizer' => $event->organizer,
            'admin' => $event->admin,
            'slug' => $event->slug,
            'created_at' => Carbon::parse($event->created_at)->format('d/m/Y H:i'),
            'updated_at' => Carbon::parse($event->updated_at)->format('d/m/Y H:i'),
            'attendees_count' => $event->attendances ? $event->attendances->count() : 0,
            'available_capacity' => $event->capacity - ($event->attendances ? $event->attendances->count() : 0),
            // ✅ NUEVO: Estadísticas de asistencias
            'attendance_stats' => [
                'total' => $event->attendances ? $event->attendances->count() : 0,
                'confirmed' => $event->attendances ? $event->attendances->filter(fn($a) => $a->status && $a->status->slug === 'confirmado')->count() : 0,
                'pending' => $event->attendances ? $event->attendances->filter(fn($a) => $a->status && $a->status->slug === 'pendiente')->count() : 0,
                'cancelled' => $event->attendances ? $event->attendances->filter(fn($a) => $a->status && $a->status->slug === 'cancelado')->count() : 0,
            ]
        ];
    }
    
    /**
     * Show the form for editing the specified event
     */
    public function edit($id)
    {
        $event = Event::with(['location', 'status', 'organizer', 'admin'])->findOrFail($id);
        $locations = Location::all();
        $statuses = EventStatus::all();
        $organizers = \App\Models\Organizer::all(); 
        
        return Inertia::render('Admin/Events/Edit', [
            'event' => $event,
            'locations' => $locations,
            'statuses' => $statuses,
            'organizers' => $organizers
        ]);
    }
    
    /**
     * Update the specified event in storage (API endpoint)
     */
    public function update(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        
        $validated = $request->validate([
            'titule' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'start_time' => 'required',
            'end_time' => 'required',
            'price' => 'required_if:its_free,false|numeric|min:0',
            'its_free' => 'required|boolean',
            'capacity' => 'required|integer|min:1',
            'location_id' => 'required|exists:locations,id',
            'event_statuses_id' => 'required|exists:event_statuses,id',
            'organizer_id' => 'nullable|exists:organizers,id'
        ]);
        
        try {
            DB::beginTransaction();
            
            // Actualizar slug si cambió el título
            if ($event->titule !== $validated['titule']) {
                $slug = Str::slug($validated['titule']);
                $originalSlug = $slug;
                $count = 1;
                
                while (Event::where('slug', $slug)->where('id', '!=', $id)->exists()) {
                    $slug = $originalSlug . '-' . $count;
                    $count++;
                }
                $validated['slug'] = $slug;
            }
            
            // Si es gratis, asegurar que el precio sea 0
            if ($validated['its_free']) {
                $validated['price'] = 0;
            }
            
            // Actualizar evento
            $event->update($validated);
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Evento actualizado exitosamente',
                'event' => $event->fresh(['location', 'status', 'organizer', 'admin'])
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar el evento',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Toggle event status (API endpoint)
     */
    public function toggleStatus($id)
    {
        try {
            $event = Event::findOrFail($id);
            
            // Alternar entre estados activo (1) e inactivo (2)
            // Ajusta estos IDs según tu tabla event_statuses
            if ($event->event_statuses_id == 1) {
                $event->event_statuses_id = 2; // Cambiar a inactivo
            } else {
                $event->event_statuses_id = 1; // Cambiar a activo
            }
            
            $event->save();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Estado del evento actualizado',
                'event_status' => $event->event_statuses_id
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al cambiar el estado del evento',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove the specified event from storage (API endpoint)
     */
    public function destroy($id)
    {
        try {
            $event = Event::findOrFail($id);
            
            // Verificar si hay asistencias registradas
            if ($event->attendances && $event->attendances->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se puede eliminar un evento con asistencias registradas. Tiene ' . $event->attendances->count() . ' asistentes.'
                ], 400);
            }
            
            DB::beginTransaction();
            
            // CAMBIAR ESTA LÍNEA:
            // $event->delete(); // Esto hace soft delete
            
            // POR ESTA:
            $event->forceDelete(); // Esto elimina permanentemente
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Evento eliminado permanentemente'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            \Log::error('Error al eliminar evento: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar el evento',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Get event statistics (API endpoint)
     */
    public function getEventStats()
    {
        try {
            $stats = [
                'total_events' => Event::count(),
                'active_events' => Event::where('event_statuses_id', 1)->count(),
                'upcoming_events' => Event::where('start_date', '>=', now())->count(),
                'past_events' => Event::where('end_date', '<', now())->count(),
                'free_events' => Event::where('its_free', true)->count(),
                'paid_events' => Event::where('its_free', false)->count(),
                'total_capacity' => Event::sum('capacity'),
                'events_this_month' => Event::whereMonth('start_date', now()->month)
                                           ->whereYear('start_date', now()->year)
                                           ->count()
            ];
            
            return response()->json($stats);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * ✅ NUEVO: Mostrar asistencias de un evento específico
     */
    public function showAttendances($id)
    {
        $event = Event::with([
            'attendances' => function($query) {
                $query->with(['user', 'status', 'company'])
                      ->orderBy('created_at', 'desc');
            },
            'location',
            'status',
            'organizer'
        ])->findOrFail($id);
        
        // Estadísticas de asistencias
        $attendanceStats = [
            'total' => $event->attendances->count(),
            'confirmed' => $event->attendances->filter(fn($a) => $a->status && $a->status->slug === 'confirmado')->count(),
            'pending' => $event->attendances->filter(fn($a) => $a->status && $a->status->slug === 'pendiente')->count(),
            'cancelled' => $event->attendances->filter(fn($a) => $a->status && $a->status->slug === 'cancelado')->count(),
        ];
        
        return Inertia::render('Admin/Events/Attendances', [
            'event' => $event,
            'attendances' => $event->attendances,
            'stats' => $attendanceStats
        ]);
    }
    
    /**
     * ✅ NUEVO: Actualizar estado de una asistencia
     */
    public function updateAttendanceStatus(Request $request, $eventId, $attendanceId)
    {
        $request->validate([
            'status_id' => 'required|exists:statuses,id'
        ]);
        
        try {
            $event = Event::findOrFail($eventId);
            $attendance = $event->attendances()->findOrFail($attendanceId);
            
            $attendance->update([
                'status_id' => $request->status_id
            ]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Estado de asistencia actualizado correctamente'
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar el estado de la asistencia',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * ✅ NUEVO: Exportar lista de asistentes
     */
    public function exportAttendances($id)
    {
        try {
            $event = Event::with(['attendances.user', 'attendances.status', 'attendances.company'])
                         ->findOrFail($id);
            
            $attendancesData = $event->attendances->map(function($attendance) {
                return [
                    'nombre' => $attendance->nombre ?: ($attendance->user ? $attendance->user->name : 'N/A'),
                    'email' => $attendance->email,
                    'telefono' => $attendance->telefono ?: 'N/A',
                    'tipo_registro' => $attendance->tipo_registro,
                    'estado' => $attendance->status ? $attendance->status->name : 'Sin estado',
                    'empresa' => $attendance->company ? $attendance->company->name : 'N/A',
                    'fecha_registro' => $attendance->created_at->format('d/m/Y H:i'),
                    'codigo_registro' => $attendance->codigo_registro
                ];
            });
            
            $exportData = [
                'evento' => [
                    'titulo' => $event->titule,
                    'fecha' => $event->start_date,
                    'total_asistentes' => $attendancesData->count()
                ],
                'fecha_exportacion' => now()->format('d/m/Y H:i'),
                'asistentes' => $attendancesData
            ];
            
            return response()->json($exportData)
                ->header('Content-Disposition', 'attachment; filename="asistentes-' . \Str::slug($event->titule) . '-' . now()->format('Y-m-d') . '.json"');
                
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error', 
                'message' => 'Error al exportar asistentes',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Helper function to get status color
     */
    private function getStatusColor($statusId)
    {
        $colors = [
            1 => 'green',  // Activo
            2 => 'red',    // Inactivo
            3 => 'yellow', // Pendiente
            4 => 'blue',   // En progreso
            5 => 'gray'    // Finalizado
        ];
        
        return $colors[$statusId] ?? 'gray';
    }
}