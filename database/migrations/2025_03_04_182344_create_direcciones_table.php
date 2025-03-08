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
        Schema::create('direcciones', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('calle_id')->index('calle_id');
            $table->integer('ciudad_id')->index('ciudad_id');
            $table->integer('estado_direccion_id')->index('estado_direccion_id');
            $table->string('codigo_postal', 10)->nullable();
            $table->boolean('eliminado')->nullable()->default(false)->index('idx_eliminado');
            $table->dateTime('fecha_eliminacion')->nullable();
            $table->integer('eliminado_por')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('direcciones');
    }
};
