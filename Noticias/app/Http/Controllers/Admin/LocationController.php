<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Location;
use App\Models\City;
use App\Models\Estate; // Asegúrate de que esta línea esté presente
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;

class LocationController extends Controller
{
    /**
     * Display a listing of locations.
     */
    public function index()
    {
        $locations = Location::with(['city', 'estate'])
            ->orderBy('name', 'asc')
            ->paginate(20);

        return Inertia::render('Admin/Locations/Index', [
            'locations' => $locations
        ]);
    }

    /**
     * Get all active locations (API endpoint).
     */
    public function getActiveLocations()
    {
        try {
            $locations = Location::where('active', 1)
                ->orderBy('name', 'asc')
                ->get();

            return response()->json([
                'status' => 'success',
                'data' => $locations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener las ubicaciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created location.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'direction' => 'required|string|max:500',
            'estate_id' => 'required|exists:estates,id',
            'city_id' => 'required|exists:cities,id',
            'country' => 'nullable|string|max:100',
            'zip_code' => 'required|string|size:5',
            'latitude' => 'nullable|numeric|between:-90,90',
            'length' => 'nullable|numeric|between:-180,180',
            'link_google_maps' => 'nullable|url|max:500',
            'active' => 'boolean'
        ], [
            'name.required' => 'El nombre de la ubicación es requerido',
            'name.max' => 'El nombre no puede exceder 255 caracteres',
            'direction.required' => 'La dirección es requerida',
            'direction.max' => 'La dirección no puede exceder 500 caracteres',
            'estate_id.required' => 'El estado es requerido',
            'estate_id.exists' => 'El estado seleccionado no es válido',
            'city_id.required' => 'La ciudad es requerida',
            'city_id.exists' => 'La ciudad seleccionada no es válida',
            'zip_code.required' => 'El código postal es requerido',
            'zip_code.size' => 'El código postal debe tener exactamente 5 dígitos',
            'latitude.numeric' => 'La latitud debe ser un número',
            'latitude.between' => 'La latitud debe estar entre -90 y 90',
            'length.numeric' => 'La longitud debe ser un número',
            'length.between' => 'La longitud debe estar entre -180 y 180',
            'link_google_maps.url' => 'El enlace de Google Maps debe ser una URL válida'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            // Preparar los datos
            $data = [
                'name' => $request->name,
                'direction' => $request->direction,
                'estate_id' => $request->estate_id,
                'city_id' => $request->city_id,
                'country' => $request->country ?? 'México',
                'zip_code' => $request->zip_code,
                'latitude' => $request->latitude,
                'length' => $request->length,
                'link_google_maps' => $request->link_google_maps,
                'active' => $request->input('active', 1)
            ];
            
            // Crear la ubicación
            $location = Location::create($data);
            
            // Cargar relaciones
            $location->load(['city', 'estate']);
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Ubicación creada exitosamente',
                'data' => $location
            ], 201);
            
        } catch (\Exception $e) {
            DB::rollBack();
            
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear la ubicación',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified location.
     */
    public function show($id)
    {
        try {
            $location = Location::with(['city', 'estate'])->findOrFail($id);
            
            return response()->json([
                'status' => 'success',
                'data' => $location
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Ubicación no encontrada'
            ], 404);
        }
    }

    /**
     * Update the specified location.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'direction' => 'sometimes|required|string|max:500',
            'estate_id' => 'sometimes|required|exists:estates,id',
            'city_id' => 'sometimes|required|exists:cities,id',
            'country' => 'nullable|string|max:100',
            'zip_code' => 'sometimes|required|string|size:5',
            'latitude' => 'nullable|numeric|between:-90,90',
            'length' => 'nullable|numeric|between:-180,180',
            'link_google_maps' => 'nullable|url|max:500',
            'active' => 'boolean'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error de validación',
                'errors' => $validator->errors()
            ], 422);
        }

        DB::beginTransaction();
        
        try {
            $location = Location::findOrFail($id);
            
            // Actualizar los campos
            $location->update($request->only([
                'name', 'direction', 'estate_id', 'city_id', 
                'country', 'zip_code', 'latitude', 'length', 
                'link_google_maps', 'active'
            ]));
            
            // Recargar relaciones
            $location->load(['city', 'estate']);
            
            DB::commit();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Ubicación actualizada exitosamente',
                'data' => $location
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
     * Remove the specified location.
     */
    public function destroy($id)
    {
        DB::beginTransaction();
        
        try {
            $location = Location::findOrFail($id);
            
            // Verificar si hay eventos asociados
            if ($location->events()->exists()) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'No se puede eliminar la ubicación porque tiene eventos asociados'
                ], 422);
            }
            
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

    /**
     * Search locations.
     */
    public function search(Request $request)
    {
        try {
            $query = $request->input('q', '');
            
            $locations = Location::where('active', 1)
                ->where(function($q) use ($query) {
                    $q->where('name', 'like', "%{$query}%")
                      ->orWhere('direction', 'like', "%{$query}%");
                })
                ->with(['city', 'estate'])
                ->limit(10)
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $locations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al buscar ubicaciones',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get locations by city.
     */
    public function getByCity($cityId)
    {
        try {
            $locations = Location::where('city_id', $cityId)
                ->where('active', 1)
                ->orderBy('name', 'asc')
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $locations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener ubicaciones por ciudad',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get locations by state.
     */
    public function getByState($stateId)
    {
        try {
            $locations = Location::where('estate_id', $stateId)
                ->where('active', 1)
                ->orderBy('name', 'asc')
                ->get();
            
            return response()->json([
                'status' => 'success',
                'data' => $locations
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener ubicaciones por estado',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get data for creating/editing locations.
     */
    public function getFormData()
    {
        try {
            $estates = Estate::orderBy('name', 'asc')->get();
            $cities = City::with('estate')->orderBy('name', 'asc')->get();
            
            // Debug - puedes comentar estas líneas después
            \Log::info('Estados encontrados: ' . $estates->count());
            \Log::info('Ciudades encontradas: ' . $cities->count());
            
            return response()->json([
                'status' => 'success',
                'data' => [
                    'estates' => $estates,
                    'cities' => $cities,
                    'countries' => ['México']
                ]
            ]);
        } catch (\Exception $e) {
            \Log::error('Error en getFormData: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener datos del formulario',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}