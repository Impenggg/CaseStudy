<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use App\Models\CampaignExpenditure;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class CampaignExpenditureController extends Controller
{
    /**
     * List expenditures for a campaign (public).
     */
    public function index(Campaign $campaign): JsonResponse
    {
        $items = $campaign->expenditures()->with(['creator:id,name'])->orderByDesc('used_at')->orderByDesc('created_at')->get();
        return response()->json([
            'status' => 'success',
            'data' => $items,
        ]);
    }

    /**
     * Create an expenditure (organizer or admin).
     */
    public function store(Request $request, Campaign $campaign): JsonResponse
    {
        $user = Auth::user();
        if (!$user || !($user->id === $campaign->organizer_id || $user->role === 'admin')) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'required|numeric|min:0',
            'used_at' => 'nullable|date',
            'attachment_path' => 'nullable|string|max:2048',
        ]);

        $exp = CampaignExpenditure::create(array_merge($validated, [
            'campaign_id' => $campaign->id,
            'created_by' => $user->id,
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Expenditure added',
            'data' => $exp->load(['creator:id,name']),
        ], 201);
    }

    /**
     * Update an expenditure (organizer or admin).
     */
    public function update(Request $request, Campaign $campaign, CampaignExpenditure $expenditure): JsonResponse
    {
        if ($expenditure->campaign_id !== $campaign->id) {
            return response()->json(['status' => 'error', 'message' => 'Not found'], 404);
        }

        $user = Auth::user();
        if (!$user || !($user->id === $campaign->organizer_id || $user->role === 'admin')) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'nullable|string',
            'amount' => 'sometimes|required|numeric|min:0',
            'used_at' => 'nullable|date',
            'attachment_path' => 'nullable|string|max:2048',
        ]);

        $expenditure->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Expenditure updated',
            'data' => $expenditure->load(['creator:id,name']),
        ]);
    }

    /**
     * Delete an expenditure (organizer or admin).
     */
    public function destroy(Campaign $campaign, CampaignExpenditure $expenditure): JsonResponse
    {
        if ($expenditure->campaign_id !== $campaign->id) {
            return response()->json(['status' => 'error', 'message' => 'Not found'], 404);
        }

        $user = Auth::user();
        if (!$user || !($user->id === $campaign->organizer_id || $user->role === 'admin')) {
            return response()->json(['status' => 'error', 'message' => 'Unauthorized'], 403);
        }

        $expenditure->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Expenditure deleted',
        ]);
    }
}
