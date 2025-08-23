<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Schema;
use App\Models\User;

class ResetDataCommand extends Command
{
    /**
     * The name and signature of the console command.
     */
    protected $signature = 'app:reset-data
        {--admin-email=admin@example.com : Email for the fresh admin user}
        {--admin-name=Admin : Name for the fresh admin user}
        {--admin-password=Password123! : Password for the fresh admin user}
        {--no-seed : Skip creating a fresh admin user after wipe}';

    /**
     * The console command description.
     */
    protected $description = 'Permanently purge application data (not schema), with FK safety. Optionally seed a fresh admin unless --no-seed is provided.';

    /**
     * Execute the console command.
     */
    public function handle(): int
    {
        $this->newLine();
        $this->info('Starting permanent data reset...');

        if (app()->environment('production')) {
            if (! $this->confirm('You are in PRODUCTION. This will permanently delete data. Continue?')) {
                $this->warn('Aborted.');
                return self::SUCCESS;
            }
        }

        try {
            // Disable FK checks for safe truncation across related tables
            DB::statement('SET FOREIGN_KEY_CHECKS=0');

            $tables = [
                // Media
                'media_comments',
                'media_reactions',
                'media_posts',
                // Stories
                'story_media',
                'stories',
                // Campaigns
                'campaign_images',
                'donations',
                'campaigns',
                // Marketplace
                'product_images',
                'orders',
                'products',
                // Addresses
                'addresses',
                // Auth/session
                'sessions',
                'password_reset_tokens',
                'personal_access_tokens',
                // Users last
                'users',
            ];

            foreach ($tables as $table) {
                if (Schema::hasTable($table)) {
                    DB::table($table)->truncate();
                    $this->line("Truncated: {$table}");
                }
            }

            $this->info('All specified tables truncated successfully.');
        } catch (\Throwable $e) {
            $this->error('Data reset failed: ' . $e->getMessage());
            return self::FAILURE;
        } finally {
            // Always attempt to restore FK checks even if an error occurred
            try { DB::statement('SET FOREIGN_KEY_CHECKS=1'); } catch (\Throwable $ignored) {}
        }

        if ($this->option('no-seed')) {
            $this->warn('Admin seeding skipped (--no-seed). You can register new accounts via the UI.');
        } else {
            $email = (string) $this->option('admin-email');
            $name = (string) $this->option('admin-name');
            $password = (string) $this->option('admin-password');

            $admin = User::create([
                'name' => $name,
                'email' => $email,
                'password' => Hash::make($password),
                'role' => 'admin',
            ]);

            $this->info('Seeded fresh admin:');
            $this->table(['id','name','email','role'], [[
                'id' => $admin->id,
                'name' => $admin->name,
                'email' => $admin->email,
                'role' => $admin->role,
            ]]);
        }

        $this->newLine();
        $this->info('Data reset complete.');
        return self::SUCCESS;
    }
}
