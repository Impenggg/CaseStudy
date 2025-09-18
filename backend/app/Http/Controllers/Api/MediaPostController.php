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
            ->approved()
            ->with(['user:id,name', 'comments' => function ($q) { $q->approved()->with('user:id,name'); }])
            ->withCount([
                'reactions as reactions_count',
                'comments as comments_count' => function ($q) { $q->approved(); }
            ])
            ->orderByDesc('created_at')
            ->paginate($perPage);

        return response()->json($posts);
    }

    /**
     * Show a single post with comments and counts.
     */
    public function show(MediaPost $media): JsonResponse
    {
        $user = request()->user();
        $canView = $media->moderation_status === 'approved'
            || ($user && ($user->id === $media->user_id || $user->role === 'admin'));
        if (!$canView) {
            return response()->json(['message' => 'Not found'], 404);
        }

        $commentsRelation = ['comments' => function ($q) use ($user, $media) {
            // Only approved comments unless owner/admin
            $isPrivileged = $user && ($user->id === $media->user_id || $user->role === 'admin');
            if (!$isPrivileged) {
                $q->approved();
            }
            $q->with('user:id,name');
        }];

        $media->load(array_merge(['user:id,name'], $commentsRelation))
            ->loadCount([
                'reactions as reactions_count',
                'comments as comments_count' => function ($q) use ($user, $media) {
                    $isPrivileged = $user && ($user->id === $media->user_id || $user->role === 'admin');
                    if (!$isPrivileged) {
                        $q->approved();
                    }
                }
            ]);
        return response()->json($media);
    }

    /**
     * Public: list posts for a specific user (paginated)
     */
    public function userPosts(User $user, Request $request): JsonResponse
    {
        $perPage = (int) ($request->query('per_page', 10));
        $viewer = $request->user();
        $isOwnerOrAdmin = $viewer && ($viewer->id === $user->id || $viewer->role === 'admin');
        $posts = MediaPost::query()
            ->where('user_id', $user->id)
            ->when(!$isOwnerOrAdmin, function ($q) { $q->approved(); })
            ->with(['user:id,name'])
            ->withCount([
                'reactions as reactions_count',
                'comments as comments_count' => function ($q) use ($isOwnerOrAdmin) {
                    if (!$isOwnerOrAdmin) $q->approved();
                }
            ])
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

        $creator = $request->user();
        $post = MediaPost::create([
            'user_id' => $creator->id,
            'caption' => $request->input('caption'),
            'image_path' => $path,
            'moderation_status' => ($creator->role === 'admin') ? 'approved' : 'pending',
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

        $actor = $request->user();
        $comment = MediaComment::create([
            'media_post_id' => $media->id,
            'user_id' => $actor->id,
            'body' => $request->input('body'),
            'moderation_status' => ($actor->role === 'admin') ? 'approved' : 'pending',
        ]);

        $comment->load('user:id,name');

        return response()->json([
            'status' => 'success',
            'message' => 'Comment added',
            'data' => $comment,
        ], 201);
    }
}
