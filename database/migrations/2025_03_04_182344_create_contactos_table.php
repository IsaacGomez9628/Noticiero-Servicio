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
        Schema::create('contactos', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('persona_id')->index('persona_id');
            $table->integer('direccion_id')->nullable()->index('direccion_id');
            $table->integer('tipo_contacto_id')->nullable()->index('tipo_contacto_id');
            $table->string('email', 100)->nullable();
            $table->string('telefono', 20)->nullable();
            $table->dateTime('fecha_actualizacion_atributo')->useCurrentOnUpdate()->nullable()->useCurrent();
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
        Schema::dropIfExists('contactos');
    }
};
