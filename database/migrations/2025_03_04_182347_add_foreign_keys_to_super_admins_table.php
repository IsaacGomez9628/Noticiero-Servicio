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
        Schema::table('super_admins', function (Blueprint $table) {
            $table->foreign(['persona_id'], 'super_admins_ibfk_1')->references(['id'])->on('personas')->onUpdate('restrict')->onDelete('restrict');
            $table->foreign(['status_id'], 'super_admins_ibfk_2')->references(['id'])->on('status')->onUpdate('restrict')->onDelete('restrict');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('super_admins', function (Blueprint $table) {
            $table->dropForeign('super_admins_ibfk_1');
            $table->dropForeign('super_admins_ibfk_2');
        });
    }
};
