<?php

namespace Database\Seeders;

use App\Models\City;
use App\Models\Estate;
use Illuminate\Database\Seeder;

class CityEstateSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $states = [
            'Querétaro',
            'Guanajuato',
            'Jalisco',
            'Ciudad de México',
            'Estado de México',
            'Hidalgo',
            'Michoacán',
            'San Luis Potosí',
            'Puebla',
            'Veracruz'
        ];

        foreach ($states as $state) {
            Estate::updateOrCreate(['name' => $state]);
        }

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
            'Pinal de Amoles'
        ];

        foreach ($queretaroCities as $city) {
            City::updateOrCreate(['name' => $city]);
        }

        $otherCities = [
            'Guanajuato' => ['León', 'Guanajuato', 'Irapuato', 'Celaya'],
            'Jalisco' => ['Guadalajara', 'Puerto Vallarta', 'Zapopan'],
            'Ciudad de México' => ['Cuauhtémoc', 'Miguel Hidalgo', 'Coyoacán'],
            'Estado de México' => ['Toluca', 'Metepec', 'Ecatepec'],
        ];

        foreach ($otherCities as $stateName => $cities) {
            $state = Estate::where('name', $stateName)->first();
            foreach ($cities as $city) {
                City::updateOrCreate(['name' => $city]);
            }
        }
    }
}