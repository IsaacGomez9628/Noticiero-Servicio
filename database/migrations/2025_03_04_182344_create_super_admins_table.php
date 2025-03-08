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
        Schema::create('super_admins', function (Blueprint $table) {
            $table->integer('id', true);
            $table->integer('persona_id')->index('persona_id');
            $table->integer('status_id')->index('status_id');
            $table->string('email', 100)->unique('unique_email');
            $table->string('salt');
            $table->string('password');
            $table->dateTime('ultima_actualizacion')->nullable();
            $table->integer('intentos_fallidos')->nullable()->default(0);
            $table->dateTime('ultimo_acceso')->nullable();
            $table->boolean('eliminado')->nullable()->default(false)->index('idx_eliminado');
            $table->dateTime('fecha_eliminacion')->nullable();
            $table->integer('eliminado_por')->nullable();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('super_admins');
    }
};
