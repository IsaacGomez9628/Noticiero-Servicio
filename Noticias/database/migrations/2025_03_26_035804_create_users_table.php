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
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->foreignId('status_id')->constrained();
            $table->string('email')->unique();
            $table->string('salt', 32);
            $table->string('password');
            $table->timestamp('last_authentication')->nullable();
            $table->boolean('blocked')->default(false);
            $table->integer('failed_password_attempts')->default(0);
            $table->boolean('deleted')->default(false);
            $table->rememberToken();
            $table->timestamps();
        });

        // Tabla de relación usuario-rol
        Schema::create('user_role', function (Blueprint $table) {
            $table->foreignId('user_id')->constrained();
            $table->foreignId('rol_id')->constrained();
            $table->primary(['user_id', 'rol_id']);
            $table->timestamps();
        });
        
        Schema::create('password_reset_tokens', function(Blueprint $table){
            $table->string('email')->primary();
            $table->string('token');
            $table->timestamp('create_alt')->nullable();
        });

        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary();
            $table->foreignId('user_id')->nullable()->index();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('user_role');
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
    }
};