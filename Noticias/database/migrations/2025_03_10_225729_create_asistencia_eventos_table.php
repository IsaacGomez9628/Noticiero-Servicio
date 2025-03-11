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
        Schema::create('asistencia_eventos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('evento_id')->constrained('eventos');
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios');
            $table->foreignId('empresa_id')->nullable()->constrained('empresas');
            $table->foreignId('status_id')->constrained('status');
            $table->string('nombre');
            $table->string('email')->nullable();
            $table->boolean('es_titular')->default(false);
            $table->boolean('asistio')->default(false);
            $table->timestamp('fecha_registro')->nullable();
            $table->timestamp('fecha_confirmacion')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('asistencia_eventos');
    }
};