<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Log;

class CheckMissingFields extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-missing-fields';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verificar y corregir campos faltantes o incorrectos en la base de datos';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Verificando tabla users...');
        
        // Verificar tabla users
        if (Schema::hasTable('users')) {
            // Verificar campo name
            if (!Schema::hasColumn('users', 'name')) {
                $this->warn('La tabla users no tiene columna name. Agregando...');
                Schema::table('users', function ($table) {
                    $table->string('name')->nullable()->after('id');
                });
                $this->info('Columna name agregada a users.');
            }
            
            // Verificar campo salt
            if (!Schema::hasColumn('users', 'salt')) {
                $this->warn('La tabla users no tiene columna salt. Agregando...');
                Schema::table('users', function ($table) {
                    $table->string('salt', 32)->nullable()->after('email');
                });
                $this->info('Columna salt agregada a users.');
                
                // Actualizar usuarios existentes con salt
                $this->info('Actualizando salt para usuarios existentes...');
                $users = DB::table('users')->whereNull('salt')->get();
                foreach ($users as $user) {
                    DB::table('users')
                        ->where('id', $user->id)
                        ->update(['salt' => bin2hex(random_bytes(16))]);
                }
                $this->info('Salt actualizado para ' . count($users) . ' usuarios.');
            }
            
            // Verificar columna status_id
            if (!Schema::hasColumn('users', 'status_id')) {
                $this->warn('La tabla users no tiene columna status_id. Agregando...');
                Schema::table('users', function ($table) {
                    $table->unsignedBigInteger('status_id')->default(1)->after('id');
                });
                $this->info('Columna status_id agregada a users.');
            }
        } else {
            $this->error('La tabla users no existe!');
        }
        
        // Verificar tabla persons
        $this->info('Verificando tabla persons...');
        if (Schema::hasTable('persons')) {
            // Comprobar el nombre del campo de fecha de nacimiento
            $hasBirthDate = Schema::hasColumn('persons', 'birth_date');
            $hasBirthdate = Schema::hasColumn('persons', 'birthdate');
            
            if ($hasBirthDate && !$hasBirthdate) {
                $this->warn('La tabla persons tiene birth_date pero no birthdate. Renombrando...');
                Schema::table('persons', function ($table) {
                    $table->renameColumn('birth_date', 'birthdate');
                });
                $this->info('Columna birth_date renombrada a birthdate.');
            } elseif (!$hasBirthDate && !$hasBirthdate) {
                $this->warn('La tabla persons no tiene columna de fecha de nacimiento. Agregando...');
                Schema::table('persons', function ($table) {
                    $table->date('birthdate')->nullable();
                });
                $this->info('Columna birthdate agregada a persons.');
            }
        } else {
            $this->error('La tabla persons no existe!');
        }
        
        // Verificar tablas de roles
        $this->info('Verificando tablas de roles...');
        $hasUserRole = Schema::hasTable('user_role');
        $hasUserRoles = Schema::hasTable('user_roles');
        
        if ($hasUserRole && $hasUserRoles) {
            $this->warn('Existen ambas tablas: user_role y user_roles. Esto puede causar problemas.');
            
            // Verificar contenido
            $countUserRole = DB::table('user_role')->count();
            $countUserRoles = DB::table('user_roles')->count();
            
            $this->info("Registros en user_role: $countUserRole");
            $this->info("Registros en user_roles: $countUserRoles");
            
            if ($countUserRole > $countUserRoles) {
                $this->info('Copiando registros de user_role a user_roles...');
                $records = DB::table('user_role')->get();
                foreach ($records as $record) {
                    try {
                        DB::table('user_roles')->updateOrInsert(
                            ['user_id' => $record->user_id, 'rol_id' => $record->rol_id],
                            ['created_at' => $record->created_at, 'updated_at' => $record->updated_at]
                        );
                    } catch (\Exception $e) {
                        $this->error("Error al copiar registro: " . $e->getMessage());
                    }
                }
                $this->info('Registros copiados.');
            } elseif ($countUserRoles > $countUserRole) {
                $this->info('Copiando registros de user_roles a user_role...');
                $records = DB::table('user_roles')->get();
                foreach ($records as $record) {
                    try {
                        DB::table('user_role')->updateOrInsert(
                            ['user_id' => $record->user_id, 'rol_id' => $record->rol_id],
                            ['created_at' => $record->created_at, 'updated_at' => $record->updated_at]
                        );
                    } catch (\Exception $e) {
                        $this->error("Error al copiar registro: " . $e->getMessage());
                    }
                }
                $this->info('Registros copiados.');
            }
        } elseif (!$hasUserRole && !$hasUserRoles) {
            $this->error('No se encontró ninguna tabla de roles (ni user_role ni user_roles)!');
        } elseif ($hasUserRole) {
            $this->info('Solo existe la tabla user_role.');
        } elseif ($hasUserRoles) {
            $this->info('Solo existe la tabla user_roles.');
        }
        
        $this->info('Verificación completa!');
        return Command::SUCCESS;
    }
}