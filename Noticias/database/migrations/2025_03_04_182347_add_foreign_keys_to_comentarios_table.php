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
        Schema::table('comentarios', function (Blueprint $table) {
            $table->foreign(['usuario_id'], 'comentarios_ibfk_1')->references(['id'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['tipo_contenido_id'], 'comentarios_ibfk_2')->references(['id'])->on('tipos_contenido')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['noticia_id'], 'comentarios_ibfk_3')->references(['id'])->on('noticias')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['status_id'], 'comentarios_ibfk_4')->references(['id'])->on('status')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comentarios', function (Blueprint $table) {
            $table->dropForeign('comentarios_ibfk_1');
            $table->dropForeign('comentarios_ibfk_2');
            $table->dropForeign('comentarios_ibfk_3');
            $table->dropForeign('comentarios_ibfk_4');
        });
    }
};
