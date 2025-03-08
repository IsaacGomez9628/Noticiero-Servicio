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
        Schema::table('contactos', function (Blueprint $table) {
            $table->foreign(['persona_id'], 'contactos_ibfk_1')->references(['id'])->on('personas')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['direccion_id'], 'contactos_ibfk_2')->references(['id'])->on('direcciones')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['tipo_contacto_id'], 'contactos_ibfk_3')->references(['id'])->on('tipos_contacto')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('contactos', function (Blueprint $table) {
            $table->dropForeign('contactos_ibfk_1');
            $table->dropForeign('contactos_ibfk_2');
            $table->dropForeign('contactos_ibfk_3');
        });
    }
};
