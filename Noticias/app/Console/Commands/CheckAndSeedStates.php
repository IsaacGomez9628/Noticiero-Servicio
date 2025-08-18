<?php
// Crear este archivo en: app/Console/Commands/CheckAndSeedStates.php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Estate;
use App\Models\City;
use Illuminate\Support\Facades\Schema;

class CheckAndSeedStates extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'states:check-and-seed';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check if states exist and seed them if necessary';

    /**
     * Execute the console command.
     *
     * @return int
     */
    public function handle()
    {
        // Verificar si las tablas existen
        if (!Schema::hasTable('states')) {
            $this->error('La tabla "states" no existe. Ejecuta las migraciones primero.');
            return 1;
        }

        if (!Schema::hasTable('cities')) {
            $this->error('La tabla "cities" no existe. Ejecuta las migraciones primero.');
            return 1;
        }

        // Verificar si hay estados
        $stateCount = Estate::count();
        $this->info("Estados encontrados: {$stateCount}");

        if ($stateCount == 0) {
            $this->info('No hay estados. Creando estados...');
            
            $states = [
                ['name' => 'Querétaro', 'code' => 'QRO'],
                ['name' => 'Ciudad de México', 'code' => 'CDMX'],
                ['name' => 'Jalisco', 'code' => 'JAL'],
                ['name' => 'Nuevo León', 'code' => 'NL'],
                ['name' => 'Estado de México', 'code' => 'MEX'],
                ['name' => 'Guanajuato', 'code' => 'GTO'],
                ['name' => 'Puebla', 'code' => 'PUE'],
                ['name' => 'Veracruz', 'code' => 'VER'],
                ['name' => 'Yucatán', 'code' => 'YUC'],
                ['name' => 'Chiapas', 'code' => 'CHIS'],
                ['name' => 'Aguascalientes', 'code' => 'AGS'],
                ['name' => 'Baja California', 'code' => 'BC'],
                ['name' => 'Baja California Sur', 'code' => 'BCS'],
                ['name' => 'Campeche', 'code' => 'CAM'],
                ['name' => 'Chihuahua', 'code' => 'CHIH'],
                ['name' => 'Coahuila', 'code' => 'COAH'],
                ['name' => 'Colima', 'code' => 'COL'],
                ['name' => 'Durango', 'code' => 'DGO'],
                ['name' => 'Guerrero', 'code' => 'GRO'],
                ['name' => 'Hidalgo', 'code' => 'HGO'],
                ['name' => 'Michoacán', 'code' => 'MICH'],
                ['name' => 'Morelos', 'code' => 'MOR'],
                ['name' => 'Nayarit', 'code' => 'NAY'],
                ['name' => 'Oaxaca', 'code' => 'OAX'],
                ['name' => 'Quintana Roo', 'code' => 'QROO'],
                ['name' => 'San Luis Potosí', 'code' => 'SLP'],
                ['name' => 'Sinaloa', 'code' => 'SIN'],
                ['name' => 'Sonora', 'code' => 'SON'],
                ['name' => 'Tabasco', 'code' => 'TAB'],
                ['name' => 'Tamaulipas', 'code' => 'TAMPS'],
                ['name' => 'Tlaxcala', 'code' => 'TLAX'],
                ['name' => 'Zacatecas', 'code' => 'ZAC']
            ];
            
            foreach ($states as $stateData) {
                $state = Estate::create([
                    'name' => $stateData['name'],
                    'code' => $stateData['code'],
                    'country' => 'México'
                ]);
                
                $this->info("Estado creado: {$state->name}");
                
                // Agregar ciudades para Querétaro
                if ($stateData['name'] === 'Querétaro') {
                    $cities = [
                        'Querétaro',
                        'San Juan del Río',
                        'Corregidora',
                        'El Marqués',
                        'Pedro Escobedo',
                        'Huimilpan',
                        'Amealco de Bonfil',
                        'Tequisquiapan',
                        'Ezequiel Montes',
                        'Cadereyta de Montes',
                        'Colón',
                        'Tolimán',
                        'Peñamiller',
                        'Pinal de Amoles',
                        'Jalpan de Serra',
                        'Landa de Matamoros',
                        'San Joaquín',
                        'Arroyo Seco'
                    ];
                    
                    foreach ($cities as $cityName) {
                        City::create([
                            'name' => $cityName,
                            'estate_id' => $state->id
                        ]);
                        $this->info("  Ciudad creada: {$cityName}");
                    }
                }
                // Agregar ciudades principales para otros estados
                elseif ($stateData['name'] === 'Ciudad de México') {
                    $cities = [
                        'Álvaro Obregón',
                        'Azcapotzalco',
                        'Benito Juárez',
                        'Coyoacán',
                        'Cuajimalpa',
                        'Cuauhtémoc',
                        'Gustavo A. Madero',
                        'Iztacalco',
                        'Iztapalapa'
                    ];
                    
                    foreach ($cities as $cityName) {
                        City::create([
                            'name' => $cityName,
                            'estate_id' => $state->id
                        ]);
                        $this->info("  Ciudad creada: {$cityName}");
                    }
                }
                elseif ($stateData['name'] === 'Jalisco') {
                    $cities = [
                        'Guadalajara',
                        'Zapopan',
                        'Tlaquepaque',
                        'Tonalá',
                        'Puerto Vallarta'
                    ];
                    
                    foreach ($cities as $cityName) {
                        City::create([
                            'name' => $cityName,
                            'estate_id' => $state->id
                        ]);
                        $this->info("  Ciudad creada: {$cityName}");
                    }
                }
                else {
                    // Para otros estados, agregar la capital con el mismo nombre
                    City::create([
                        'name' => $stateData['name'],
                        'estate_id' => $state->id
                    ]);
                    $this->info("  Ciudad capital creada: {$stateData['name']}");
                }
            }
            
            $this->info('¡Estados y ciudades creados exitosamente!');
        } else {
            $this->info('Ya existen estados en la base de datos.');
            
            // Verificar ciudades
            $cityCount = City::count();
            $this->info("Ciudades encontradas: {$cityCount}");
        }
        
        return 0;
    }
}