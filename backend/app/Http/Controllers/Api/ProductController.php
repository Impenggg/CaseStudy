<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
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
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'cultural_background' => 'nullable|string',
            'materials' => 'required|array',
            'materials.*' => 'string',
            'care_instructions' => 'required|string',
            'image' => 'nullable|string',
            'stock_quantity' => 'required|integer|min:0',
            'dimensions' => 'nullable|array',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
        ]);

        $product = Product::create([
            ...$request->all(),
            'user_id' => Auth::id(),
        ]);

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
    public function update(Request $request, Product $product): JsonResponse
    {
        // Check if user owns the product
        if ($product->user_id !== Auth::id()) {
            return response()->json([
                'status' => 'error',
                'message' => 'Unauthorized',
            ], 403);
        }

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'cultural_background' => 'nullable|string',
            'materials' => 'sometimes|array',
            'materials.*' => 'string',
            'care_instructions' => 'sometimes|string',
            'image' => 'nullable|string',
            'stock_quantity' => 'sometimes|integer|min:0',
            'dimensions' => 'nullable|array',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
        ]);

        $product->update($request->all());

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
