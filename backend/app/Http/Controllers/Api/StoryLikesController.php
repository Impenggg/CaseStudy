<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\StoryLike;
use App\Models\Story;

class StoryLikesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $likes = StoryLike::with('story:id,title')
            ->where('user_id', $user->id)
            ->latest('id')
            ->get()
            ->map(function ($like) {
                return [
                    'id' => $like->id,
                    'story_id' => $like->story_id,
                    'story' => $like->story,
                ];
            });
        return response()->json(['data' => $likes]);
    }

    public function toggle(Story $story, Request $request)
    {
        $user = $request->user();
        $existing = StoryLike::where('user_id', $user->id)->where('story_id', $story->id)->first();
        if ($existing) {
            $existing->delete();
            return response()->json(['status' => 'ok', 'liked' => false]);
        }
        StoryLike::create(['user_id' => $user->id, 'story_id' => $story->id]);
        return response()->json(['status' => 'ok', 'liked' => true]);
    }
}
