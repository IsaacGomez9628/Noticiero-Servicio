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
        Schema::create('noticias', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('status_id')->index('status_id');
            $table->integer('autor_id')->index('autor_id');
            $table->integer('multimedia_id')->nullable()->index('multimedia_id');
            $table->string('titulo', 200);
            $table->text('contenido');
            $table->integer('visitas')->nullable()->default(0);
            $table->dateTime('ultima_edicion')->useCurrentOnUpdate()->nullable()->useCurrent();
            $table->dateTime('fecha_creacion')->nullable()->useCurrent();
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
        Schema::dropIfExists('noticias');
    }
};
