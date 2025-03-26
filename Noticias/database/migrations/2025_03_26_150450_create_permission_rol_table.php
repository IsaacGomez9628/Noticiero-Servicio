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
        Schema::create('permission_rol', function (Blueprint $table) {
            $table->foreignId('permission_id')->constrained();
            $table->foreignId('rol_id')->constrained();
            $table->primary(['permission_id','rol_id']);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('permission_rol');
    }
};
