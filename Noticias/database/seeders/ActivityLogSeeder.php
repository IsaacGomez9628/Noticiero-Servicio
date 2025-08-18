<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\ActivityLog;
use App\Models\Admin;
use App\Models\User;
use App\Models\Event;
use App\Models\EventAttendance;
use Carbon\Carbon;

class ActivityLogSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Verificar si ya existen logs de actividad
        if (ActivityLog::count() > 0) {
            $this->command->info('ActivityLogs ya existen, saltando seeder...');
            return;
        }
        
        // Obtener algunos registros existentes para crear logs realistas
        $admin = Admin::first();
        $users = User::take(5)->get();
        $events = Event::take(3)->get();
        $attendances = EventAttendance::take(5)->get();
        
        // Si no hay admin, crear uno básico para los logs
        if (!$admin) {
            $this->command->warn('No se encontraron administradores. Creando uno básico...');
            $admin = Admin::firstOrCreate([
                'email' => 'admin@sistema.com'
            ], [
                'name' => 'Administrador Sistema',
                'rol_id' => 1, // Asume que existe un rol admin
            ]);
        }
        
        // Verificar que existen datos necesarios
        if ($users->isEmpty()) {
            $this->command->warn('No se encontraron usuarios. Los logs de actividad serán limitados.');
        }
        
        if ($events->isEmpty()) {
            $this->command->warn('No se encontraron eventos. Los logs de actividad serán limitados.');
        }
        
        if ($attendances->isEmpty()) {
            $this->command->warn('No se encontraron asistencias. Los logs de actividad serán limitados.');
        }
        
        $activities = [];
        
        // Actividades de usuarios (solo si existen usuarios)
        if ($users->isNotEmpty()) {
            $activities[] = [
                'admin_id' => $admin->id,
                'object_type' => 'App\Models\User',
                'object_id' => $users->first()->id,
                'action' => 'create',
                'details' => 'Nuevo usuario registrado en la plataforma.',
                'ip' => '192.168.1.100',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'created_at' => Carbon::now()->subHours(2),
            ];
            
            if ($users->count() > 1) {
                $activities[] = [
                    'admin_id' => $admin->id,
                    'object_type' => 'App\Models\User',
                    'object_id' => $users->skip(1)->first()->id,
                    'action' => 'update',
                    'details' => 'Información de usuario actualizada.',
                    'ip' => '192.168.1.101',
                    'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
                    'created_at' => Carbon::now()->subHours(4),
                ];
            }
            
            if ($users->count() > 2) {
                $activities[] = [
                    'admin_id' => $admin->id,
                    'object_type' => 'App\Models\User',
                    'object_id' => $users->skip(2)->first()->id,
                    'action' => 'view',
                    'details' => 'Perfil de usuario consultado.',
                    'ip' => '192.168.1.106',
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'created_at' => Carbon::now()->subMinutes(15),
                ];
            }
            
            if ($users->count() > 3) {
                $activities[] = [
                    'admin_id' => $admin->id,
                    'object_type' => 'App\Models\User',
                    'object_id' => $users->skip(3)->first()->id,
                    'action' => 'update',
                    'details' => 'Rol de "Editor" asignado a un usuario.',
                    'ip' => '192.168.1.108',
                    'user_agent' => 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                    'created_at' => Carbon::now()->subDays(2),
                ];
            }
        }
        
        // Actividades de eventos (solo si existen eventos)
        if ($events->isNotEmpty()) {
            $activities[] = [
                'admin_id' => $admin->id,
                'object_type' => 'App\Models\Event',
                'object_id' => $events->first()->id,
                'action' => 'create',
                'details' => 'Evento "Conferencia de Innovación" creado.',
                'ip' => '192.168.1.102',
                'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15',
                'created_at' => Carbon::now()->subHours(6),
            ];
            
            if ($events->count() > 1) {
                $activities[] = [
                    'admin_id' => $admin->id,
                    'object_type' => 'App\Models\Event',
                    'object_id' => $events->skip(1)->first()->id,
                    'action' => 'update',
                    'details' => 'Evento actualizado con nueva información.',
                    'ip' => '192.168.1.103',
                    'user_agent' => 'Mozilla/5.0 (Android 11; Mobile; rv:68.0) Gecko/68.0 Firefox/88.0',
                    'created_at' => Carbon::now()->subHours(8),
                ];
            }
            
            if ($events->count() > 2) {
                $activities[] = [
                    'admin_id' => $admin->id,
                    'object_type' => 'App\Models\Event',
                    'object_id' => $events->skip(2)->first()->id,
                    'action' => 'delete',
                    'details' => 'Evento cancelado y eliminado del sistema.',
                    'ip' => '192.168.1.107',
                    'user_agent' => 'Mozilla/5.0 (iPad; CPU OS 14_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15E148 Safari/604.1',
                    'created_at' => Carbon::now()->subDays(1),
                ];
            }
        }
        
        // Actividades de asistencias (solo si existen asistencias)
        if ($attendances->isNotEmpty()) {
            $activities[] = [
                'admin_id' => $admin->id,
                'object_type' => 'App\Models\EventAttendance',
                'object_id' => $attendances->first()->id,
                'action' => 'register',
                'details' => 'Asistencia registrada para "Taller de React".',
                'ip' => '192.168.1.104',
                'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0) Gecko/20100101 Firefox/91.0',
                'created_at' => Carbon::now()->subMinutes(30),
            ];
            
            if ($attendances->count() > 1) {
                $activities[] = [
                    'admin_id' => $admin->id,
                    'object_type' => 'App\Models\EventAttendance',
                    'object_id' => $attendances->skip(1)->first()->id,
                    'action' => 'cancel',
                    'details' => 'Asistencia cancelada por el usuario.',
                    'ip' => '192.168.1.105',
                    'user_agent' => 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15',
                    'created_at' => Carbon::now()->subMinutes(45),
                ];
            }
            
            if ($attendances->count() > 2) {
                $activities[] = [
                    'admin_id' => $admin->id,
                    'object_type' => 'App\Models\EventAttendance',
                    'object_id' => $attendances->skip(2)->first()->id,
                    'action' => 'approve',
                    'details' => 'Asistencia aprobada por el administrador.',
                    'ip' => '192.168.1.109',
                    'user_agent' => 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Edge/91.0.864.59',
                    'created_at' => Carbon::now()->subDays(3),
                ];
            }
        }
        
        // Crear los logs solo si hay actividades para crear
        if (empty($activities)) {
            $this->command->warn('No se pudieron crear activity logs porque no hay datos suficientes en la base de datos.');
            return;
        }
        
        foreach ($activities as $activity) {
            ActivityLog::create($activity);
        }
        
        $this->command->info('Activity logs creados exitosamente. Total: ' . count($activities));
    }
}