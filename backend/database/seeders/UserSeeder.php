<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create admin user
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@cordillera.com',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'bio' => 'Administrator of the Cordillera Weaving Platform',
            'location' => 'Baguio City, Philippines',
        ]);

        // Create weaver users
        User::create([
            'name' => 'Maria Santos',
            'email' => 'maria@example.com',
            'password' => Hash::make('password'),
            'role' => 'weaver',
            'bio' => 'Traditional ikat weaver from Bontoc, preserving our cultural heritage through weaving.',
            'location' => 'Bontoc, Mountain Province',
        ]);

        User::create([
            'name' => 'Rosa Dulawan',
            'email' => 'rosa@example.com',
            'password' => Hash::make('password'),
            'role' => 'weaver',
            'bio' => 'Master weaver specializing in traditional Cordillera patterns and techniques.',
            'location' => 'Sagada, Mountain Province',
        ]);

        User::create([
            'name' => 'Elena Badiw',
            'email' => 'elena@example.com',
            'password' => Hash::make('password'),
            'role' => 'weaver',
            'bio' => 'Passionate weaver creating beautiful home textiles with traditional motifs.',
            'location' => 'Banaue, Ifugao',
        ]);

        // Create buyer users
        User::create([
            'name' => 'Juan Dela Cruz',
            'email' => 'juan@example.com',
            'password' => Hash::make('password'),
            'role' => 'buyer',
            'bio' => 'Art collector and supporter of traditional Filipino crafts.',
            'location' => 'Manila, Philippines',
        ]);

        User::create([
            'name' => 'Ana Garcia',
            'email' => 'ana@example.com',
            'password' => Hash::make('password'),
            'role' => 'buyer',
            'bio' => 'Interior designer who loves incorporating traditional textiles into modern spaces.',
            'location' => 'Cebu City, Philippines',
        ]);
    }
}
