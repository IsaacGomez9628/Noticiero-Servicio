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
        Schema::table('direcciones', function (Blueprint $table) {
            $table->foreign(['calle_id'], 'direcciones_ibfk_1')->references(['id'])->on('calles')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['ciudad_id'], 'direcciones_ibfk_2')->references(['id'])->on('ciudades')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['estado_direccion_id'], 'direcciones_ibfk_3')->references(['id'])->on('estados_direcciones')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('direcciones', function (Blueprint $table) {
            $table->dropForeign('direcciones_ibfk_1');
            $table->dropForeign('direcciones_ibfk_2');
            $table->dropForeign('direcciones_ibfk_3');
        });
    }
};
