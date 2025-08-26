<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Schema;
use App\Models\Product;
use App\Models\Order;
use App\Models\Story;
use App\Models\User;
use App\Models\Favorite;
use App\Models\StoryLike;
use App\Models\Donation;

class DashboardController extends Controller
{
    /**
     * Return role-aware dashboard stats and recent activity for the authenticated user.
     */
    public function show(string $role, Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Normalize role: prefer user role when available
        $role = strtolower($role ?: ($user->role ?? 'buyer'));

        // Artisan-like roles handled similarly
        $isArtisan = in_array($role, ['artisan', 'weaver', 'seller']);

        if ($isArtisan) {
            // Sales where this user's products were purchased
            $salesQuery = Order::query()
                ->whereHas('product', function ($q) use ($user) {
                    $q->where('user_id', $user->id);
                });
            $totalSales = (clone $salesQuery)->count();
            $totalRevenue = (clone $salesQuery)->sum('total_amount');

            // Stories metrics
            $storiesShared = Story::where('author_id', $user->id)->count();
            $storiesViewed = 0.0;
            if (Schema::hasColumn('stories', 'views')) {
                $storiesViewed = (float) Story::where('author_id', $user->id)->sum('views');
            }

            // Campaign metrics
            $campaignsStarted = \App\Models\Campaign::where('organizer_id', $user->id)->count();
            $fundsRaised = (float) \App\Models\Donation::whereHas('campaign', function ($q) use ($user) {
                $q->where('organizer_id', $user->id);
            })->sum('amount');

            // Recent activity: last orders and new products
            $recentOrders = (clone $salesQuery)
                ->with(['product:id,name,price'])
                ->latest('id')
                ->take(5)
                ->get()
                ->map(function ($o) {
                    return [
                        'id' => 'order-'.$o->id,
                        'title' => 'New order received',
                        'subtitle' => ($o->product->name ?? 'Product') . ' - ₱' . number_format((float)($o->total_amount), 2),
                        'at' => optional($o->created_at)->toIso8601String(),
                    ];
                });

            $recentProducts = Product::where('user_id', $user->id)
                ->latest('id')
                ->take(5)
                ->get()
                ->map(function ($p) {
                    return [
                        'id' => 'product-'.$p->id,
                        'title' => 'New product added',
                        'subtitle' => ($p->name ?? 'Product') . ' listed for ₱' . number_format((float)($p->price), 2),
                        'at' => optional($p->created_at)->toIso8601String(),
                    ];
                });

            $activity = $recentOrders->merge($recentProducts)->sortByDesc('at')->values()->all();

            return response()->json([
                // Quick stats (artisan)
                'totalSales' => $totalSales,
                'storiesShared' => $storiesShared,
                'campaignsStarted' => $campaignsStarted,
                // Community impact (artisan)
                'community' => [
                    'totalRevenue' => (float)$totalRevenue,
                    'storiesViewed' => $storiesViewed,
                    'fundsRaised' => $fundsRaised,
                ],
                'activity' => $activity,
            ]);
        }

        // Buyer/customer view
        $itemsPurchased = Schema::hasTable('orders')
            ? Order::where('buyer_id', $user->id)->count()
            : 0;
        $favorites = Schema::hasTable('favorites')
            ? Favorite::where('user_id', $user->id)->count()
            : 0;
        $totalSpent = Schema::hasTable('orders')
            ? (float) Order::where('buyer_id', $user->id)->sum('total_amount')
            : 0.0;

        $recentOrders = Order::with(['product:id,name,user_id'])
            ->where('buyer_id', $user->id)
            ->latest('id')
            ->take(5)
            ->get()
            ->map(function ($o) {
                return [
                    'id' => 'myorder-'.$o->id,
                    'title' => 'Order placed',
                    'subtitle' => ($o->product->name ?? 'Product') . ' - ₱' . number_format((float)($o->total_amount), 2),
                    'at' => optional($o->created_at)->toIso8601String(),
                ];
            });

        $pendingOrders = Schema::hasTable('orders')
            ? Order::where('buyer_id', $user->id)->where('status', 'pending')->count()
            : 0;
        $likedStories = Schema::hasTable('story_likes')
            ? StoryLike::where('user_id', $user->id)->count()
            : 0;
        $campaignsSupported = Schema::hasTable('donations')
            ? Donation::where('donor_id', $user->id)->distinct('campaign_id')->count('campaign_id')
            : 0;

        return response()->json([
            'itemsPurchased' => $itemsPurchased,
            'favorites' => $favorites,
            'totalSpent' => $totalSpent,
            'community' => [
                'pendingOrders' => $pendingOrders,
                'storiesViewed' => $likedStories,
                'totalCampaignsSupported' => $campaignsSupported,
            ],
            'activity' => $recentOrders->values()->all(),
        ]);
    }
}
