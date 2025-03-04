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
        Schema::table('micro_credenciales', function (Blueprint $table) {
            $table->foreign(['empresa_id'], 'micro_credenciales_ibfk_1')->references(['id'])->on('empresas')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['responsable_id'], 'micro_credenciales_ibfk_2')->references(['id'])->on('personas')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['status_id'], 'micro_credenciales_ibfk_3')->references(['id'])->on('status')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('micro_credenciales', function (Blueprint $table) {
            $table->dropForeign('micro_credenciales_ibfk_1');
            $table->dropForeign('micro_credenciales_ibfk_2');
            $table->dropForeign('micro_credenciales_ibfk_3');
        });
    }
};
