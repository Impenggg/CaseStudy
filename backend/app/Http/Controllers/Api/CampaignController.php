<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CampaignController extends Controller
{
    /**
     * Display a listing of campaigns.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Campaign::with(['organizer', 'images']);

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Category filter
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Status filter
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Sort
        $sortBy = $request->get('sort_by', 'newest');
        switch ($sortBy) {
            case 'ending_soon':
                $query->orderBy('end_date', 'asc');
                break;
            case 'most_funded':
                $query->orderBy('current_amount', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->get('per_page', 12);

        // Support fetching all without pagination
        if ($perPage === 'all') {
            $items = $query->get();
            return response()->json([
                'status' => 'success',
                'data' => $items,
                'pagination' => null,
            ]);
        }

        $campaigns = $query->paginate((int) $perPage);

        return response()->json([
            'status' => 'success',
            'data' => $campaigns->items(),
            'pagination' => [
                'current_page' => $campaigns->currentPage(),
                'total_pages' => $campaigns->lastPage(),
                'per_page' => $campaigns->perPage(),
                'total_count' => $campaigns->total(),
            ],
        ]);
    }

    /**
     * Store a newly created campaign.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'goal_amount' => 'required|numeric|min:0',
            'end_date' => 'required|date|after:today',
            'image' => 'nullable|string',
            'category' => 'required|in:preservation,education,equipment,community',
        ]);

        $campaign = Campaign::create([
            ...$request->all(),
            'organizer_id' => Auth::id(),
            'current_amount' => 0,
            'backers_count' => 0,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Campaign created successfully',
            'data' => $campaign->load(['organizer', 'images']),
        ], 201);
    }

    /**
     * Display the specified campaign.
     */
    public function show(Campaign $campaign): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $campaign->load(['organizer', 'images', 'donations']),
        ]);
    }

    /**
     * Update the specified campaign.
     */
    public function update(Request $request, Campaign $campaign): JsonResponse
    {
        // Check if user owns the campaign
        if ($campaign->organizer_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'goal_amount' => 'sometimes|numeric|min:0',
            'end_date' => 'sometimes|date|after:today',
            'image' => 'nullable|string',
            'category' => 'sometimes|in:preservation,education,equipment,community',
        ]);

        $campaign->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Campaign updated successfully',
            'data' => $campaign->load(['organizer', 'images']),
        ]);
    }

    /**
     * Remove the specified campaign.
     */
    public function destroy(Campaign $campaign): JsonResponse
    {
        // Check if user owns the campaign
        if ($campaign->organizer_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $campaign->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Campaign deleted successfully',
        ]);
    }

    /**
     * Get user's own campaigns.
     */
    public function myCampaigns(Request $request): JsonResponse
    {
        $query = Campaign::where('organizer_id', Auth::id())->with(['images']);

        $perPage = $request->get('per_page', 12);
        $campaigns = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $campaigns->items(),
            'pagination' => [
                'current_page' => $campaigns->currentPage(),
                'total_pages' => $campaigns->lastPage(),
                'per_page' => $campaigns->perPage(),
                'total_count' => $campaigns->total(),
            ],
        ]);
    }
}
