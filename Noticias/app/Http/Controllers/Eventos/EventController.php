<?php

namespace App\Http\Controllers\Eventos;

use App\Http\Controllers\Controller;
use App\Models\Event;
use App\Models\EventAttendance;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class EventController extends Controller
{
    /**
     * Display a listing of events.
     */
    public function index()
    {
        try {
            // Obtener eventos activos ordenados por fecha
            $eventos = Event::with(['organizer', 'location', 'status', 'categories', 'images'])
                ->whereHas('status', function($query) {
                    $query->where('active', true);
                })
                ->orderBy('start_date', 'asc')
                ->get();
                
            // Transformar datos para el frontend
            $eventos = $eventos->map(function($evento) {
                // Buscar la imagen principal
                $mainImage = $evento->images->where('es_principal', true)->first() 
                    ?? $evento->images->first();
                
                // Obtener categoría principal
                $categoria = $evento->categories->first() ? $evento->categories->first()->slug : null;
                
                return [
                    'id' => $evento->id,
                    'titulo' => $evento->titule,
                    'descripcion' => $evento->description,
                    'fecha_inicio' => $evento->start_date,
                    'hora' => $evento->start_time,
                    'precio' => (float)$evento->price,
                    'its_free' => $evento->its_free,
                    'organizador' => [
                        'persona' => [
                            'nombres' => $evento->organizer->name,
                        ],
                    ],
                    'direccion' => [
                        'direccion_completa' => $evento->location->direction . ', ' . $evento->location->city,
                    ],
                    'modalidad' => 'Presencial', // Podría determinarse por alguna lógica si es necesario
                    'capacidad' => $evento->capacity,
                    'status' => [
                        'nombre' => $evento->status->name,
                        'color' => $evento->status->color,
                    ],
                    'categoria' => $categoria,
                    'imagen' => $mainImage ? $mainImage->ruta : null,
                ];
            });

            return Inertia::render('Eventos', [
                'eventos' => $eventos,
                'success' => true,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Eventos', [
                'eventos' => [],
                'success' => false,
                'errorMessage' => 'Error al cargar los eventos: ' . $e->getMessage(),
            ]);
        }
    }

    /**
     * Display the specified event details.
     */
    public function show($id)
    {
        $evento = Event::with(['location.city', 'location.estate', 'organizer'])->findOrFail($id);
        
        // Contar asistencias confirmadas
        $asistenciasConfirmadas = EventAttendance::where('event_id', $id)
            ->whereHas('status', function($query) {
                $query->where('slug', '!=', 'cancelado');
            })
            ->count();
        
        // Transformar el evento para incluir la información de ubicación correctamente
        $eventoData = [
            'id' => $evento->id,
            'titulo' => $evento->titule,
            'descripcion' => $evento->description,
            'fecha_inicio' => $evento->start_date,
            'hora' => $evento->start_time,
            'capacity' => $evento->capacity,
            'organizador' => [
                'persona' => [
                    'nombre_completo' => $evento->organizer->name,
                ],
            ],
            'direccion' => [
                'direccion_completa' => $evento->location->direction . ', ' . 
                    ($evento->location->city ? $evento->location->city->name : '') . ', ' . 
                    ($evento->location->estate ? $evento->location->estate->name : ''),
            ],
            'location' => [
                'name' => $evento->location->name,
                'direction' => $evento->location->direction,
                'city' => $evento->location->city ? $evento->location->city->name : '',
                'estate' => $evento->location->estate ? $evento->location->estate->name : '',
                'country' => $evento->location->country,
                'latitude' => $evento->location->latitude,
                'length' => $evento->location->length,
                'link_google_maps' => $evento->location->link_google_maps,
            ],
        ];
        
        return Inertia::render('EventoDetalles', [
            'evento' => $eventoData,
            'asistenciasConfirmadas' => $asistenciasConfirmadas,
            'auth' => [ // Añadir información de autenticación
            'user' => Auth::user()
            ]
        ]);
    }
    
    /**
     * Display the event location details.
     */
    public function location($id)
    {
        try {
            $evento = Event::with(['location.city', 'location.estate', 'location.images'])->findOrFail($id);
            
            $locationData = [
                'id' => $evento->location->id,
                'name' => $evento->location->name,
                'direction' => $evento->location->direction,
                'city' => $evento->location->city ? $evento->location->city->name : '',
                'estate' => $evento->location->estate ? $evento->location->estate->name : '',
                'country' => $evento->location->country,
                'zip_code' => $evento->location->zip_code,
                'latitude' => $evento->location->latitude,
                'length' => $evento->location->length,
                'link_google_maps' => $evento->location->link_google_maps,
                'images' => $evento->location->images->map(function($image) {
                    return [
                        'ruta' => $image->ruta,
                        'alt_texto' => $image->alt_texto,
                    ];
                }),
                'evento' => [
                    'id' => $evento->id,
                    'titulo' => $evento->titule,
                ],
            ];
            
            return Inertia::render('EventoUbicacion', [
                'location' => $locationData,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Error', [
                'message' => 'No se pudo encontrar la ubicación del evento solicitado.',
                'error' => $e->getMessage(),
            ]);
        }
    }
    
    /**
     * Show the registration form for the event.
     */
    public function showRegistrationForm($id)
    {
        try {
            $evento = Event::with(['organizer', 'location'])->findOrFail($id);
            
            $eventoData = [
                'id' => $evento->id,
                'titulo' => $evento->titule,
                'fecha_inicio' => $evento->start_date,
                'hora' => $evento->start_time,
                'organizador' => $evento->organizer->name,
                'direccion' => $evento->location->direction . ', ' . $evento->location->city,
            ];
            
            return Inertia::render('EventoRegistro', [
                'evento' => $eventoData,
            ]);
        } catch (\Exception $e) {
            return Inertia::render('Error', [
                'message' => 'No se pudo cargar el formulario de registro para el evento solicitado.',
                'error' => $e->getMessage(),
            ]);
        }
    }
}