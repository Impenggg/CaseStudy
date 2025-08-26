<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Favorite;
use App\Models\Product;

class FavoritesController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $items = Favorite::with('product')
            ->where('user_id', $user->id)
            ->latest('id')
            ->get()
            ->map(function ($fav) {
                return [
                    'id' => $fav->id,
                    'product_id' => $fav->product_id,
                    'product' => $fav->product,
                ];
            });
        return response()->json(['data' => $items]);
    }

    public function toggle(Product $product, Request $request)
    {
        $user = $request->user();
        $existing = Favorite::where('user_id', $user->id)->where('product_id', $product->id)->first();
        if ($existing) {
            $existing->delete();
            return response()->json(['status' => 'ok', 'favorited' => false]);
        }
        Favorite::create(['user_id' => $user->id, 'product_id' => $product->id]);
        return response()->json(['status' => 'ok', 'favorited' => true]);
    }

    public function destroy(Product $product, Request $request)
    {
        $user = $request->user();
        Favorite::where('user_id', $user->id)->where('product_id', $product->id)->delete();
        return response()->json(['status' => 'ok']);
    }
}
