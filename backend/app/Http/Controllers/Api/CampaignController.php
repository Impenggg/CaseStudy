<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CampaignStoreRequest;
use App\Http\Requests\CampaignUpdateRequest;
use App\Http\Resources\CampaignResource;
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
            'data' => CampaignResource::collection($campaigns->getCollection()),
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
    public function store(CampaignStoreRequest $request): JsonResponse
    {
        $validated = $request->validated();

        $campaign = Campaign::create(array_merge($validated, [
            'organizer_id' => Auth::id(),
            'current_amount' => 0,
            'backers_count' => 0,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Campaign created successfully',
            'data' => new CampaignResource($campaign->load(['organizer', 'images'])),
        ], 201);
    }

    /**
     * Display the specified campaign.
     */
    public function show(Campaign $campaign): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => new CampaignResource($campaign->load(['organizer', 'images', 'donations'])),
        ]);
    }

    /**
     * Update the specified campaign.
     */
    public function update(CampaignUpdateRequest $request, Campaign $campaign): JsonResponse
    {
        // Check if user owns the campaign
        if ($campaign->organizer_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validated();

        $campaign->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Campaign updated successfully',
            'data' => new CampaignResource($campaign->load(['organizer', 'images'])),
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

        $perPage = (int) $request->get('per_page', 12);
        $campaigns = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => CampaignResource::collection($campaigns->getCollection()),
            'pagination' => [
                'current_page' => $campaigns->currentPage(),
                'total_pages' => $campaigns->lastPage(),
                'per_page' => $campaigns->perPage(),
                'total_count' => $campaigns->total(),
            ],
        ]);
    }
}
