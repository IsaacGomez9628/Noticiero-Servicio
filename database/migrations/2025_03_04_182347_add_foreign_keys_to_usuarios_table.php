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
        Schema::table('usuarios', function (Blueprint $table) {
            $table->foreign(['creado_por_superadmin_id'], 'fk_usuario_creador')->references(['id'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['persona_id'], 'usuarios_ibfk_1')->references(['id'])->on('personas')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['tipo_usuario_id'], 'usuarios_ibfk_2')->references(['id'])->on('tipos_usuarios')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['status_id'], 'usuarios_ibfk_3')->references(['id'])->on('status')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('usuarios', function (Blueprint $table) {
            $table->dropForeign('fk_usuario_creador');
            $table->dropForeign('usuarios_ibfk_1');
            $table->dropForeign('usuarios_ibfk_2');
            $table->dropForeign('usuarios_ibfk_3');
        });
    }
};
