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
        Schema::create('contact_types', function (Blueprint $table) {
            $table->id()->primary();
            $table->foreignId('social_network_id')->constrained(); 
            $table->string('profile_url')->nullable();
            $table->boolean('deleted')->nullable()->default(false); 
            $table->timestamp('deleted_at')->nullable();
            // $table->foreignId('deleted_by')->nullable()->constrained('users'); 
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contact_types'); // Changed 'tipos_contacto' to 'contacts_type'
    }
};