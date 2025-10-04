<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Donation;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DonationController extends Controller
{
    /**
     * Display a listing of donations.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Donation::with(['campaign', 'donor']);

        $perPage = $request->get('per_page', 12);
        $donations = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $donations->items(),
            'pagination' => [
                'current_page' => $donations->currentPage(),
                'total_pages' => $donations->lastPage(),
                'per_page' => $donations->perPage(),
                'total_count' => $donations->total(),
            ],
        ]);
    }

    /**
     * Store a newly created donation.
     */
    public function store(Request $request): JsonResponse
    {
        $user = Auth::user();
        if (!$user || $user->role !== 'buyer') {
            return response()->json([
                'status' => 'error',
                'message' => 'Only customers can support campaigns',
            ], 403);
        }
        $request->validate([
            'campaign_id' => 'required|exists:campaigns,id',
            'amount' => 'required|numeric|min:1',
            'message' => 'nullable|string|max:500',
            'anonymous' => 'boolean',
            'payment_method' => 'required|string',
        ]);

        $campaign = Campaign::findOrFail($request->campaign_id);

        // Check if campaign is active
        if ($campaign->status !== 'active') {
            return response()->json([
                'status' => 'error',
                'message' => 'Campaign is not active',
            ], 400);
        }

        DB::transaction(function () use ($request, $campaign, $user) {
            // Create donation
            $donation = Donation::create([
                'campaign_id' => $request->campaign_id,
                'donor_id' => $user->id,
                'amount' => $request->amount,
                'message' => $request->message,
                'anonymous' => $request->anonymous ?? false,
                'payment_method' => $request->payment_method,
            ]);

            // Update campaign
            $campaign->increment('current_amount', $request->amount);
            $campaign->increment('backers_count');
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Donation processed successfully',
            'data' => null,
        ], 201);
    }

    /**
     * Display the specified donation.
     */
    public function show(Donation $donation): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $donation->load(['campaign', 'donor']),
        ]);
    }

    /**
     * Get user's own donations.
     */
    public function myDonations(Request $request): JsonResponse
    {
        $query = Donation::where('donor_id', Auth::id())->with(['campaign']);

        $perPage = $request->get('per_page', 12);
        $donations = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $donations->items(),
            'pagination' => [
                'current_page' => $donations->currentPage(),
                'total_pages' => $donations->lastPage(),
                'per_page' => $donations->perPage(),
                'total_count' => $donations->total(),
            ],
        ]);
    }

    /**
     * List donations for a specific campaign (public, sanitized for anonymity).
     */
    public function campaignDonations(Request $request, Campaign $campaign): JsonResponse
    {
        $perPage = (int) $request->get('per_page', 20);
        $donations = Donation::where('campaign_id', $campaign->id)
            ->with(['donor:id,name'])
            ->orderByDesc('created_at')
            ->paginate($perPage);

        // Sanitize donor details for anonymous donations
        $items = collect($donations->items())->map(function ($d) {
            return [
                'id' => $d->id,
                'amount' => (float) $d->amount,
                'message' => $d->message,
                'anonymous' => (bool) $d->anonymous,
                'donor' => $d->anonymous ? null : (
                    $d->relationLoaded('donor') && $d->donor ? [
                        'id' => $d->donor->id,
                        'name' => $d->donor->name,
                    ] : null
                ),
                'created_at' => optional($d->created_at)->toIso8601String(),
            ];
        })->all();

        return response()->json([
            'status' => 'success',
            'data' => $items,
            'pagination' => [
                'current_page' => $donations->currentPage(),
                'total_pages' => $donations->lastPage(),
                'per_page' => $donations->perPage(),
                'total_count' => $donations->total(),
            ],
        ]);
    }
}
