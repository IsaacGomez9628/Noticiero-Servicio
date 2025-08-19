<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\Estate;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display a listing of the locations.
     */
    public function index(Request $request)
    {
        $query = Location::with(['estate', 'city']);
        
        // Búsqueda
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('direction', 'like', "%{$search}%");
            });
        }
        
        // Filtro por estado
        if ($request->filled('estate_id')) {
            $query->where('estate_id', $request->estate_id);
        }
        
        // Filtro por ciudad
        if ($request->filled('city_id')) {
            $query->where('city_id', $request->city_id);
        }
        
        // Filtro por activo/inactivo
        if ($request->has('active') && $request->active !== '') {
            $query->where('active', $request->active == '1');
        }
        
        // Ordenamiento
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);
        
        $locations = $query->paginate($request->per_page ?? 10);
        
        return Inertia::render('Admin/Locations/Index', [
            'locations' => $locations,
            'estates' => Estate::orderBy('name')->get(),
            'cities' => City::orderBy('name')->get(),
            'filters' => $request->all()
        ]);
    }
    
    /**
     * API endpoint para obtener datos del formulario (estados y ciudades)
     */
    public function getFormData()
    {
        try {
            $estates = Estate::orderBy('name', 'asc')->get();
            $cities = City::with('estate')->orderBy('name', 'asc')->get();
            
            Log::info('Form data requested:', [
                'estates_count' => $estates->count(),
                'cities_count' => $cities->count()
            ]);
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'estates' => $estates,
                    'cities' => $cities
                ]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error getting form data: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener datos del formulario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * API endpoint para obtener ciudades por estado
     */
    public function getCitiesByEstate($estateId)
    {
        try {
            $cities = City::where('estate_id', $estateId)
                         ->orderBy('name', 'asc')
                         ->get();
            
            Log::info('Cities requested for estate:', [
                'estate_id' => $estateId,
                'cities_count' => $cities->count()
            ]);
            
            return response()->json([
                'status' => 'success',
                'data' => $cities
            ]);
            
        } catch (\Exception $e) {
            Log::error('Error getting cities: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener ciudades',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Store a newly created location in storage.
     */
    public function store(Request $request)
    {
        Log::info('Creating new location:', $request->all());
        
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'direction' => 'required|string|max:500',
            'estate_id' => 'required|exists:estates,id',
            'city_id' => 'required|exists:cities,id',
            'country' => 'nullable|string|max:100',
            'zip_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric|between:-90,90',
            'length' => 'nullable|numeric|between:-180,180',
            'link_google_maps' => 'nullable|url|max:500',
            'active' => 'boolean'
        ], [
            'name.required' => 'El nombre es requerido',
            'direction.required' => 'La dirección es requerida',
            'estate_id.required' => 'El estado es requerido',
            'estate_id.exists' => 'El estado seleccionado no es válido',
            'city_id.required' => 'La ciudad es requerida',
            'city_id.exists' => 'La ciudad seleccionada no es válida',
            'latitude.between' => 'La latitud debe estar entre -90 y 90',
            'length.between' => 'La longitud debe estar entre -180 y 180',
            'link_google_maps.url' => 'El enlace de Google Maps debe ser una URL válida'
        ]);
        
        try {
            DB::beginTransaction();
            
            // Verificar que la ciudad pertenece al estado seleccionado
            $city = City::find($validated['city_id']);
            if ($city->estate_id != $validated['estate_id']) {
                throw new \Exception('La ciudad seleccionada no pertenece al estado seleccionado');
            }
            
            // Crear la ubicación
            $location = Location::create([
                'name' => $validated['name'],
                'direction' => $validated['direction'],
                'estate_id' => $validated['estate_id'],
                'city_id' => $validated['city_id'],
                'country' => $validated['country'] ?? 'México',
                'zip_code' => $validated['zip_code'],
                'latitude' => $validated['latitude'],
                'length' => $validated['length'],
                'link_google_maps' => $validated['link_google_maps'],
                'active' => $validated['active'] ?? true
            ]);
            
            // Cargar relaciones
            $location->load(['estate', 'city']);
            
            DB::commit();
            
            Log::info('Location created successfully:', ['id' => $location->id]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Ubicación creada exitosamente',
                'data' => $location
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            Log::error('Error creating location: ' . $e->getMessage());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear la ubicación: ' . $e->getMessage(),
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Display the specified location.
     */
    public function show($id)
    {
        $location = Location::with(['estate', 'city', 'events'])
                           ->findOrFail($id);
        
        return response()->json([
            'status' => 'success',
            'data' => $location
        ]);
    }
    
    /**
     * Update the specified location in storage.
     */
    public function update(Request $request, $id)
    {
        $location = Location::findOrFail($id);
        
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'direction' => 'sometimes|required|string|max:500',
            'estate_id' => 'sometimes|required|exists:estates,id',
            'city_id' => 'sometimes|required|exists:cities,id',
            'country' => 'nullable|string|max:100',
            'zip_code' => 'nullable|string|max:10',
            'latitude' => 'nullable|numeric|between:-90,90',
            'length' => 'nullable|numeric|between:-180,180',
            'link_google_maps' => 'nullable|url|max:500',
            'active' => 'boolean'
        ]);
        
        try {
            DB::beginTransaction();
            
            // Si se actualizan estado y ciudad, verificar que coincidan
            if (isset($validated['city_id']) && isset($validated['estate_id'])) {
                $city = City::find($validated['city_id']);
                if ($city->estate_id != $validated['estate_id']) {
                    throw new \Exception('La ciudad seleccionada no pertenece al estado seleccionado');
                }
            }
            
            $location->update($validated);
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Ubicación actualizada exitosamente',
                'data' => $location->fresh(['estate', 'city'])
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar la ubicación',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Toggle the active status of a location.
     */
    public function toggleStatus($id)
    {
        try {
            $location = Location::findOrFail($id);
            $location->active = !$location->active;
            $location->save();
            
            return response()->json([
                'status' => 'success',
                'message' => $location->active ? 'Ubicación activada' : 'Ubicación desactivada',
                'active' => $location->active
            ]);
            
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al cambiar el estado',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Remove the specified location from storage.
     */
    public function destroy($id)
    {
        try {
            $location = Location::findOrFail($id);
            
            // Verificar si tiene eventos asociados
            if ($location->events()->count() > 0) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se puede eliminar una ubicación con eventos asociados'
                ], 400);
            }
            
            DB::beginTransaction();
            
            $location->delete();
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Ubicación eliminada exitosamente'
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar la ubicación',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}