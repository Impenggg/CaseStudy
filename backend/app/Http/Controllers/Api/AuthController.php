<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(RegisterRequest $request): JsonResponse
    {
        try {
            // Debug: log incoming email and payload (without password)
            try {
                $input = $request->except(['password']);
                $email = (string)($request->input('email', ''));
                Log::info('Register request received', [
                    'email' => $email,
                    'email_hex' => bin2hex($email),
                    'payload' => $input,
                ]);
            } catch (\Throwable $t) {}

            // Normalize/sanitize fields before validation
            $emailNormalized = strtolower(trim(preg_replace('/\s+/', '', (string) $request->input('email', ''))));
            $nameNormalized = trim((string) $request->input('name', ''));
            if ($emailNormalized !== '') {
                $request->merge(['email' => $emailNormalized]);
            }
            if ($nameNormalized !== '') {
                $request->merge(['name' => $nameNormalized]);
            }

            $validated = $request->validated();

            // Normalize role inputs: artisan/weaver -> weaver, customer/buyer -> buyer
            $incomingRole = strtolower((string) $request->input('role', ''));
            if ($incomingRole === 'artisan' || $incomingRole === 'weaver') {
                $incomingRole = 'weaver';
            } elseif ($incomingRole === 'customer' || $incomingRole === 'buyer') {
                $incomingRole = 'buyer';
            } else {
                // Default to buyer if no role specified or invalid role
                $incomingRole = 'buyer';
            }

            // Test database connection before attempting user creation
            try {
                \DB::connection()->getPdo();
                Log::info('Database connection successful');
            } catch (\Exception $dbError) {
                Log::error('Database connection failed', [
                    'error' => $dbError->getMessage(),
                    'trace' => $dbError->getTraceAsString(),
                ]);
                return response()->json([
                    'status' => 'error',
                    'message' => 'Database connection failed. Please try again later.',
                ], 503);
            }

            $user = User::create([
                'terms_accepted_at' => now(),
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'role' => $incomingRole,
                'bio' => $validated['bio'] ?? null,
                'location' => $validated['location'] ?? null,
            ]);

            Log::info('User created successfully', ['user_id' => $user->id, 'email' => $user->email]);

            // Send built-in email verification notification
            try {
                $user->sendEmailVerificationNotification();
                Log::info('Built-in verification link sent', ['user_id' => $user->id]);
            } catch (\Throwable $mailEx) {
                Log::error('Failed to send verification email', [
                    'user_id' => $user->id,
                    'error' => $mailEx->getMessage(),
                ]);
            }

            $token = $user->createToken('auth_token')->plainTextToken;
            
            Log::info('Registration completed successfully', ['user_id' => $user->id]);
            
            return response()->json([
                'status' => 'success',
                'message' => 'User registered successfully',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ],
            ], 201);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Illuminate\Database\QueryException $e) {
            Log::error('Database query failed during registration', [
                'error' => $e->getMessage(),
                'sql' => $e->getSql(),
                'bindings' => $e->getBindings(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Database error occurred. Please try again.',
            ], 500);
        } catch (\Exception $e) {
            Log::error('Registration failed with unexpected error', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString(),
            ]);
            return response()->json([
                'status' => 'error',
                'message' => 'Registration failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Login user and create token.
     */
    public function login(Request $request): JsonResponse
    {
        try {
            $request->validate([
                'email' => 'required|string|email',
                'password' => 'required|string',
            ]);

            if (!Auth::attempt($request->only('email', 'password'))) {
                return response()->json([
                    'status' => 'error',
                    'message' => 'Invalid email or password',
                ], 401);
            }

            $user = User::where('email', $request->email)->firstOrFail();
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'status' => 'success',
                'message' => 'Login successful',
                'data' => [
                    'user' => $user,
                    'token' => $token,
                ],
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Validation failed',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Login failed. Please try again.',
            ], 500);
        }
    }

    /**
     * Logout user (revoke token).
     */
    public function logout(Request $request): JsonResponse
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Successfully logged out',
        ]);
    }

    /**
     * Get authenticated user.
     */
    public function user(Request $request): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $request->user(),
        ]);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'bio' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'avatar' => 'nullable|string|max:255',
        ]);

        $user->update($request->only(['name', 'bio', 'location', 'avatar']));

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => $user,
        ]);
    }
}
