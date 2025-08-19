<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ProductController;
use App\Http\Controllers\Api\StoryController;
use App\Http\Controllers\Api\CampaignController;
use App\Http\Controllers\Api\OrderController;
use App\Http\Controllers\Api\DonationController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\MediaPostController;

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

// Public product routes
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{product}', [ProductController::class, 'show']);

// Public story routes
Route::get('/stories', [StoryController::class, 'index']);
Route::get('/stories/{story}', [StoryController::class, 'show']);

// Public campaign routes
Route::get('/campaigns', [CampaignController::class, 'index']);
Route::get('/campaigns/{campaign}', [CampaignController::class, 'show']);

// Public uploads listing (for gallery display)
Route::get('/uploads', [UploadController::class, 'index']);

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
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders/{order}', [OrderController::class, 'show']);
    Route::put('/orders/{order}', [OrderController::class, 'update']);
    Route::get('/my-orders', [OrderController::class, 'myOrders']);
    Route::get('/my-sales', [OrderController::class, 'mySales']);

    // Donation routes
    Route::get('/donations', [DonationController::class, 'index']);
    Route::post('/donations', [DonationController::class, 'store']);
    Route::get('/donations/{donation}', [DonationController::class, 'show']);
    Route::get('/my-donations', [DonationController::class, 'myDonations']);

    // Upload routes
    Route::post('/upload', [UploadController::class, 'upload']);

    // Media routes (authenticated)
    Route::get('/media', [MediaPostController::class, 'index']);
    Route::get('/media/{media}', [MediaPostController::class, 'show']);
    Route::get('/users/{user}/media', [MediaPostController::class, 'userPosts']);
    Route::post('/media', [MediaPostController::class, 'store']);
    Route::post('/media/{media}/react', [MediaPostController::class, 'react']);
    Route::post('/media/{media}/comments', [MediaPostController::class, 'comment']);
});
