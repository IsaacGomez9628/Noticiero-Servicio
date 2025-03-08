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
        Schema::table('asistencia_eventos', function (Blueprint $table) {
            $table->foreign(['usuario_id'], 'asistencia_eventos_ibfk_1')->references(['id'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['evento_id'], 'asistencia_eventos_ibfk_2')->references(['id'])->on('eventos')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['status_id'], 'asistencia_eventos_ibfk_3')->references(['id'])->on('status')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('asistencia_eventos', function (Blueprint $table) {
            $table->dropForeign('asistencia_eventos_ibfk_1');
            $table->dropForeign('asistencia_eventos_ibfk_2');
            $table->dropForeign('asistencia_eventos_ibfk_3');
        });
    }
};
