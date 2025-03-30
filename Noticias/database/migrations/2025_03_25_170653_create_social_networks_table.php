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
        // Create social_media table (needed for contacts_type)
        Schema::create('social_networks', function (Blueprint $table) {
            $table->id()->primary();
            $table->string('name');
            $table->string('icon')->nullable();
            $table->string('url_pattern')->nullable();
            $table->boolean('deleted')->default(false);
            $table->timestamps();
        });

        // Insert default social media platforms
        // DB::table('social_media')->insert([
        //     ['name' => 'Facebook', 'icon' => 'facebook', 'url_pattern' => 'https://facebook.com/{username}', 'created_at' => now(), 'updated_at' => now()],
        //     ['name' => 'Twitter', 'icon' => 'twitter', 'url_pattern' => 'https://twitter.com/{username}', 'created_at' => now(), 'updated_at' => now()],
        //     ['name' => 'LinkedIn', 'icon' => 'linkedin', 'url_pattern' => 'https://linkedin.com/in/{username}', 'created_at' => now(), 'updated_at' => now()],
        //     ['name' => 'Instagram', 'icon' => 'instagram', 'url_pattern' => 'https://instagram.com/{username}', 'created_at' => now(), 'updated_at' => now()],
        // ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('social_networks');
    }
};