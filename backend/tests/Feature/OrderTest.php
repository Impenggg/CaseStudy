<?php

namespace Tests\Feature;

use App\Models\Order;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class OrderTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test authenticated user can place an order.
     */
    public function test_authenticated_user_can_place_order(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create([
            'user_id' => $weaver->id,
            'price' => 100.00,
            'stock_quantity' => 10,
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/orders', [
                'product_id' => $product->id,
                'quantity' => 2,
                'shipping_address' => [
                    'street' => '123 Main St',
                    'city' => 'Baguio',
                    'province' => 'Benguet',
                    'postal_code' => '2600',
                    'country' => 'Philippines',
                    'phone' => '+639123456789',
                ],
                'payment_method' => 'card',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => ['order_id']
            ]);

        $this->assertDatabaseHas('orders', [
            'product_id' => $product->id,
            'buyer_id' => $buyer->id,
            'quantity' => 2,
            'total_amount' => 200.00,
        ]);
    }

    /**
     * Test order reduces product stock.
     */
    public function test_order_reduces_product_stock(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create([
            'user_id' => $weaver->id,
            'price' => 100.00,
            'stock_quantity' => 10,
        ]);

        $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/orders', [
                'product_id' => $product->id,
                'quantity' => 3,
                'shipping_address' => [
                    'street' => '123 Main St',
                    'city' => 'Baguio',
                    'province' => 'Benguet',
                    'postal_code' => '2600',
                    'country' => 'Philippines',
                ],
                'payment_method' => 'card',
            ]);

        $product->refresh();
        $this->assertEquals(7, $product->stock_quantity);
    }

    /**
     * Test cannot order more than available stock.
     */
    public function test_cannot_order_more_than_available_stock(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create([
            'user_id' => $weaver->id,
            'price' => 100.00,
            'stock_quantity' => 5,
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/orders', [
                'product_id' => $product->id,
                'quantity' => 10,
                'shipping_address' => [
                    'street' => '123 Main St',
                    'city' => 'Baguio',
                    'province' => 'Benguet',
                    'postal_code' => '2600',
                    'country' => 'Philippines',
                ],
                'payment_method' => 'card',
            ]);

        $response->assertStatus(400)
            ->assertJson([
                'status' => 'error',
                'message' => 'Insufficient stock',
            ]);
    }

    /**
     * Test batch order creation (cart checkout).
     */
    public function test_batch_order_creation(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $product1 = Product::factory()->create([
            'user_id' => $weaver->id,
            'price' => 100.00,
            'stock_quantity' => 10,
        ]);

        $product2 = Product::factory()->create([
            'user_id' => $weaver->id,
            'price' => 50.00,
            'stock_quantity' => 20,
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/orders/batch', [
                'items' => [
                    [
                        'product_id' => $product1->id,
                        'quantity' => 2,
                    ],
                    [
                        'product_id' => $product2->id,
                        'quantity' => 3,
                    ],
                ],
                'shipping_address' => [
                    'street' => '123 Main St',
                    'city' => 'Baguio',
                    'province' => 'Benguet',
                    'postal_code' => '2600',
                    'country' => 'Philippines',
                ],
                'payment_method' => 'card',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => ['order_ids']
            ]);

        $orderIds = $response->json('data.order_ids');
        $this->assertCount(2, $orderIds);

        // Verify stock was reduced
        $product1->refresh();
        $product2->refresh();
        $this->assertEquals(8, $product1->stock_quantity);
        $this->assertEquals(17, $product2->stock_quantity);
    }

    /**
     * Test batch order fails if any product lacks stock.
     */
    public function test_batch_order_fails_if_insufficient_stock(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $product1 = Product::factory()->create([
            'user_id' => $weaver->id,
            'price' => 100.00,
            'stock_quantity' => 10,
        ]);

        $product2 = Product::factory()->create([
            'user_id' => $weaver->id,
            'price' => 50.00,
            'stock_quantity' => 2,
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/orders/batch', [
                'items' => [
                    [
                        'product_id' => $product1->id,
                        'quantity' => 2,
                    ],
                    [
                        'product_id' => $product2->id,
                        'quantity' => 5, // More than available
                    ],
                ],
                'shipping_address' => [
                    'street' => '123 Main St',
                    'city' => 'Baguio',
                    'province' => 'Benguet',
                    'postal_code' => '2600',
                    'country' => 'Philippines',
                ],
                'payment_method' => 'card',
            ]);

        $response->assertStatus(400);

        // Verify no orders were created (transaction rollback)
        $this->assertEquals(0, Order::count());
        
        // Verify stock wasn't reduced
        $product1->refresh();
        $product2->refresh();
        $this->assertEquals(10, $product1->stock_quantity);
        $this->assertEquals(2, $product2->stock_quantity);
    }

    /**
     * Test buyer can view their orders.
     */
    public function test_buyer_can_view_own_orders(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $otherBuyer = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create(['user_id' => $weaver->id]);

        Order::factory()->count(3)->create([
            'buyer_id' => $buyer->id,
            'product_id' => $product->id,
        ]);

        Order::factory()->count(2)->create([
            'buyer_id' => $otherBuyer->id,
            'product_id' => $product->id,
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->getJson('/api/my-orders');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(3, $data);
    }

    /**
     * Test seller can view their sales.
     */
    public function test_seller_can_view_sales(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $weaver1 = User::factory()->create(['role' => 'weaver']);
        $weaver2 = User::factory()->create(['role' => 'weaver']);
        
        $product1 = Product::factory()->create(['user_id' => $weaver1->id]);
        $product2 = Product::factory()->create(['user_id' => $weaver2->id]);

        Order::factory()->count(3)->create([
            'buyer_id' => $buyer->id,
            'product_id' => $product1->id,
        ]);

        Order::factory()->count(2)->create([
            'buyer_id' => $buyer->id,
            'product_id' => $product2->id,
        ]);

        $response = $this->actingAs($weaver1, 'sanctum')
            ->getJson('/api/my-sales');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(3, $data);
    }

    /**
     * Test order status can be updated.
     */
    public function test_order_status_can_be_updated(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create(['user_id' => $weaver->id]);
        
        $order = Order::factory()->create([
            'buyer_id' => $buyer->id,
            'product_id' => $product->id,
            'status' => 'pending',
        ]);

        $response = $this->actingAs($buyer, 'sanctum')
            ->putJson("/api/orders/{$order->id}", [
                'status' => 'shipped',
                'tracking_number' => 'TRACK123456',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('orders', [
            'id' => $order->id,
            'status' => 'shipped',
            'tracking_number' => 'TRACK123456',
        ]);
    }

    /**
     * Test order validation rules.
     */
    public function test_order_validates_required_fields(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/orders', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors([
                'product_id',
                'quantity',
                'shipping_address',
                'payment_method',
            ]);
    }

    /**
     * Test order total is calculated correctly.
     */
    public function test_order_total_calculated_correctly(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create([
            'user_id' => $weaver->id,
            'price' => 125.50,
            'stock_quantity' => 10,
        ]);

        $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/orders', [
                'product_id' => $product->id,
                'quantity' => 4,
                'shipping_address' => [
                    'street' => '123 Main St',
                    'city' => 'Baguio',
                    'province' => 'Benguet',
                    'postal_code' => '2600',
                    'country' => 'Philippines',
                ],
                'payment_method' => 'card',
            ]);

        $this->assertDatabaseHas('orders', [
            'product_id' => $product->id,
            'quantity' => 4,
            'total_amount' => 502.00, // 125.50 * 4
        ]);
    }
}

