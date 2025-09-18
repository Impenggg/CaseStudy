<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use App\Models\Product;
use App\Models\Story;
use App\Models\Campaign;
use App\Models\MediaPost;
use App\Models\MediaComment;

class AdminModerationController extends Controller
{
    private function resolveModel(string $type)
    {
        return match ($type) {
            'products' => Product::class,
            'stories' => Story::class,
            'campaigns' => Campaign::class,
            'media-posts' => MediaPost::class,
            'media-comments' => MediaComment::class,
            default => null,
        };
    }

    public function list(Request $request, string $type): JsonResponse
    {
        $model = $this->resolveModel($type);
        if (!$model) {
            return response()->json(['status' => 'error', 'message' => 'Unknown type'], 400);
        }
        $status = $request->query('status', 'pending');
        if (!in_array($status, ['pending', 'approved', 'rejected'])) {
            $status = 'pending';
        }
        $perPage = (int) $request->query('per_page', 15);
        $query = $model::query()->where('moderation_status', $status)->orderByDesc('created_at');
        
        // Include relationships for better display
        if ($type === 'products') {
            $query->with('user:id,name');
        } elseif ($type === 'stories') {
            $query->with('author:id,name');
        } elseif ($type === 'campaigns') {
            $query->with('organizer:id,name');
        } elseif ($type === 'media-posts' || $type === 'media-comments') {
            $query->with('user:id,name');
        }
        
        $items = $query->paginate($perPage);
        return response()->json([
            'status' => 'success',
            'data' => $items->items(),
            'pagination' => [
                'current_page' => $items->currentPage(),
                'total_pages' => $items->lastPage(),
                'per_page' => $items->perPage(),
                'total_count' => $items->total(),
            ],
        ]);
    }

    public function approve(Request $request, string $type, int $id): JsonResponse
    {
        $model = $this->resolveModel($type);
        if (!$model) {
            return response()->json(['status' => 'error', 'message' => 'Unknown type'], 400);
        }
        $item = $model::findOrFail($id);
        $item->moderation_status = 'approved';
        $item->reviewed_by = Auth::id();
        $item->reviewed_at = now();
        $item->rejection_reason = null;
        $item->save();
        return response()->json(['status' => 'success', 'message' => 'Approved', 'data' => $item]);
    }

    public function reject(Request $request, string $type, int $id): JsonResponse
    {
        $model = $this->resolveModel($type);
        if (!$model) {
            return response()->json(['status' => 'error', 'message' => 'Unknown type'], 400);
        }
        $request->validate(['reason' => 'nullable|string|max:500']);
        $item = $model::findOrFail($id);
        $item->moderation_status = 'rejected';
        $item->reviewed_by = Auth::id();
        $item->reviewed_at = now();
        $item->rejection_reason = $request->input('reason');
        $item->save();
        return response()->json(['status' => 'success', 'message' => 'Rejected', 'data' => $item]);
    }
}
