<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('asistencia_eventos', function (Blueprint $table) {
            // Agregar campos faltantes
            $table->string('nombre')->nullable()->after('status_id');
            $table->string('email')->nullable()->after('nombre');
            $table->foreignId('empresa_id')->nullable()->after('usuario_id');
            $table->boolean('es_titular')->default(false)->after('email');
            $table->boolean('asistio')->default(false)->after('es_titular');
            $table->timestamp('fecha_confirmacion')->nullable()->after('fecha_registro');
            
            // Agregar índice para empresa_id
            $table->index('empresa_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asistencia_eventos', function (Blueprint $table) {
            // Eliminar campos añadidos
            $table->dropColumn([
                'nombre',
                'email',
                'empresa_id',
                'es_titular',
                'asistio',
                'fecha_confirmacion'
            ]);
            
            // Eliminar índice
            $table->dropIndex(['empresa_id']);
        });
    }
};