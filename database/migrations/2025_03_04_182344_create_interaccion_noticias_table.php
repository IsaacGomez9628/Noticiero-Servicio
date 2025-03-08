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
        Schema::create('interaccion_noticias', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('usuario_id');
            $table->integer('noticia_id')->index('noticia_id');
            $table->boolean('me_gusta')->nullable()->default(false);
            $table->boolean('guardado')->nullable()->default(false);
            $table->dateTime('fecha_interaccion')->nullable()->useCurrent();
            $table->boolean('eliminado')->nullable()->default(false)->index('idx_eliminado');
            $table->dateTime('fecha_eliminacion')->nullable();
            $table->integer('eliminado_por')->nullable();

            $table->unique(['usuario_id', 'noticia_id'], 'unique_usuario_noticia');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('interaccion_noticias');
    }
};
