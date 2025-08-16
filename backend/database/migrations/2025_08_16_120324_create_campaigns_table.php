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
        Schema::create('campaigns', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->decimal('goal_amount', 12, 2);
            $table->decimal('current_amount', 12, 2)->default(0);
            $table->date('end_date');
            $table->foreignId('organizer_id')->constrained('users')->onDelete('cascade');
            $table->string('image')->nullable();
            $table->enum('category', ['preservation', 'education', 'equipment', 'community']);
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->integer('backers_count')->default(0);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('campaigns');
    }
};
