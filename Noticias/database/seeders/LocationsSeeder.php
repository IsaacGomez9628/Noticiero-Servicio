<?php

namespace Database\Seeders;

use App\Models\Locations;
use Illuminate\Database\Seeder;

class LocationsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $locations = [
            [
                'name' => 'Centro de Congresos Querétaro',
                'direction' => 'Paseo de las Artes 1531-B, Querétaro 2000',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76090',
                'latitude' => 20.5931,
                'length' => -100.3851,
                'link_google_maps' => 'https://maps.google.com/?q=20.5931,-100.3851',
                'active' => true,
            ],
            [
                'name' => 'Teatro Metropolitano',
                'direction' => 'Av. Constituyentes 3, Centro, Centro Histórico',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76000',
                'latitude' => 20.5884,
                'length' => -100.3918,
                'link_google_maps' => 'https://maps.google.com/?q=20.5884,-100.3918',
                'active' => true,
            ],
            [
                'name' => 'Jardín Zenea',
                'direction' => 'Calle 16 de Septiembre, Centro Histórico',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76000',
                'latitude' => 20.5923,
                'length' => -100.3937,
                'link_google_maps' => 'https://maps.google.com/?q=20.5923,-100.3937',
                'active' => true,
            ],
            [
                'name' => 'Auditorio Josefa Ortiz de Domínguez',
                'direction' => 'Av. Constituyentes S/N, Centro Histórico',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76000',
                'latitude' => 20.5886,
                'length' => -100.3923,
                'link_google_maps' => 'https://maps.google.com/?q=20.5886,-100.3923',
                'active' => true,
            ],
            [
                'name' => 'Estadio Corregidora',
                'direction' => 'Av. Constituyentes s/n, Villas del Sur',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76040',
                'latitude' => 20.5866,
                'length' => -100.3966,
                'link_google_maps' => 'https://maps.google.com/?q=20.5866,-100.3966',
                'active' => true,
            ],
            [
                'name' => 'Centro Cultural Gómez Morín',
                'direction' => 'Av. Constituyentes 24, La Cruz',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76000',
                'latitude' => 20.5863,
                'length' => -100.3868,
                'link_google_maps' => 'https://maps.google.com/?q=20.5863,-100.3868',
                'active' => true,
            ],
            [
                'name' => 'Plaza de Armas',
                'direction' => 'Calle 5 de Mayo, Centro Histórico',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76000',
                'latitude' => 20.5930,
                'length' => -100.3945,
                'link_google_maps' => 'https://maps.google.com/?q=20.5930,-100.3945',
                'active' => true,
            ],
            [
                'name' => 'Parque Alcanfores',
                'direction' => 'Av. de los Arcos, Residencial Caletto',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76903',
                'latitude' => 20.6010,
                'length' => -100.3769,
                'link_google_maps' => 'https://maps.google.com/?q=20.6010,-100.3769',
                'active' => true,
            ],
            [
                'name' => 'Centro de Exposiciones Querétaro',
                'direction' => 'Paseo de las Artes 1531, Querétaro 2000',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76090',
                'latitude' => 20.5935,
                'length' => -100.3841,
                'link_google_maps' => 'https://maps.google.com/?q=20.5935,-100.3841',
                'active' => true,
            ],
            [
                'name' => 'Alameda Hidalgo',
                'direction' => 'Av. Zaragoza s/n, Centro Histórico',
                'city' => 'Querétaro',
                'estate' => 'Querétaro',
                'country' => 'México',
                'zip_code' => '76000',
                'latitude' => 20.5885,
                'length' => -100.3959,
                'link_google_maps' => 'https://maps.google.com/?q=20.5885,-100.3959',
                'active' => true,
            ],
        ];

        foreach ($locations as $location) {
            Locations::create($location);
        }
    }
}