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
        Schema::create('multimedia', function (Blueprint $table) {
            $table->integer('id', true);
            $table->string('url');
            $table->string('nombre', 100);
            $table->integer('tamaño')->nullable();
            $table->string('formato', 20)->nullable();
            $table->dateTime('fecha_actualizacion')->useCurrentOnUpdate()->nullable()->useCurrent();
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
        Schema::dropIfExists('multimedia');
    }
};
