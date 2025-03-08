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
        Schema::table('notificaciones', function (Blueprint $table) {
            $table->foreign(['usuario_id'], 'notificaciones_ibfk_1')->references(['id'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['tipo_notificacion_id'], 'notificaciones_ibfk_2')->references(['id'])->on('referencia_notificaciones')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['referencia_id'], 'notificaciones_ibfk_3')->references(['id'])->on('referencia_notificaciones')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notificaciones', function (Blueprint $table) {
            $table->dropForeign('notificaciones_ibfk_1');
            $table->dropForeign('notificaciones_ibfk_2');
            $table->dropForeign('notificaciones_ibfk_3');
        });
    }
};
