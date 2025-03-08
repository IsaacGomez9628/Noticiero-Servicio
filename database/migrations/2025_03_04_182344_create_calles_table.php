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
        Schema::create('calles', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('nombre', 100);
            $table->string('numero', 20)->nullable();
            $table->boolean('eliminado')->nullable()->default(false)->index('idx_eliminado');
            $table->dateTime('fecha_eliminacion')->nullable();
            $table->integer('eliminado_por')->nullable();

            $table->unique(['nombre', 'numero'], 'unique_nombre_numero');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calles');
    }
};
