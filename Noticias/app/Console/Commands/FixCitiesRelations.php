<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\City;
use App\Models\Estate;
use Illuminate\Support\Facades\DB;

class FixCitiesRelations extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'fix:cities-relations';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Corrige las relaciones entre ciudades y estados';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('🔧 Iniciando corrección de relaciones ciudades-estados...');
        
        DB::beginTransaction();
        
        try {
            // Primero, obtener o crear el estado de Querétaro
            $queretaroState = Estate::firstOrCreate(
                ['name' => 'Querétaro'],
                ['name' => 'Querétaro']
            );
            
            $this->info("✅ Estado de Querétaro ID: {$queretaroState->id}");
            
            // Lista de ciudades de Querétaro
            $queretaroCities = [
                'Querétaro',
                'San Juan del Río',
                'Corregidora',
                'El Marqués',
                'Tequisquiapan',
                'Ezequiel Montes',
                'Colón',
                'Pedro Escobedo',
                'Amealco',
                'Jalpan de Serra',
                'Cadereyta',
                'Pinal de Amoles',
                'Arroyo Seco',
                'Peñamiller',
                'Landa de Matamoros',
                'San Joaquín',
                'Tolimán',
                'Huimilpan'
            ];
            
            // Actualizar las ciudades existentes con el estate_id correcto
            $updatedCount = 0;
            $createdCount = 0;
            
            foreach ($queretaroCities as $cityName) {
                $city = City::where('name', $cityName)->first();
                
                if ($city) {
                    // Si la ciudad existe pero no tiene estate_id o tiene uno incorrecto
                    if (!$city->estate_id || $city->estate_id != $queretaroState->id) {
                        $city->estate_id = $queretaroState->id;
                        $city->save();
                        $updatedCount++;
                        $this->line("  ↻ Actualizada: {$cityName}");
                    } else {
                        $this->line("  ✓ Ya correcta: {$cityName}");
                    }
                } else {
                    // Si la ciudad no existe, crearla
                    City::create([
                        'name' => $cityName,
                        'estate_id' => $queretaroState->id
                    ]);
                    $createdCount++;
                    $this->line("  + Creada: {$cityName}");
                }
            }
            
            // Ahora hacer lo mismo con otros estados importantes
            $otherStatesAndCities = [
                'Guanajuato' => [
                    'León', 'Guanajuato', 'Irapuato', 'Celaya', 
                    'Salamanca', 'Silao', 'San Miguel de Allende'
                ],
                'Jalisco' => [
                    'Guadalajara', 'Zapopan', 'Tlaquepaque', 
                    'Tonalá', 'Puerto Vallarta'
                ],
                'Ciudad de México' => [
                    'Cuauhtémoc', 'Miguel Hidalgo', 'Coyoacán', 
                    'Benito Juárez', 'Álvaro Obregón'
                ],
                'Estado de México' => [
                    'Toluca', 'Ecatepec', 'Nezahualcóyotl', 
                    'Naucalpan', 'Metepec'
                ]
            ];
            
            foreach ($otherStatesAndCities as $stateName => $cities) {
                $state = Estate::firstOrCreate(
                    ['name' => $stateName],
                    ['name' => $stateName]
                );
                
                $this->info("📍 Procesando {$stateName} (ID: {$state->id})...");
                
                foreach ($cities as $cityName) {
                    $city = City::where('name', $cityName)->first();
                    
                    if ($city) {
                        if (!$city->estate_id || $city->estate_id != $state->id) {
                            $city->estate_id = $state->id;
                            $city->save();
                            $updatedCount++;
                            $this->line("  ↻ Actualizada: {$cityName}");
                        }
                    } else {
                        City::create([
                            'name' => $cityName,
                            'estate_id' => $state->id
                        ]);
                        $createdCount++;
                        $this->line("  + Creada: {$cityName}");
                    }
                }
            }
            
            // Verificar si hay ciudades sin estado asignado
            $citiesWithoutState = City::whereNull('estate_id')->count();
            if ($citiesWithoutState > 0) {
                $this->warn("⚠️ Aún hay {$citiesWithoutState} ciudades sin estado asignado");
                
                // Opcionalmente, asignar un estado por defecto
                $defaultState = Estate::where('name', 'Querétaro')->first();
                City::whereNull('estate_id')->update(['estate_id' => $defaultState->id]);
                $this->info("  → Asignadas al estado por defecto: Querétaro");
            }
            
            DB::commit();
            
            $this->info('');
            $this->info('✅ Corrección completada:');
            $this->info("  • Ciudades actualizadas: {$updatedCount}");
            $this->info("  • Ciudades creadas: {$createdCount}");
            $this->info("  • Total de estados: " . Estate::count());
            $this->info("  • Total de ciudades: " . City::count());
            
            // Verificación final
            $queretaroCitiesCount = City::where('estate_id', $queretaroState->id)->count();
            $this->info("  • Ciudades en Querétaro: {$queretaroCitiesCount}");
            
            return Command::SUCCESS;
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->error('❌ Error: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}