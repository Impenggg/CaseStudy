<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class MarkSeededUsersVerified extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'users:mark-seeded-verified';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Mark all seeded users as email verified';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $seededEmails = [
            'admin@cordillera.com',
            'maria@example.com',
            'rosa@example.com',
            'elena@example.com',
            'juan@example.com',
            'ana@example.com',
        ];

        $updated = 0;
        
        foreach ($seededEmails as $email) {
            $user = User::where('email', $email)->first();
            
            if ($user && !$user->hasVerifiedEmail()) {
                $user->markEmailAsVerified();
                $this->info("✅ Marked {$email} as verified");
                $updated++;
            } elseif ($user && $user->hasVerifiedEmail()) {
                $this->line("ℹ️  {$email} is already verified");
            } else {
                $this->warn("⚠️  User {$email} not found");
            }
        }

        $this->info("\n🎉 Successfully updated {$updated} users to verified status!");
        
        return 0;
    }
}