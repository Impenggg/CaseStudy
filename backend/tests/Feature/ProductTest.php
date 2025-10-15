<?php

namespace Tests\Feature;

use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class ProductTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test weaver can create a product.
     */
    public function test_weaver_can_create_product(): void
    {
        Storage::fake('public');
        $weaver = User::factory()->create(['role' => 'weaver']);

        $response = $this->actingAs($weaver, 'sanctum')
            ->postJson('/api/products', [
                'title' => 'Traditional Handwoven Blanket',
                'description' => 'Beautiful handwoven blanket with traditional patterns',
                'price' => 150.00,
                'stock_quantity' => 10,
                'category' => 'blankets',
                'weaving_technique' => 'backstrap',
                'pattern_name' => 'Inabel',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'id',
                    'title',
                    'price',
                    'stock_quantity',
                    'moderation_status',
                ]
            ]);

        $this->assertDatabaseHas('products', [
            'title' => 'Traditional Handwoven Blanket',
            'user_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);
    }

    /**
     * Test admin created product is auto-approved.
     */
    public function test_admin_created_product_is_auto_approved(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/products', [
                'title' => 'Admin Product',
                'description' => 'Product created by admin',
                'price' => 100.00,
                'stock_quantity' => 5,
                'category' => 'textiles',
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('products', [
            'title' => 'Admin Product',
            'moderation_status' => 'approved',
        ]);
    }

    /**
     * Test buyer cannot create products.
     */
    public function test_buyer_cannot_create_product(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/products', [
                'title' => 'Test Product',
                'description' => 'Test description',
                'price' => 50.00,
                'stock_quantity' => 5,
                'category' => 'textiles',
            ]);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'Unauthorized',
            ]);
    }

    /**
     * Test guest can view approved products.
     */
    public function test_guest_can_view_approved_products(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'title' => 'Approved Product',
        ]);

        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'pending',
            'title' => 'Pending Product',
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Approved Product'])
            ->assertJsonMissing(['title' => 'Pending Product']);
    }

    /**
     * Test product search functionality.
     */
    public function test_products_can_be_searched(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'title' => 'Traditional Blanket',
        ]);

        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'title' => 'Modern Scarf',
        ]);

        $response = $this->getJson('/api/products?search=Blanket');

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Traditional Blanket'])
            ->assertJsonMissing(['title' => 'Modern Scarf']);
    }

    /**
     * Test product category filtering.
     */
    public function test_products_can_be_filtered_by_category(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'category' => 'blankets',
        ]);

        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'category' => 'textiles',
        ]);

        $response = $this->getJson('/api/products?category=blankets');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertEquals('blankets', $data[0]['category']);
    }

    /**
     * Test product price range filtering.
     */
    public function test_products_can_be_filtered_by_price_range(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'price' => 50.00,
        ]);

        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'price' => 150.00,
        ]);

        $response = $this->getJson('/api/products?min_price=100&max_price=200');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertEquals(150.00, $data[0]['price']);
    }

    /**
     * Test product sorting by price.
     */
    public function test_products_can_be_sorted_by_price(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'price' => 100.00,
        ]);

        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'price' => 50.00,
        ]);

        $response = $this->getJson('/api/products?sort_by=price_asc');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertEquals(50.00, $data[0]['price']);
        $this->assertEquals(100.00, $data[1]['price']);
    }

    /**
     * Test owner can update their product.
     */
    public function test_owner_can_update_product(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create(['user_id' => $weaver->id]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->putJson("/api/products/{$product->id}", [
                'title' => 'Updated Title',
                'price' => 200.00,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'Updated Title',
                'price' => 200.00,
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'title' => 'Updated Title',
            'price' => 200.00,
        ]);
    }

    /**
     * Test non-owner cannot update product.
     */
    public function test_non_owner_cannot_update_product(): void
    {
        $weaver1 = User::factory()->create(['role' => 'weaver']);
        $weaver2 = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create(['user_id' => $weaver1->id]);

        $response = $this->actingAs($weaver2, 'sanctum')
            ->putJson("/api/products/{$product->id}", [
                'title' => 'Updated Title',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test owner can delete their product.
     */
    public function test_owner_can_delete_product(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create(['user_id' => $weaver->id]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->deleteJson("/api/products/{$product->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Product deleted successfully',
            ]);

        $this->assertDatabaseMissing('products', [
            'id' => $product->id,
        ]);
    }

    /**
     * Test weaver can view their own products.
     */
    public function test_weaver_can_view_own_products(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $otherWeaver = User::factory()->create(['role' => 'weaver']);

        Product::factory()->count(3)->create(['user_id' => $weaver->id]);
        Product::factory()->count(2)->create(['user_id' => $otherWeaver->id]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->getJson('/api/my-products');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(3, $data);
    }

    /**
     * Test product validation rules.
     */
    public function test_product_creation_validates_required_fields(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);

        $response = $this->actingAs($weaver, 'sanctum')
            ->postJson('/api/products', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'description', 'price', 'stock_quantity']);
    }

    /**
     * Test product price must be positive.
     */
    public function test_product_price_must_be_positive(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);

        $response = $this->actingAs($weaver, 'sanctum')
            ->postJson('/api/products', [
                'title' => 'Test Product',
                'description' => 'Test description',
                'price' => -10.00,
                'stock_quantity' => 5,
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['price']);
    }

    /**
     * Test pagination works correctly.
     */
    public function test_products_are_paginated(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        Product::factory()->count(20)->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
        ]);

        $response = $this->getJson('/api/products?per_page=10');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data',
                'pagination' => [
                    'current_page',
                    'total_pages',
                    'per_page',
                    'total_count',
                ]
            ]);

        $pagination = $response->json('pagination');
        $this->assertEquals(1, $pagination['current_page']);
        $this->assertEquals(2, $pagination['total_pages']);
        $this->assertEquals(20, $pagination['total_count']);
    }
}

