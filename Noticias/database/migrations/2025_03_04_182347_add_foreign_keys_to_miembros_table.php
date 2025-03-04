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
        Schema::table('miembros', function (Blueprint $table) {
            $table->foreign(['persona_id'], 'miembros_ibfk_1')->references(['id'])->on('personas')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['cargo_id'], 'miembros_ibfk_2')->references(['id'])->on('cargos')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['status_id'], 'miembros_ibfk_3')->references(['id'])->on('status')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['multimedia_id'], 'miembros_ibfk_4')->references(['id'])->on('multimedia')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('miembros', function (Blueprint $table) {
            $table->dropForeign('miembros_ibfk_1');
            $table->dropForeign('miembros_ibfk_2');
            $table->dropForeign('miembros_ibfk_3');
            $table->dropForeign('miembros_ibfk_4');
        });
    }
};
