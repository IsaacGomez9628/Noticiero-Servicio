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
        Schema::create('miembros', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('persona_id')->index('persona_id');
            $table->integer('cargo_id')->index('cargo_id');
            $table->integer('status_id')->index('status_id');
            $table->integer('multimedia_id')->nullable()->index('multimedia_id');
            $table->text('descripcion_profesional')->nullable();
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
        Schema::dropIfExists('miembros');
    }
};
