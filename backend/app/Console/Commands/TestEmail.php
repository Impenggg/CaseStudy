<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Mail;
use App\Mail\OtpVerificationMail;

class TestEmail extends Command
{
    protected $signature = 'test:email {email}';
    protected $description = 'Test email configuration by sending a test OTP email';

    public function handle()
    {
        $email = $this->argument('email');
        
        try {
            $otp = '123456'; // Test OTP
            Mail::to($email)->send(new OtpVerificationMail($otp));
            
            $this->info("Test email sent successfully to {$email}");
            $this->info("Check your inbox for the OTP: {$otp}");
            
        } catch (\Exception $e) {
            $this->error("Failed to send email: " . $e->getMessage());
            return 1;
        }
        
        return 0;
    }
}

