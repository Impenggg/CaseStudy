<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OtpVerificationMail;
use App\Models\User;
use App\Models\VerificationOtp;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class VerificationController extends Controller
{
    public function sendOtp(Request $request)
    {
        $request->validate(['email' => 'required|email|exists:users,email']);

        $user = User::where('email', $request->email)->first();
        $otp = str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);

        // Delete any existing OTPs
        $user->verificationOtp()->delete();

        // Create new OTP
        $verificationOtp = $user->verificationOtp()->create([
            'otp' => $otp,
            'expires_at' => now()->addMinutes(5),
        ]);

        // Send OTP via email
        Mail::to($user->email)->send(new OtpVerificationMail($otp));

        return response()->json([
            'message' => 'OTP sent successfully',
            'expires_in' => 300, // 5 minutes in seconds
        ]);
    }

    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user->verificationOtp || $user->verificationOtp->otp !== $request->otp) {
            return response()->json(['message' => 'Invalid OTP'], 422);
        }

        if ($user->verificationOtp->isExpired()) {
            return response()->json(['message' => 'OTP has expired'], 422);
        }

        // Mark user as verified
        $user->email_verified_at = now();
        $user->save();

        // Delete the used OTP
        $user->verificationOtp()->delete();

        return response()->json(['message' => 'Email verified successfully']);
    }
}
