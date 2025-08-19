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
        Schema::create('locations', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->text('direction');
            $table->foreignId('estate_id')
                  ->constrained('estates')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->foreignId('city_id')
                  ->constrained('cities')
                  ->onDelete('restrict')
                  ->onUpdate('cascade');
            $table->string('country', 100)->default('México');
            $table->string('zip_code', 10)->nullable();
            $table->decimal('latitude', 10, 8)->nullable();
            $table->decimal('length', 11, 8)->nullable(); // longitude
            $table->text('link_google_maps')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps();
            
            // Índices para optimizar búsquedas
            $table->index('active');
            $table->index(['estate_id', 'city_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('locations');
    }
};