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
        Schema::table('interaccion_noticias', function (Blueprint $table) {
            $table->foreign(['usuario_id'], 'interaccion_noticias_ibfk_1')->references(['id'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['noticia_id'], 'interaccion_noticias_ibfk_2')->references(['id'])->on('noticias')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('interaccion_noticias', function (Blueprint $table) {
            $table->dropForeign('interaccion_noticias_ibfk_1');
            $table->dropForeign('interaccion_noticias_ibfk_2');
        });
    }
};
