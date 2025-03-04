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
        Schema::table('eventos', function (Blueprint $table) {
            $table->foreign(['direccion_id'], 'eventos_ibfk_1')->references(['id'])->on('direcciones')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['status_id'], 'eventos_ibfk_2')->references(['id'])->on('status')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['organizador_id'], 'eventos_ibfk_3')->references(['id'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['multimedia_id'], 'eventos_ibfk_4')->references(['id'])->on('multimedia')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('eventos', function (Blueprint $table) {
            $table->dropForeign('eventos_ibfk_1');
            $table->dropForeign('eventos_ibfk_2');
            $table->dropForeign('eventos_ibfk_3');
            $table->dropForeign('eventos_ibfk_4');
        });
    }
};
