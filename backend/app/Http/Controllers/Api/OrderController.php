<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    /**
     * Display a listing of orders.
     */
    public function index(Request $request): JsonResponse
    {
        $query = Order::with(['product', 'buyer']);

        $perPage = $request->get('per_page', 12);
        $orders = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'total_pages' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total_count' => $orders->total(),
            ],
        ]);
    }

    /**
     * Store multiple orders in a single transaction (batch checkout).
     */
    public function batchStore(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array',
            'shipping_address.street' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.province' => 'required|string',
            'shipping_address.postal_code' => 'required|string',
            'shipping_address.country' => 'required|string',
            'shipping_address.phone' => 'nullable|string',
            'payment_method' => 'required|string',
        ]);

        $items = collect($validated['items']);
        $productIds = $items->pluck('product_id')->unique()->values()->all();

        // Perform all operations in a single DB transaction with row-level locks
        $createdIds = DB::transaction(function () use ($items, $productIds, $validated) {
            // Lock products for update to prevent race conditions
            $products = Product::whereIn('id', $productIds)->lockForUpdate()->get()->keyBy('id');

            // Stock check
            foreach ($items as $it) {
                $product = $products->get($it['product_id']);
                if (!$product) {
                    abort(400, 'Product not found in batch');
                }
                if ($product->stock_quantity < $it['quantity']) {
                    abort(400, 'Insufficient stock for product ID ' . $product->id);
                }
            }

            // Create orders and decrement stock
            $ids = [];
            foreach ($items as $it) {
                $product = $products->get($it['product_id']);
                $totalAmount = $product->price * $it['quantity'];
                $order = Order::create([
                    'product_id' => $product->id,
                    'buyer_id' => Auth::id(),
                    'quantity' => $it['quantity'],
                    'total_amount' => $totalAmount,
                    'shipping_address' => $validated['shipping_address'],
                    'payment_method' => $validated['payment_method'],
                ]);
                $ids[] = $order->id;

                // decrement stock
                $product->decrement('stock_quantity', $it['quantity']);
            }

            return $ids;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Batch order placed successfully',
            'data' => [ 'order_ids' => $createdIds ],
        ], 201);
    }

    /**
     * Store a newly created order.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
            'shipping_address' => 'required|array',
            'shipping_address.street' => 'required|string',
            'shipping_address.city' => 'required|string',
            'shipping_address.province' => 'required|string',
            'shipping_address.postal_code' => 'required|string',
            'shipping_address.country' => 'required|string',
            'shipping_address.phone' => 'nullable|string',
            'payment_method' => 'required|string',
        ]);

        $product = Product::findOrFail($request->product_id);

        // Check stock availability
        if ($product->stock_quantity < $request->quantity) {
            return response()->json([
                'status' => 'error',
                'message' => 'Insufficient stock',
            ], 400);
        }

        $totalAmount = $product->price * $request->quantity;

        $orderId = DB::transaction(function () use ($request, $product, $totalAmount) {
            // Create order
            $order = Order::create([
                'product_id' => $request->product_id,
                'buyer_id' => Auth::id(),
                'quantity' => $request->quantity,
                'total_amount' => $totalAmount,
                'shipping_address' => $request->shipping_address,
                'payment_method' => $request->payment_method,
            ]);

            // Update product stock
            $product->decrement('stock_quantity', $request->quantity);

            return $order->id;
        });

        return response()->json([
            'status' => 'success',
            'message' => 'Order placed successfully',
            'data' => [ 'order_id' => $orderId ],
        ], 201);
    }

    /**
     * Display the specified order.
     */
    public function show(Order $order): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $order->load(['product', 'buyer']),
        ]);
    }

    /**
     * Update the specified order.
     */
    public function update(Request $request, Order $order): JsonResponse
    {
        $request->validate([
            'status' => 'sometimes|in:pending,processing,shipped,delivered,cancelled',
            'tracking_number' => 'nullable|string',
        ]);

        $order->update($request->all());

        return response()->json([
            'status' => 'success',
            'message' => 'Order updated successfully',
            'data' => $order->load(['product', 'buyer']),
        ]);
    }

    /**
     * Get user's own orders.
     */
    public function myOrders(Request $request): JsonResponse
    {
        $query = Order::where('buyer_id', Auth::id())->with(['product']);

        $perPage = $request->get('per_page', 12);
        $orders = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'total_pages' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total_count' => $orders->total(),
            ],
        ]);
    }

    /**
     * Get user's sales (orders for products they sell).
     */
    public function mySales(Request $request): JsonResponse
    {
        $query = Order::whereHas('product', function ($q) {
            $q->where('user_id', Auth::id());
        })->with(['product', 'buyer']);

        $perPage = $request->get('per_page', 12);
        $orders = $query->paginate($perPage);

        return response()->json([
            'status' => 'success',
            'data' => $orders->items(),
            'pagination' => [
                'current_page' => $orders->currentPage(),
                'total_pages' => $orders->lastPage(),
                'per_page' => $orders->perPage(),
                'total_count' => $orders->total(),
            ],
        ]);
    }
}
