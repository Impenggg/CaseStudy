<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\CartItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'shipping_address' => 'required|string',
            'city' => 'required|string',
            'postal_code' => 'required|string',
            'payment_method' => 'required|in:cash_on_delivery,credit_card'
        ]);

        try {
            DB::beginTransaction();

            $cartItems = CartItem::where('user_id', auth()->id())
                ->with('product')
                ->get();

            if ($cartItems->isEmpty()) {
                return response()->json(['message' => 'Cart is empty'], 400);
            }

            $totalAmount = $cartItems->sum(function ($item) {
                return $item->product->price * $item->quantity;
            });

            $order = Order::create([
                'user_id' => auth()->id(),
                'total_amount' => $totalAmount,
                'shipping_address' => $validated['shipping_address'],
                'city' => $validated['city'],
                'postal_code' => $validated['postal_code'],
                'payment_method' => $validated['payment_method'],
                'status' => 'pending'
            ]);

            foreach ($cartItems as $item) {
                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $item->product_id,
                    'quantity' => $item->quantity,
                    'price' => $item->product->price
                ]);
            }

            // Clear the cart
            CartItem::where('user_id', auth()->id())->delete();

            DB::commit();

            return response()->json(['message' => 'Order placed successfully', 'order' => $order], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to place order'], 500);
        }
    }
}
