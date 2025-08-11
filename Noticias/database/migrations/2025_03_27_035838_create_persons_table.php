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
        Schema::create('persons', function (Blueprint $table) {
            $table->id()->primary();
            $table->string('name', 50);
            $table->string('last_name', 50);
            $table->string('second_last_name')->nullable()->change();
            $table->foreignId('gender_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->date('birth_date');
            $table->unsignedInteger('age')->nullable()->change();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('persons', function (Blueprint $table) {
            // Revertir cambios si es necesario
            $table->string('second_last_name')->change();
            $table->integer('age')->change();
        });
    }
};