<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class ListUsers extends Command
{
    protected $signature = 'users:list';
    protected $description = 'List all users in the database';

    public function handle()
    {
        $users = User::all(['id', 'name', 'email', 'email_verified_at']);
        
        $this->info('Users in database:');
        $this->line('');
        
        foreach ($users as $user) {
            $verified = $user->email_verified_at ? '✅ Verified' : '❌ Not verified';
            $this->line("ID: {$user->id} | {$user->name} ({$user->email}) | {$verified}");
        }
        
        return 0;
    }
}
