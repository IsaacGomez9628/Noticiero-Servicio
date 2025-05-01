<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Status;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class StatusController extends Controller
{
    /**
     * Obtener estados por tipo
     * 
     * @param string $type Tipo de estado (user, event, etc.)
     * @return \Illuminate\Http\JsonResponse
     */
    public function getByType($type)
    {
        try {
            $statuses = Status::where('tipo', $type)
                ->where('activo', true)
                ->orderBy('orden')
                ->get();
                
            return response()->json([
                'status' => 'success',
                'statuses' => $statuses
            ]);
        } catch (\Exception $e) {
            Log::error('Error al obtener estados: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al obtener estados',
                'error' => $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Obtener estados para usuarios
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUserStatuses()
    {
        return $this->getByType('user');
    }
    
    /**
     * Obtener estados para eventos
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function getEventStatuses()
    {
        return $this->getByType('event');
    }
    
    /**
     * Crear un nuevo estado
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'nombre' => 'required|string|max:255',
                'slug' => 'required|string|max:255|unique:statuses,slug',
                'tipo' => 'required|string|max:50',
                'descripcion' => 'nullable|string',
                'color' => 'nullable|string|max:20',
                'activo' => 'boolean',
                'orden' => 'nullable|integer'
            ]);
            
            // Obtener el último orden para este tipo si no se proporcionó
            if (!isset($validated['orden'])) {
                $lastOrder = Status::where('tipo', $validated['tipo'])
                    ->max('orden');
                $validated['orden'] = $lastOrder ? $lastOrder + 1 : 1;
            }
            
            // Crear el estado
            $status = Status::create($validated);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Estado creado con éxito',
                'data' => $status
            ], 201);
        } catch (\Exception $e) {
            Log::error('Error al crear estado: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al crear estado',
                'error' => $e->getMessage()
            ], 422);
        }
    }
    
    /**
     * Actualizar un estado existente
     * 
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $status = Status::findOrFail($id);
            
            $validated = $request->validate([
                'nombre' => 'sometimes|string|max:255',
                'slug' => 'sometimes|string|max:255|unique:statuses,slug,' . $id,
                'tipo' => 'sometimes|string|max:50',
                'descripcion' => 'nullable|string',
                'color' => 'nullable|string|max:20',
                'activo' => 'sometimes|boolean',
                'orden' => 'sometimes|integer'
            ]);
            
            // Actualizar el estado
            $status->update($validated);
            
            return response()->json([
                'status' => 'success',
                'message' => 'Estado actualizado con éxito',
                'data' => $status
            ]);
        } catch (\Exception $e) {
            Log::error('Error al actualizar estado: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al actualizar estado',
                'error' => $e->getMessage()
            ], 422);
        }
    }
    
    /**
     * Eliminar un estado
     * 
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $status = Status::findOrFail($id);
            
            // Verificar si el estado está siendo utilizado
            // Esto dependerá de las relaciones en tu modelo
            
            // Eliminar el estado
            $status->delete();
            
            return response()->json([
                'status' => 'success',
                'message' => 'Estado eliminado con éxito'
            ]);
        } catch (\Exception $e) {
            Log::error('Error al eliminar estado: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'Error al eliminar estado',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}