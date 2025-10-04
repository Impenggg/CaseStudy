<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\FavoritesController;
use App\Http\Controllers\Api\StoryLikesController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\AdminModerationController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\VerificationController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoryController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\MediaPostController;
use App\Http\Controllers\Api\CampaignExpenditureController;

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

// Public routes (no authentication required)
Route::post('/register', [AuthController::class, 'register']);

Route::post('/login', [AuthController::class, 'login']);

// OTP verification routes (no authentication required)
Route::post('/email/verify/send-otp', [VerificationController::class, 'sendOtp']);
Route::post('/email/verify', [VerificationController::class, 'verifyOtp']);

// Public product routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Public story routes
Route::get('/stories', [StoryController::class, 'index']);
Route::get('/stories/{story}', [StoryController::class, 'show']);

// Public campaign routes
Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{campaign}', [CampaignController::class, 'show']);
Route::get('/campaigns/{campaign}/donations', [DonationController::class, 'campaignDonations']);
Route::get('/campaigns/{campaign}/expenditures', [CampaignExpenditureController::class, 'index']);

// Public uploads listing (for gallery display)
Route::get('/uploads', [UploadController::class, 'index']);


// (Removed test-storage dev route)

// Protected routes (authentication required)
Route::middleware('auth:sanctum')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);
    Route::put('/user', [AuthController::class, 'updateProfile']);

    // User routes
    Route::get('/user/profile', [UserController::class, 'show']);
    Route::put('/user/profile', [UserController::class, 'update']);

    // Product routes (authenticated)
    Route::post('/products', [ProductController::class, 'store']);
    Route::put('/products/{product}', [ProductController::class, 'update']);
    Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    Route::get('/my-products', [ProductController::class, 'myProducts']);

    // Story routes (authenticated)
    Route::post('/stories', [StoryController::class, 'store']);
    Route::put('/stories/{story}', [StoryController::class, 'update']);
    Route::delete('/stories/{story}', [StoryController::class, 'destroy']);
    Route::get('/my-stories', [StoryController::class, 'myStories']);

    // Campaign routes (authenticated)
    Route::post('/campaigns', [CampaignController::class, 'store']);
    Route::put('/campaigns/{campaign}', [CampaignController::class, 'update']);
    Route::delete('/campaigns/{campaign}', [CampaignController::class, 'destroy']);
    Route::get('/my-campaigns', [CampaignController::class, 'myCampaigns']);

    // Order routes
    Route::get('/orders', [OrderController::class, 'index']);
    Route::post('/orders/batch', [OrderController::class, 'batchStore'])->middleware(\App\Http\Middleware\ArtisanRestrict::class);
    Route::post('/orders', [OrderController::class, 'store'])->middleware(\App\Http\Middleware\ArtisanRestrict::class);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::get('/my-sales', [OrderController::class, 'mySales']);

    // Donation routes
    Route::get('/donations', [DonationController::class, 'index']);
    Route::post('/donations', [DonationController::class, 'store'])->middleware(\App\Http\Middleware\ArtisanRestrict::class);
    Route::get('/donations/{donation}', [DonationController::class, 'show']);
    Route::get('/my-donations', [DonationController::class, 'myDonations']);

    // Campaign expenditures (organizer/admin write)
    Route::post('/campaigns/{campaign}/expenditures', [CampaignExpenditureController::class, 'store']);
    Route::put('/campaigns/{campaign}/expenditures/{expenditure}', [CampaignExpenditureController::class, 'update']);
    Route::delete('/campaigns/{campaign}/expenditures/{expenditure}', [CampaignExpenditureController::class, 'destroy']);

    // Upload routes
    Route::post('/upload', [UploadController::class, 'upload']);

    // Media routes (authenticated)
    Route::get('/media', [MediaPostController::class, 'index']);
    Route::get('/media/{media}', [MediaPostController::class, 'show']);
    Route::get('/users/{user}/media', [MediaPostController::class, 'userPosts']);
    Route::post('/media', [MediaPostController::class, 'store']);
    Route::delete('/media/{media}', [MediaPostController::class, 'destroy']);
    Route::post('/media/{media}/react', [MediaPostController::class, 'react']);
    Route::post('/media/{media}/comments', [MediaPostController::class, 'comment']);

    // Dashboard route (authenticated)
    Route::get('/dashboard/{role}', [DashboardController::class, 'show']);

    // Favorites routes (authenticated)
    Route::get('/favorites', [FavoritesController::class, 'index']);
    Route::post('/products/{product}/favorite', [FavoritesController::class, 'toggle']);

    // Story likes routes (authenticated)
    Route::get('/story-likes', [StoryLikesController::class, 'index']);
    Route::post('/stories/{story}/like', [StoryLikesController::class, 'toggle']);

    // Admin moderation routes (admins only)
    Route::middleware('admin')->group(function () {
        Route::get('/admin/moderation/{type}', [AdminModerationController::class, 'list']);
        Route::post('/admin/moderation/{type}/{id}/approve', [AdminModerationController::class, 'approve']);
        Route::post('/admin/moderation/{type}/{id}/reject', [AdminModerationController::class, 'reject']);
    });
});
