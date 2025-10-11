<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('verification_otps')) {
            Schema::drop('verification_otps');
        }
        if (Schema::hasTable('verification_tokens')) {
            Schema::drop('verification_tokens');
        }
    }

    public function down(): void
    {
        // Intentionally left empty; legacy tables are not recreated
    }
};


