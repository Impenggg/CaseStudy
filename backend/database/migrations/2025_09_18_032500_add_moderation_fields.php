<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Products
        Schema::table('products', function (Blueprint $table) {
            $table->enum('moderation_status', ['pending', 'approved', 'rejected'])->default('pending')->after('featured');
            $table->foreignId('reviewed_by')->nullable()->after('moderation_status')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->string('rejection_reason')->nullable()->after('reviewed_at');
        });
        // Backfill: existing products set to approved
        try { DB::table('products')->update(['moderation_status' => 'approved']); } catch (\Throwable $e) {}

        // Stories
        Schema::table('stories', function (Blueprint $table) {
            $table->enum('moderation_status', ['pending', 'approved', 'rejected'])->default('pending')->after('published');
            $table->foreignId('reviewed_by')->nullable()->after('moderation_status')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->string('rejection_reason')->nullable()->after('reviewed_at');
        });
        // Backfill: published stories approved, others pending
        try { DB::table('stories')->where('published', 1)->update(['moderation_status' => 'approved']); } catch (\Throwable $e) {}

        // Campaigns
        Schema::table('campaigns', function (Blueprint $table) {
            $table->enum('moderation_status', ['pending', 'approved', 'rejected'])->default('pending')->after('backers_count');
            $table->foreignId('reviewed_by')->nullable()->after('moderation_status')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->string('rejection_reason')->nullable()->after('reviewed_at');
        });
        // Backfill: campaigns with status active/completed approved
        try { DB::table('campaigns')->whereIn('status', ['active','completed'])->update(['moderation_status' => 'approved']); } catch (\Throwable $e) {}

        // Media posts
        Schema::table('media_posts', function (Blueprint $table) {
            $table->enum('moderation_status', ['pending', 'approved', 'rejected'])->default('pending')->after('image_path');
            $table->foreignId('reviewed_by')->nullable()->after('moderation_status')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->string('rejection_reason')->nullable()->after('reviewed_at');
        });

        // Media comments
        Schema::table('media_comments', function (Blueprint $table) {
            $table->enum('moderation_status', ['pending', 'approved', 'rejected'])->default('pending')->after('body');
            $table->foreignId('reviewed_by')->nullable()->after('moderation_status')->constrained('users')->nullOnDelete();
            $table->timestamp('reviewed_at')->nullable()->after('reviewed_by');
            $table->string('rejection_reason')->nullable()->after('reviewed_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['moderation_status', 'reviewed_at', 'rejection_reason']);
        });

        Schema::table('stories', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['moderation_status', 'reviewed_at', 'rejection_reason']);
        });

        Schema::table('campaigns', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['moderation_status', 'reviewed_at', 'rejection_reason']);
        });

        Schema::table('media_posts', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['moderation_status', 'reviewed_at', 'rejection_reason']);
        });

        Schema::table('media_comments', function (Blueprint $table) {
            $table->dropConstrainedForeignId('reviewed_by');
            $table->dropColumn(['moderation_status', 'reviewed_at', 'rejection_reason']);
        });
    }
};
