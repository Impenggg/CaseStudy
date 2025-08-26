<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\ProductStoreRequest;
use App\Http\Requests\Product\ProductUpdateRequest;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Product::with(['seller', 'images']);

        // Search
        if ($request->has('search')) {
            $query->search($request->search);
        }

        // Category filter
        if ($request->has('category')) {
            $query->byCategory($request->category);
        }

        // Price range filter
        if ($request->has('min_price')) {
            $query->where('price', '>=', $request->min_price);
        }
        if ($request->has('max_price')) {
            $query->where('price', '<=', $request->max_price);
        }

        // Featured filter
        if ($request->has('featured')) {
            $query->featured();
        }

        // Sort
        $sortBy = $request->get('sort_by', 'newest');
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popularity':
                $query->withCount('orders')->orderBy('orders_count', 'desc');
                break;
            default:
                $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'total_pages' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total_count' => $products->total(),
            ],
        ]);
    }

    /**
     * Store a newly created product.
     */
    public function store(ProductStoreRequest $request): JsonResponse
    {
        // Only allow weavers (and admins if applicable) to create
        $user = Auth::user();
        if (!$user || !in_array($user->role, ['weaver', 'admin'])) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validated();

        // Handle image upload if present
        $imagePath = null;
        if ($request->hasFile('image')) {
            $stored = $request->file('image')->store('products', 'public'); // products/<file>
            $imagePath = 'storage/' . $stored; // storage/products/<file>
        }

        // Normalize complex fields for multipart
        if (isset($validated['dimensions']) && is_string($validated['dimensions'])) {
            $decoded = json_decode($validated['dimensions'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $validated['dimensions'] = $decoded;
            } else {
                unset($validated['dimensions']);
            }
        }

        $product = Product::create(array_merge(
            $validated,
            [
                'image' => $imagePath ?? ($request->string('image')->isNotEmpty() ? $request->string('image')->toString() : null),
                'user_id' => $user->id,
            ]
        ));

        return response()->json([
            'status' => 'success',
            'message' => 'Product created successfully',
            'data' => $product->load(['seller', 'images']),
        ], 201);
    }

    /**
     * Display the specified product.
     */
    public function show(Product $product): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $product->load(['seller', 'images']),
        ]);
    }

    /**
     * Update the specified product.
     */
    public function update(ProductUpdateRequest $request, Product $product): JsonResponse
    {
        // Check if user owns the product or is admin
        $user = Auth::user();
        if (!$user || ($product->user_id !== $user->id && $user->role !== 'admin')) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $validated = $request->validated();

        $payload = $validated;
        if (isset($payload['dimensions']) && is_string($payload['dimensions'])) {
            $decoded = json_decode($payload['dimensions'], true);
            if (json_last_error() === JSON_ERROR_NONE) {
                $payload['dimensions'] = $decoded;
            } else {
                unset($payload['dimensions']);
            }
        }
        if ($request->hasFile('image')) {
            $stored = $request->file('image')->store('products', 'public');
            $payload['image'] = 'storage/' . $stored;
        } elseif ($request->has('image') && is_string($request->input('image'))) {
            // allow direct string path update if provided
            $payload['image'] = $request->input('image');
        }

        $product->update($payload);

        return response()->json([
            'status' => 'success',
            'message' => 'Product updated successfully',
            'data' => $product->load(['seller', 'images']),
        ]);
    }

    /**
     * Remove the specified product.
     */
    public function destroy(Product $product): JsonResponse
    {
        // Check if user owns the product
        if ($product->user_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $product->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Product deleted successfully',
        ]);
    }

    /**
     * Get user's own products.
     */
    public function myProducts(Request $request): JsonResponse
    {
        $query = Product::where('user_id', Auth::id())->with(['images']);

        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $products->items(),
            'pagination' => [
                'current_page' => $products->currentPage(),
                'total_pages' => $products->lastPage(),
                'per_page' => $products->perPage(),
                'total_count' => $products->total(),
            ],
        ]);
    }
}
