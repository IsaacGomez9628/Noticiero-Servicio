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
            $table->id()->primary();
            $table->string('name');
            $table->string('direction');
            $table->foreignId('estate_id')->constrained('estates')
                ->onDelete('cascade') 
                ->onUpdate('cascade'); 
            $table->foreignId('city_id')->constrained('cities') 
                ->onDelete('cascade') 
                ->onUpdate('cascade'); 
            $table->string('country')->nullable();
            $table->string('zip_code')->nullable();
            $table->decimal('latitude', 10, 7)->nullable();
            $table->decimal('length', 10, 7)->nullable();
            $table->string('link_google_maps')->nullable();
            $table->boolean('active')->default(true);
            $table->timestamps(); // created_at y updated_at
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
