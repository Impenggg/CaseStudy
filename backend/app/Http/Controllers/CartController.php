<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cartItems = CartItem::with('product')
            ->where('user_id', auth()->id())
            ->get();

        return response()->json($cartItems);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $product = Product::findOrFail($validated['product_id']);

        if ($product->quantity < $validated['quantity']) {
            return response()->json([
                'message' => 'Not enough stock available'
            ], 400);
        }

        $cartItem = CartItem::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'product_id' => $validated['product_id']
            ],
            [
                'quantity' => $validated['quantity']
            ]
        );

        return response()->json($cartItem->load('product'), 201);
    }

    public function update(Request $request, CartItem $cartItem)
    {
        if ($cartItem->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'quantity' => 'required|integer|min:1'
        ]);

        if ($cartItem->product->quantity < $validated['quantity']) {
            return response()->json([
                'message' => 'Not enough stock available'
            ], 400);
        }

        $cartItem->update($validated);

        return response()->json($cartItem->load('product'));
    }

    public function destroy(CartItem $cartItem)
    {
        if ($cartItem->user_id !== auth()->id()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cartItem->delete();

        return response()->json(['message' => 'Item removed from cart']);
    }
} 