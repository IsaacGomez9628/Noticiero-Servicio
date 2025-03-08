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
        Schema::table('noticias', function (Blueprint $table) {
            $table->foreign(['status_id'], 'noticias_ibfk_1')->references(['id'])->on('status')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['autor_id'], 'noticias_ibfk_2')->references(['id'])->on('usuarios')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['multimedia_id'], 'noticias_ibfk_3')->references(['id'])->on('multimedia')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('noticias', function (Blueprint $table) {
            $table->dropForeign('noticias_ibfk_1');
            $table->dropForeign('noticias_ibfk_2');
            $table->dropForeign('noticias_ibfk_3');
        });
    }
};
