<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use App\Models\VerificationOtp;

class TestOtpGeneration extends Command
{
    protected $signature = 'test:otp {email}';
    protected $description = 'Test OTP generation without sending email';

    public function handle()
    {
        $email = $this->argument('email');
        
        try {
            // Find or create a test user
            $user = User::where('email', $email)->first();
            
            if (!$user) {
                $user = User::create([
                    'name' => 'Test User',
                    'email' => $email,
                    'password' => bcrypt('password'),
                    'role' => 'buyer',
                ]);
                $this->info("Created test user: {$email}");
            }
            
            // Generate OTP
            $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
            
            // Delete any existing OTPs
            $user->verificationOtp()->delete();
            
            // Create new OTP
            $verificationOtp = $user->verificationOtp()->create([
                'otp' => $otp,
                'expires_at' => now()->addMinutes(5),
            ]);
            
            $this->info("✅ OTP generated successfully!");
            $this->info("📧 Email: {$email}");
            $this->info("🔢 OTP: {$otp}");
            $this->info("⏰ Expires: {$verificationOtp->expires_at}");
            $this->info("");
            $this->info("You can now test the verification at: http://localhost:5173/verify-email");
            $this->info("Use email: {$email} and OTP: {$otp}");
            
        } catch (\Exception $e) {
            $this->error("Failed to generate OTP: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}

