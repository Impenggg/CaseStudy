<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ArtisanRestrict
{
    /**
     * Handle an incoming request.
     * Block users with role 'weaver' (artisan) from performing certain actions.
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();
        if ($user && strtolower((string)$user->role) === 'weaver') {
            return response()->json([
                'status' => 'error',
                'message' => 'Artisan accounts are not allowed to perform this action.',
            ], 403);
        }

        return $next($request);
    }
}
