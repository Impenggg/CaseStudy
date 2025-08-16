<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
        $query = Story::with(['author', 'media'])->published();

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

    /**
     * Store a newly created story.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'required|string|max:500',
            'media_url' => 'nullable|string',
            'media_type' => 'nullable|in:image,video',
            'category' => 'required|in:tradition,technique,artisan,community',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
            'published' => 'boolean',
        ]);

        $story = Story::create([
            ...$request->all(),
            'author_id' => Auth::id(),
        ]);

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
        return response()->json([
            'status' => 'success',
            'data' => $story->load(['author', 'media']),
        ]);
    }

    /**
     * Update the specified story.
     */
    public function update(Request $request, Story $story): JsonResponse
    {
        // Check if user owns the story
        if ($story->author_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'excerpt' => 'sometimes|string|max:500',
            'media_url' => 'nullable|string',
            'media_type' => 'nullable|in:image,video',
            'category' => 'sometimes|in:tradition,technique,artisan,community',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
            'published' => 'boolean',
        ]);

        $story->update($request->all());

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
