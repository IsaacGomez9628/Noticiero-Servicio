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
        Schema::create('historial_eliminaciones', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('tabla', 50)->index('idx_tabla');
            $table->integer('registro_id')->index('idx_registro_id');
            $table->json('datos');
            $table->integer('eliminado_por')->nullable();
            $table->dateTime('fecha_eliminacion')->nullable()->useCurrent();
            $table->string('motivo')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('historial_eliminaciones');
    }
};
