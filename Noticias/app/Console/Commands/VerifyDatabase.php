<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use App\Models\Status;

class VerifyDatabase extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'db:verify';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Verifica el estado de la base de datos para el sistema de usuarios';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('====================================');
        $this->info('🔍 VERIFICANDO BASE DE DATOS');
        $this->info('====================================');
        
        $hasIssues = false;
        
        // 1. Verificar tabla de roles
        $this->info("\n📋 Verificando tabla de roles (rols)...");
        if (Schema::hasTable('rols')) {
            $roles = DB::table('rols')->get();
            $this->info("✅ Tabla 'rols' existe con " . $roles->count() . " registros");
            
            // Mostrar roles
            foreach ($roles as $role) {
                $this->line("   - ID: {$role->id} | Nombre: {$role->name}");
            }
        } else {
            $this->error("❌ La tabla 'rols' no existe");
            $hasIssues = true;
        }
        
        // 2. Verificar tablas de relación usuario-rol
        $this->info("\n📋 Verificando tablas de relación usuario-rol...");
        $hasUserRole = Schema::hasTable('user_role');
        $hasUserRoles = Schema::hasTable('user_roles');
        
        if ($hasUserRole && $hasUserRoles) {
            $this->warn("⚠️  Existen AMBAS tablas: user_role y user_roles");
            $countUserRole = DB::table('user_role')->count();
            $countUserRoles = DB::table('user_roles')->count();
            $this->info("   - Registros en user_role: $countUserRole");
            $this->info("   - Registros en user_roles: $countUserRoles");
            $hasIssues = true;
        } elseif ($hasUserRole) {
            $count = DB::table('user_role')->count();
            $this->info("✅ Existe tabla 'user_role' con $count registros");
        } elseif ($hasUserRoles) {
            $count = DB::table('user_roles')->count();
            $this->info("✅ Existe tabla 'user_roles' con $count registros");
        } else {
            $this->error("❌ No existe ninguna tabla de relación usuario-rol");
            $hasIssues = true;
        }
        
        // 3. Verificar tabla de estados
        $this->info("\n📋 Verificando tabla de estados (statuses)...");
        if (Schema::hasTable('statuses')) {
            $statuses = DB::table('statuses')->get();
            $this->info("✅ Tabla 'statuses' existe con " . $statuses->count() . " registros");
            
            // Buscar estado Active o Activo
            $activeStatus = $statuses->firstWhere('name', 'Active');
            if (!$activeStatus) {
                $activeStatus = $statuses->firstWhere('name', 'Activo');
            }
            
            if (!$activeStatus) {
                $this->warn("⚠️  No existe el estado 'Active' o 'Activo'");
                $hasIssues = true;
            } else {
                $this->info("   ✅ Estado activo existe: " . $activeStatus->name);
            }
        } else {
            $this->error("❌ La tabla 'statuses' no existe");
            $hasIssues = true;
        }
        
        // 4. Verificar tabla de usuarios
        $this->info("\n📋 Verificando tabla de usuarios...");
        if (Schema::hasTable('users')) {
            $this->info("✅ Tabla 'users' existe");
            
            // Verificar columna salt
            if (Schema::hasColumn('users', 'salt')) {
                $this->info("   ✅ Columna 'salt' existe");
            } else {
                $this->error("   ❌ Columna 'salt' NO existe");
                $hasIssues = true;
            }
            
            // Verificar columna status_id
            if (Schema::hasColumn('users', 'status_id')) {
                $this->info("   ✅ Columna 'status_id' existe");
            } else {
                $this->error("   ❌ Columna 'status_id' NO existe");
                $hasIssues = true;
            }
        } else {
            $this->error("❌ La tabla 'users' no existe");
            $hasIssues = true;
        }
        
        // 5. Verificar tabla de list_companies
        $this->info("\n📋 Verificando tabla de list_companies...");
        if (Schema::hasTable('list_companies')) {
            $this->info("✅ Tabla 'list_companies' existe");
        } else {
            $this->error("❌ La tabla 'list_companies' no existe");
            $hasIssues = true;
        }
        
        // 6. Verificar tabla de personas
        $this->info("\n📋 Verificando tabla de personas...");
        if (Schema::hasTable('persons')) {
            $this->info("✅ Tabla 'persons' existe");
        } else {
            $this->error("❌ La tabla 'persons' no existe");
            $hasIssues = true;
        }
        
        // 7. Verificar tabla de géneros
        $this->info("\n📋 Verificando tabla de géneros...");
        if (Schema::hasTable('genders')) {
            $genders = DB::table('genders')->count();
            $this->info("✅ Tabla 'genders' existe con $genders registros");
        } else {
            $this->error("❌ La tabla 'genders' no existe");
            $hasIssues = true;
        }
        
        // 8. Verificar tabla de empresas
        $this->info("\n📋 Verificando tabla de empresas...");
        if (Schema::hasTable('companies')) {
            $this->info("✅ Tabla 'companies' existe");
            
            // Verificar columna user_id
            if (Schema::hasColumn('companies', 'user_id')) {
                $this->info("   ✅ Columna 'user_id' existe");
            } else {
                $this->error("   ❌ Columna 'user_id' NO existe en companies");
                $hasIssues = true;
            }
        } else {
            $this->error("❌ La tabla 'companies' no existe");
            $hasIssues = true;
        }
        
        // Resumen final
        $this->info("\n====================================");
        if ($hasIssues) {
            $this->error("❌ Se encontraron problemas en la base de datos");
            $this->info("\n🔧 SOLUCIONES SUGERIDAS:");
            $this->info("1. Ejecuta las migraciones: php artisan migrate");
            $this->info("2. Ejecuta los seeders:");
            $this->info("   - php artisan db:seed --class=StatusSeeder");
            $this->info("   - php artisan db:seed --class=GenderSeeder");
            $this->info("   - php artisan db:seed --class=RolSeeder");
            $this->info("3. Si falta la tabla list_companies, créala manualmente o con una migración");
        } else {
            $this->info("✅ La base de datos está configurada correctamente");
        }
        $this->info("====================================\n");
        
        return $hasIssues ? Command::FAILURE : Command::SUCCESS;
    }
}