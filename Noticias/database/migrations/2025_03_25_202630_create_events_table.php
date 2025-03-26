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
        Schema::create('events', function (Blueprint $table) {
            $table->id();
            $table->string('titule');
            $table->text('description')->nullable();
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->time('start_time');
            $table->time('end_time')->nullable();
            $table->decimal('price', 10, 2)->default(0.00);
            $table->boolean('its_free')->default(false);
            $table->foreignId('organizer_id')->constrained()->comment('Organizador del evento');
            $table->foreignId('location_id')->constrained();
            $table->foreignId('admin_id')->constrained()->comment('Administrador que registró el evento');
            $table->integer('capacity')->nullable();
            $table->foreignId('event_statuses_id')->constrained('event_statuses');
            $table->string('slug')->unique();
            $table->timestamps(); // created_at y updated_at
            $table->softDeletes(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('events');
    }
};
