<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MediaPost;
use App\Models\MediaReaction;
use App\Models\MediaComment;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use App\Models\User;

class MediaPostController extends Controller
{
    /**
     * Public feed: list media posts with author, counts, and recent comments.
     */
    public function index(Request $request): JsonResponse
    {
        $perPage = (int) ($request->query('per_page', 10));
        $posts = MediaPost::query()
            ->with(['user:id,name', 'comments.user:id,name'])
            ->withCount(['reactions as reactions_count', 'comments as comments_count'])
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json($posts);
    }

    /**
     * Show a single post with comments and counts.
     */
    public function show(MediaPost $media): JsonResponse
    {
        $media->load(['user:id,name', 'comments.user:id,name'])
            ->loadCount(['reactions as reactions_count', 'comments as comments_count']);
        return response()->json($media);
    }

    /**
     * Public: list posts for a specific user (paginated)
     */
    public function userPosts(User $user, Request $request): JsonResponse
    {
        $perPage = (int) ($request->query('per_page', 10));
        $posts = MediaPost::query()
            ->where('user_id', $user->id)
            ->with(['user:id,name'])
            ->withCount(['reactions as reactions_count', 'comments as comments_count'])
            ->orderByDesc('created_at')
            ->paginate($perPage);
        return response()->json($posts);
    }

    /**
     * Create a new media post (auth required)
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'image' => 'required|image|max:10240', // 10MB
            'caption' => 'nullable|string|max:2000',
        ]);

        $file = $request->file('image');
        $path = $file->store('uploads/media', 'public');

        $post = MediaPost::create([
            'user_id' => $request->user()->id,
            'caption' => $request->input('caption'),
            'image_path' => $path,
        ]);

        $post->load('user:id,name')->loadCount(['reactions as reactions_count', 'comments as comments_count']);

        return response()->json([
            'status' => 'success',
            'message' => 'Post created',
            'data' => $post,
        ], 201);
    }

    /**
     * Toggle like reaction on a post (auth required)
     */
    public function react(MediaPost $media, Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $existing = MediaReaction::where('media_post_id', $media->id)
            ->where('user_id', $userId)
            ->where('type', 'like')
            ->first();

        if ($existing) {
            $existing->delete();
            $reacted = false;
        } else {
            MediaReaction::create([
                'media_post_id' => $media->id,
                'user_id' => $userId,
                'type' => 'like',
            ]);
            $reacted = true;
        }

        $counts = [
            'reactions_count' => $media->reactions()->count(),
            'comments_count' => $media->comments()->count(),
        ];

        return response()->json([
            'status' => 'success',
            'reacted' => $reacted,
            'counts' => $counts,
        ]);
    }

    /**
     * Add a comment (auth required)
     */
    public function comment(MediaPost $media, Request $request): JsonResponse
    {
        $request->validate([
            'body' => 'required|string|max:2000',
        ]);

        $comment = MediaComment::create([
            'media_post_id' => $media->id,
            'user_id' => $request->user()->id,
            'body' => $request->input('body'),
        ]);

        $comment->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'message' => 'Comment added',
            'data' => $comment,
        ], 201);
    }
}
