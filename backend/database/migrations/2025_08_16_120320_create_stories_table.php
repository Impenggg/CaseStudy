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
        Schema::create('stories', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('content');
            $table->text('excerpt');
            $table->string('media_url')->nullable();
            $table->enum('media_type', ['image', 'video'])->nullable();
            $table->foreignId('author_id')->constrained('users')->onDelete('cascade');
            $table->enum('category', ['tradition', 'technique', 'artisan', 'community']);
            $table->json('tags')->nullable();
            $table->boolean('featured')->default(false);
            $table->boolean('published')->default(false);
            $table->integer('reading_time')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('stories');
    }
};
