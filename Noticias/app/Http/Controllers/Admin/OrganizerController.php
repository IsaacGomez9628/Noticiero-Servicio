<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Organizer;
use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class OrganizerController extends Controller
{
    /**
     * Display the organizers list page (Inertia view)
     */
    public function index(Request $request)
    {
        return Inertia::render('Admin/Organizers/Index', [
            'organizers' => [
                'data' => [],
                'current_page' => 1,
                'last_page' => 1,
                'per_page' => 10,
                'total' => 0,
                'from' => null,
                'to' => null
            ],
            'filters' => $request->all()
        ]);
    }

    /**
     * API endpoint for getting organizers list with filters and pagination
     */
    public function apiIndex(Request $request)
    {
        $query = Organizer::query();
        
        // Búsqueda por nombre o email (solo si se proporciona)
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                ->orWhere('email', 'like', "%{$search}%")
                ->orWhere('city', 'like', "%{$search}%");
            });
        }
        
        // Filtro por estado activo (solo si se proporciona específicamente)
        if ($request->has('active') && $request->active !== '' && $request->active !== null) {
            $query->where('active', $request->active == '1');
        }
        
        // Filtro por ciudad (solo si se proporciona)
        if ($request->filled('city')) {
            $query->where('city', $request->city);
        }
        
        // Ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        // Paginación con relación de conteo
        $perPage = $request->get('per_page', 10);
        $organizers = $query->withCount('events')->paginate($perPage);
        
        // Log para debugging
        \Log::info('Organizadores encontrados:', [
            'total' => $organizers->total(),
            'current_page' => $organizers->currentPage(),
            'data_count' => count($organizers->items())
        ]);
        
        // Transformar los datos
        $transformedData = [];
        foreach ($organizers->items() as $organizer) {
            $transformedData[] = [
                'id' => $organizer->id,
                'name' => $organizer->name,
                'email' => $organizer->email,
                'phone' => $organizer->phone,
                'city' => $organizer->city,
                'web_site' => $organizer->web_site,
                'active' => $organizer->active,
                'events_count' => $organizer->events_count ?? 0,
                'created_at' => $organizer->created_at,
                'logo' => $organizer->logo
            ];
        }
        
        // Crear respuesta con estructura de paginación
        $response = [
            'data' => $transformedData,
            'current_page' => $organizers->currentPage(),
            'last_page' => $organizers->lastPage(),
            'per_page' => $organizers->perPage(),
            'total' => $organizers->total(),
            'from' => $organizers->firstItem(),
            'to' => $organizers->lastItem()
        ];
        
        return response()->json([
            'organizers' => $response,
            'cities' => Organizer::whereNotNull('city')->distinct()->pluck('city')->filter()
        ]);
    }
    
    /**
     * Show the form for creating a new organizer
     */
    public function create()
    {
        return Inertia::render('Admin/Organizers/Create');
    }

    /**
     * Store a newly created organizer in storage
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:organizers',
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'web_site' => 'nullable|url',
            'social_media' => 'nullable|string|max:255',
            'direction' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'logo' => 'nullable|image|max:2048',
            'active' => 'boolean'
        ]);

        try {
            DB::beginTransaction();
            
            // Manejar la carga del logo si existe
            if ($request->hasFile('logo')) {
                $path = $request->file('logo')->store('organizers/logos', 'public');
                $validated['logo'] = $path;
            }
            
            $organizer = Organizer::create($validated);
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Organizador creado exitosamente',
                'organizer' => $organizer
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Eliminar logo si se subió y hubo error
            if (isset($validated['logo'])) {
                Storage::disk('public')->delete($validated['logo']);
            }
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear el organizador',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified organizer (API endpoint)
     */
    public function apiShow($id)
    {
        $organizer = Organizer::withCount('events')->findOrFail($id);
        
        // Obtener eventos asociados
        $events = Event::where('organizer_id', $id)
            ->with(['status', 'location'])
            ->orderBy('start_date', 'desc')
            ->take(10)
            ->get();
        
        return response()->json([
            'status' => 'success',
            'organizer' => $organizer,
            'recent_events' => $events,
            'stats' => [
                'total_events' => $organizer->events_count,
                'active_events' => Event::where('organizer_id', $id)
                    ->where('start_date', '>=', now())
                    ->count(),
                'past_events' => Event::where('organizer_id', $id)
                    ->where('end_date', '<', now())
                    ->count()
            ]
        ]);
    }

    /**
     * Show the form for editing the specified organizer
     */
    public function edit($id)
    {
        $organizer = Organizer::withCount('events')->findOrFail($id);
        
        return Inertia::render('Admin/Organizers/Edit', [
            'organizer' => $organizer
        ]);
    }

    /**
     * Update the specified organizer in storage
     */
    public function update(Request $request, $id)
    {
        $organizer = Organizer::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['nullable', 'email', Rule::unique('organizers')->ignore($organizer->id)],
            'phone' => 'nullable|string|max:20',
            'description' => 'nullable|string',
            'web_site' => 'nullable|url',
            'social_media' => 'nullable|string|max:255',
            'direction' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'logo' => 'nullable|image|max:2048',
            'active' => 'boolean'
        ]);

        try {
            DB::beginTransaction();
            
            // Manejar la actualización del logo
            if ($request->hasFile('logo')) {
                // Eliminar logo anterior si existe
                if ($organizer->logo) {
                    Storage::disk('public')->delete($organizer->logo);
                }
                
                $path = $request->file('logo')->store('organizers/logos', 'public');
                $validated['logo'] = $path;
            }
            
            $organizer->update($validated);
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Organizador actualizado exitosamente',
                'organizer' => $organizer
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            // Eliminar nuevo logo si se subió y hubo error
            if (isset($validated['logo'])) {
                Storage::disk('public')->delete($validated['logo']);
            }
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar el organizador',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle the active status of an organizer
     */
    public function toggleStatus($id)
    {
        try {
            $organizer = Organizer::findOrFail($id);
            $organizer->active = !$organizer->active;
            $organizer->save();
            
            return response()->json([
                'status' => 'success',
                'message' => $organizer->active ? 'Organizador activado' : 'Organizador desactivado',
                'active' => $organizer->active
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al cambiar el estado del organizador',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified organizer from storage
     */
    public function destroy($id)
    {
        try {
            $organizer = Organizer::findOrFail($id);
            
            // Verificar si tiene eventos asociados
            if ($organizer->events()->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se puede eliminar un organizador con eventos asociados'
                ], 400);
            }
            
            DB::beginTransaction();
            
            // Eliminar logo si existe
            if ($organizer->logo) {
                Storage::disk('public')->delete($organizer->logo);
            }
            
            $organizer->delete();
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Organizador eliminado exitosamente'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar el organizador',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get statistics about organizers
     */
    public function getOrganizerStats()
    {
        try {
            $stats = [
                'total' => Organizer::count(),
                'active' => Organizer::where('active', true)->count(),
                'with_events' => Organizer::has('events')->count(),
                'cities' => Organizer::distinct()->count('city'),
                'recent' => Organizer::where('created_at', '>=', now()->subDays(30))->count(),
                'top_organizers' => Organizer::withCount('events')
                    ->orderBy('events_count', 'desc')
                    ->take(5)
                    ->get(['id', 'name', 'events_count'])
            ];
            
            return response()->json([
                'status' => 'success',
                'stats' => $stats
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener estadísticas',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}