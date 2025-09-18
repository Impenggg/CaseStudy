<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Story\StoryStoreRequest;
use App\Http\Requests\Story\StoryUpdateRequest;
use App\Models\Story;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class StoryController extends Controller
{
    /**
     * Display a listing of stories.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Story::with(['author', 'media'])->published()->approved();

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Category filter
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Featured filter
        if ($request->has('featured')) {
            $query->featured();
        }

        // Sort
        $sortBy = $request->get('sort_by', 'newest');
        switch ($sortBy) {
            case 'oldest':
                $query->orderBy('created_at', 'asc');
                break;
            case 'featured':
                $query->featured()->orderBy('created_at', 'desc');
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

        $stories = $query->paginate((int) $perPage);

        return response()->json([
            'status' => 'success',
            'data' => $stories->items(),
            'pagination' => [
                'current_page' => $stories->currentPage(),
                'total_pages' => $stories->lastPage(),
                'per_page' => $stories->perPage(),
                'total_count' => $stories->total(),
            ],
        ]);
    }

    /**
     * Store a newly created story.
     */
    public function store(StoryStoreRequest $request): JsonResponse
    {
        // Only allow weavers (artisans) and admins to create
        $user = Auth::user();
        if (!$user || !in_array($user->role, ['weaver', 'artisan', 'admin'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validated();

        $story = Story::create(array_merge($validated, [
            'author_id' => $user->id,
            'moderation_status' => ($user->role === 'admin') ? 'approved' : 'pending',
        ]));

        return response()->json([
            'status' => 'success',
            'message' => 'Story created successfully',
            'data' => $story->load(['author', 'media']),
        ], 201);
    }

    /**
     * Display the specified story.
     */
    public function show(Story $story): JsonResponse
    {
        $user = Auth::user();
        $canView = ($story->moderation_status ?? 'approved') === 'approved'
            || ($user && ($user->id === $story->author_id || ($user->role === 'admin')));
        if (!$canView) {
            return response()->json(['message' => 'Not found'], 404);
        }
        return response()->json([
            'status' => 'success',
            'data' => $story->load(['author', 'media']),
        ]);
    }

    /**
     * Update the specified story.
     */
    public function update(StoryUpdateRequest $request, Story $story): JsonResponse
    {
        // Check if user owns the story
        if ($story->author_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validated();

        $story->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Story updated successfully',
            'data' => $story->load(['author', 'media']),
        ]);
    }

    /**
     * Remove the specified story.
     */
    public function destroy(Story $story): JsonResponse
    {
        // Check if user owns the story
        if ($story->author_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $story->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Story deleted successfully',
        ]);
    }

    /**
     * Get user's own stories.
     */
    public function myStories(Request $request): JsonResponse
    {
        $query = Story::where('author_id', Auth::id())->with(['media']);

        $perPage = $request->get('per_page', 12);
        $stories = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $stories->items(),
            'pagination' => [
                'current_page' => $stories->currentPage(),
                'total_pages' => $stories->lastPage(),
                'per_page' => $stories->perPage(),
                'total_count' => $stories->total(),
            ],
        ]);
    }
}
