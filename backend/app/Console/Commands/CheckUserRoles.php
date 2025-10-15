<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;

class CheckUserRoles extends Command
{
    protected $signature = 'users:check-roles';
    protected $description = 'Check user roles in the database';

    public function handle()
    {
        $users = User::all(['id', 'name', 'email', 'role']);
        
        $this->info('User roles:');
        $this->line('');
        
        foreach ($users as $user) {
            $this->line("ID: {$user->id} | {$user->name} ({$user->email}) | Role: {$user->role}");
        }
        
        return 0;
    }
}
