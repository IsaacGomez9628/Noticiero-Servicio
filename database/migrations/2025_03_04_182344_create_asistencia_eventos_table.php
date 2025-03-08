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
            $table->integer('id', true);
            $table->integer('usuario_id');
            $table->integer('evento_id')->index('evento_id');
            $table->integer('status_id')->index('status_id');
            $table->dateTime('fecha_registro')->nullable()->useCurrent();
            $table->dateTime('fecha_actualizacion')->useCurrentOnUpdate()->nullable()->useCurrent();
            $table->text('nota_cancelacion')->nullable();
            $table->boolean('eliminado')->nullable()->default(false)->index('idx_eliminado');
            $table->dateTime('fecha_eliminacion')->nullable();
            $table->integer('eliminado_por')->nullable();

            $table->unique(['usuario_id', 'evento_id'], 'unique_usuario_evento');
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
