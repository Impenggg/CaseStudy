<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Public API Routes (no authentication required)

// Products
Route::get('/products', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'title' => 'Traditional Ikat Weaving',
                'price' => 2500,
                'category' => 'Traditional Textiles',
                'artisan' => 'Maria Santos',
                'location' => 'Bontoc, Mountain Province',
                'description' => 'Authentic handwoven ikat textile featuring traditional geometric patterns passed down through generations.',
                'images' => [
                    'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
                ],
                'stock' => 5,
                'featured' => true
            ],
            [
                'id' => 2,
                'title' => 'Cordillera Blanket',
                'price' => 1800,
                'category' => 'Home Textiles',
                'artisan' => 'Rosa Dulawan',
                'location' => 'Sagada, Mountain Province',
                'description' => 'Warm and comfortable blanket woven with traditional patterns.',
                'images' => [
                    'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800'
                ],
                'stock' => 8,
                'featured' => false
            ],
            [
                'id' => 3,
                'title' => 'Woven Table Runner',
                'price' => 850,
                'category' => 'Home Decor',
                'artisan' => 'Elena Badiw',
                'location' => 'Banaue, Ifugao',
                'description' => 'Elegant table runner featuring intricate traditional motifs.',
                'images' => [
                    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
                ],
                'stock' => 12,
                'featured' => true
            ]
        ]
    ]);
});

Route::get('/products/{id}', function ($id) {
    $products = [
        1 => [
            'id' => 1,
            'title' => 'Traditional Ikat Weaving',
            'price' => 2500,
            'category' => 'Traditional Textiles',
            'artisan' => 'Maria Santos',
            'location' => 'Bontoc, Mountain Province',
            'description' => 'Authentic handwoven ikat textile featuring traditional geometric patterns passed down through generations.',
            'images' => [
                'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
                'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
            ],
            'stock' => 5,
            'featured' => true
        ]
    ];
    
    return response()->json(['data' => $products[$id] ?? null]);
});

// Stories
Route::get('/stories', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'title' => 'The Legacy of Ikat Weaving',
                'author' => 'Maria Santos',
                'location' => 'Bontoc, Mountain Province',
                'content' => 'For generations, our family has preserved the ancient art of ikat weaving...',
                'image' => 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
                'created_at' => '2024-01-15',
                'category' => 'Traditional Arts'
            ],
            [
                'id' => 2,
                'title' => 'Preserving Cultural Heritage',
                'author' => 'Rosa Dulawan',
                'location' => 'Sagada, Mountain Province',
                'content' => 'Our cultural heritage is more than just fabric and patterns...',
                'image' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800',
                'created_at' => '2024-01-10',
                'category' => 'Culture'
            ]
        ]
    ]);
});

Route::get('/stories/{id}', function ($id) {
    $stories = [
        1 => [
            'id' => 1,
            'title' => 'The Legacy of Ikat Weaving',
            'author' => 'Maria Santos',
            'location' => 'Bontoc, Mountain Province',
            'content' => 'For generations, our family has preserved the ancient art of ikat weaving...',
            'image' => 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
            'created_at' => '2024-01-15',
            'category' => 'Traditional Arts'
        ]
    ];
    
    return response()->json(['data' => $stories[$id] ?? null]);
});

// Campaigns
Route::get('/campaigns', function () {
    return response()->json([
        'data' => [
            [
                'id' => 1,
                'title' => 'Support Traditional Weaving Education',
                'organizer' => 'Cordillera Weaving Collective',
                'description' => 'Help us establish a weaving school to teach young people traditional techniques.',
                'goal_amount' => 50000,
                'current_amount' => 32500,
                'image' => 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
                'created_at' => '2024-01-01',
                'end_date' => '2024-12-31',
                'category' => 'Education'
            ],
            [
                'id' => 2,
                'title' => 'Preserve Ancient Looms',
                'organizer' => 'Mountain Province Heritage Foundation',
                'description' => 'Restore and maintain traditional wooden looms for future generations.',
                'goal_amount' => 25000,
                'current_amount' => 18750,
                'image' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800',
                'created_at' => '2024-02-01',
                'end_date' => '2024-11-30',
                'category' => 'Preservation'
            ]
        ]
    ]);
});

Route::get('/campaigns/{id}', function ($id) {
    $campaigns = [
        1 => [
            'id' => 1,
            'title' => 'Support Traditional Weaving Education',
            'organizer' => 'Cordillera Weaving Collective',
            'description' => 'Help us establish a weaving school to teach young people traditional techniques.',
            'goal_amount' => 50000,
            'current_amount' => 32500,
            'image' => 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
            'created_at' => '2024-01-01',
            'end_date' => '2024-12-31',
            'category' => 'Education'
        ]
    ];
    
    return response()->json(['data' => $campaigns[$id] ?? null]);
});

// Orders
Route::post('/orders', function (Request $request) {
    return response()->json([
        'message' => 'Order placed successfully',
        'order_id' => rand(1000, 9999)
    ]);
});

// Donations
Route::post('/donations', function (Request $request) {
    return response()->json([
        'message' => 'Donation processed successfully',
        'donation_id' => rand(1000, 9999)
    ]);
});
