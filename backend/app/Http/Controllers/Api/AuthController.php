<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request): JsonResponse
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

            $request->validate([
                'name' => 'required|string|max:255',
                'email' => 'required|string|email:filter|max:255|unique:users,email',
                'password' => 'required|string|min:8',
                // Accept legacy/frontend role labels and normalize below
                'role' => 'sometimes|in:weaver,buyer,artisan,customer',
                'bio' => 'nullable|string|max:1000',
                'location' => 'nullable|string|max:255',
            ]);

            // Normalize role inputs: artisan -> weaver, customer -> buyer
            $incomingRole = strtolower((string) $request->input('role', ''));
            if ($incomingRole === 'artisan') {
                $incomingRole = 'weaver';
            } elseif ($incomingRole === 'customer') {
                $incomingRole = 'buyer';
            }

            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => $incomingRole ?: 'buyer',
                'bio' => $request->bio,
                'location' => $request->location,
            ]);

            $token = $user->createToken('auth_token')->plainTextToken;

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
        } catch (\Exception $e) {
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
