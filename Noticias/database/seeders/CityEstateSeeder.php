<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Estate;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CityEstateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::beginTransaction();
        
        try {
            // Primero crear todos los estados
            $states = [
                'Aguascalientes',
                'Baja California',
                'Baja California Sur',
                'Campeche',
                'Chiapas',
                'Chihuahua',
                'Ciudad de México',
                'Coahuila',
                'Colima',
                'Durango',
                'Estado de México',
                'Guanajuato',
                'Guerrero',
                'Hidalgo',
                'Jalisco',
                'Michoacán',
                'Morelos',
                'Nayarit',
                'Nuevo León',
                'Oaxaca',
                'Puebla',
                'Querétaro',
                'Quintana Roo',
                'San Luis Potosí',
                'Sinaloa',
                'Sonora',
                'Tabasco',
                'Tamaulipas',
                'Tlaxcala',
                'Veracruz',
                'Yucatán',
                'Zacatecas'
            ];

            foreach ($states as $state) {
                Estate::updateOrCreate(
                    ['name' => $state],
                    ['name' => $state]
                );
            }

            // Ahora crear las ciudades con su estate_id correspondiente
            
            // ✅ QUERÉTARO - Ciudades con estate_id correcto
            $queretaroState = Estate::where('name', 'Querétaro')->first();
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

            foreach ($queretaroCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $queretaroState->id  // ✅ AHORA SÍ SE ASIGNA EL ESTADO
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $queretaroState->id
                    ]
                );
            }

            // ✅ GUANAJUATO - Ciudades principales
            $guanajuatoState = Estate::where('name', 'Guanajuato')->first();
            $guanajuatoCities = [
                'León',
                'Guanajuato',
                'Irapuato',
                'Celaya',
                'Salamanca',
                'Silao',
                'San Miguel de Allende',
                'Dolores Hidalgo',
                'San Francisco del Rincón',
                'Cortazar',
                'Valle de Santiago',
                'Pénjamo'
            ];

            foreach ($guanajuatoCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $guanajuatoState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $guanajuatoState->id
                    ]
                );
            }

            // ✅ JALISCO - Ciudades principales
            $jaliscoState = Estate::where('name', 'Jalisco')->first();
            $jaliscoCities = [
                'Guadalajara',
                'Zapopan',
                'Tlaquepaque',
                'Tonalá',
                'Puerto Vallarta',
                'Lagos de Moreno',
                'Tepatitlán',
                'Ciudad Guzmán',
                'Ocotlán',
                'La Barca',
                'Chapala',
                'Tequila'
            ];

            foreach ($jaliscoCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $jaliscoState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $jaliscoState->id
                    ]
                );
            }

            // ✅ CIUDAD DE MÉXICO - Alcaldías
            $cdmxState = Estate::where('name', 'Ciudad de México')->first();
            $cdmxCities = [
                'Álvaro Obregón',
                'Azcapotzalco',
                'Benito Juárez',
                'Coyoacán',
                'Cuajimalpa',
                'Cuauhtémoc',
                'Gustavo A. Madero',
                'Iztacalco',
                'Iztapalapa',
                'Magdalena Contreras',
                'Miguel Hidalgo',
                'Milpa Alta',
                'Tláhuac',
                'Tlalpan',
                'Venustiano Carranza',
                'Xochimilco'
            ];

            foreach ($cdmxCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $cdmxState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $cdmxState->id
                    ]
                );
            }

            // ✅ ESTADO DE MÉXICO - Ciudades principales
            $edomexState = Estate::where('name', 'Estado de México')->first();
            $edomexCities = [
                'Toluca',
                'Ecatepec',
                'Nezahualcóyotl',
                'Naucalpan',
                'Tlalnepantla',
                'Chimalhuacán',
                'Cuautitlán Izcalli',
                'Atizapán de Zaragoza',
                'Tultitlán',
                'Coacalco',
                'Metepec',
                'Huixquilucan',
                'Valle de Chalco'
            ];

            foreach ($edomexCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $edomexState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $edomexState->id
                    ]
                );
            }

            // ✅ NUEVO LEÓN - Ciudades principales
            $nuevoLeonState = Estate::where('name', 'Nuevo León')->first();
            $nuevoLeonCities = [
                'Monterrey',
                'Guadalupe',
                'San Nicolás de los Garza',
                'Apodaca',
                'General Escobedo',
                'Santa Catarina',
                'San Pedro Garza García',
                'Juárez',
                'García',
                'Santiago',
                'Cadereyta Jiménez',
                'Montemorelos'
            ];

            foreach ($nuevoLeonCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $nuevoLeonState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $nuevoLeonState->id
                    ]
                );
            }

            // ✅ PUEBLA - Ciudades principales
            $pueblaState = Estate::where('name', 'Puebla')->first();
            $pueblaCities = [
                'Puebla',
                'Tehuacán',
                'San Martín Texmelucan',
                'Atlixco',
                'San Pedro Cholula',
                'San Andrés Cholula',
                'Amozoc',
                'Huauchinango',
                'Teziutlán',
                'Izúcar de Matamoros',
                'Xicotepec'
            ];

            foreach ($pueblaCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $pueblaState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $pueblaState->id
                    ]
                );
            }

            // ✅ VERACRUZ - Ciudades principales
            $veracruzState = Estate::where('name', 'Veracruz')->first();
            $veracruzCities = [
                'Veracruz',
                'Xalapa',
                'Coatzacoalcos',
                'Córdoba',
                'Poza Rica',
                'Orizaba',
                'Minatitlán',
                'Boca del Río',
                'Tuxpan',
                'San Andrés Tuxtla',
                'Papantla',
                'Martínez de la Torre'
            ];

            foreach ($veracruzCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $veracruzState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $veracruzState->id
                    ]
                );
            }

            // ✅ YUCATÁN - Ciudades principales
            $yucatanState = Estate::where('name', 'Yucatán')->first();
            $yucatanCities = [
                'Mérida',
                'Valladolid',
                'Tizimín',
                'Progreso',
                'Ticul',
                'Motul',
                'Umán',
                'Izamal',
                'Tekax',
                'Hunucmá',
                'Oxkutzcab'
            ];

            foreach ($yucatanCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $yucatanState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $yucatanState->id
                    ]
                );
            }

            // ✅ HIDALGO - Ciudades principales
            $hidalgoState = Estate::where('name', 'Hidalgo')->first();
            $hidalgoCities = [
                'Pachuca',
                'Tulancingo',
                'Tula',
                'Huejutla',
                'Ixmiquilpan',
                'Actopan',
                'Apan',
                'Tepeji del Río',
                'Tizayuca',
                'Mineral de la Reforma'
            ];

            foreach ($hidalgoCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $hidalgoState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $hidalgoState->id
                    ]
                );
            }

            // ✅ MICHOACÁN - Ciudades principales
            $michoacanState = Estate::where('name', 'Michoacán')->first();
            $michoacanCities = [
                'Morelia',
                'Uruapan',
                'Zamora',
                'Lázaro Cárdenas',
                'Apatzingán',
                'Zitácuaro',
                'Pátzcuaro',
                'La Piedad',
                'Sahuayo',
                'Ciudad Hidalgo'
            ];

            foreach ($michoacanCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $michoacanState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $michoacanState->id
                    ]
                );
            }

            // ✅ SAN LUIS POTOSÍ - Ciudades principales
            $slpState = Estate::where('name', 'San Luis Potosí')->first();
            $slpCities = [
                'San Luis Potosí',
                'Soledad de Graciano Sánchez',
                'Ciudad Valles',
                'Matehuala',
                'Rioverde',
                'Tamazunchale',
                'Cárdenas',
                'Tamuín',
                'Ébano',
                'Xilitla'
            ];

            foreach ($slpCities as $city) {
                City::updateOrCreate(
                    [
                        'name' => $city,
                        'estate_id' => $slpState->id
                    ],
                    [
                        'name' => $city,
                        'estate_id' => $slpState->id
                    ]
                );
            }

            DB::commit();
            
            $this->command->info('✅ Estados y ciudades creados correctamente');
            $this->command->info('Total estados: ' . Estate::count());
            $this->command->info('Total ciudades: ' . City::count());
            
            // Mostrar algunas estadísticas
            $statesWithCities = Estate::has('cities')->count();
            $this->command->info("Estados con ciudades: $statesWithCities");
            
        } catch (\Exception $e) {
            DB::rollBack();
            $this->command->error('Error al crear estados y ciudades: ' . $e->getMessage());
            throw $e;
        }
    }
}