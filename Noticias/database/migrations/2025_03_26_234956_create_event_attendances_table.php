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
        Schema::create('event_attendances', function (Blueprint $table) {
            $table->id()->primary();
            $table->foreignId('event_id')->constrained('events')->onDelete('cascade');
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            $table->string('nombre')->nullable();
            $table->string('email');
            $table->string('telefono')->nullable();
            $table->string('tipo_registro')->default('personal');
            $table->foreignId('status_id')->constrained('statuses');
            $table->foreignId('organizer_id')->nullable()->constrained('organizers')->nullOnDelete();
            $table->text('informacion_adicional')->nullable();
            
            // Para código QR o confirmación de registro
            $table->string('codigo_registro')->unique();
            
            // Información de metadatos
            $table->ipAddress('ip_registro')->nullable();
            $table->string('user_agent')->nullable();
            
            // Timestamps
            $table->timestamps();
            $table->softDeletes(); // Permite "cancelación" sin eliminar datos
            
            // Restricción única para evitar registros duplicados
            $table->unique(['event_id', 'email', 'deleted_at'], 'unique_event_attendee');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('event_attendances');
    }
};