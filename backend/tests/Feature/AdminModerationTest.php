<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Product;
use App\Models\Story;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class AdminModerationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test admin can view pending products.
     */
    public function test_admin_can_view_pending_products(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create(['role' => 'weaver']);

        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/moderation/products');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        // Should only return pending products
        $this->assertCount(1, $data);
        $this->assertEquals('pending', $data[0]['moderation_status']);
    }

    /**
     * Test non-admin cannot access moderation endpoints.
     */
    public function test_non_admin_cannot_access_moderation(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($buyer, 'sanctum')
            ->getJson('/api/admin/moderation/products');

        $response->assertStatus(403);
    }

    /**
     * Test admin can approve a product.
     */
    public function test_admin_can_approve_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $product = Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/moderation/products/{$product->id}/approve");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'moderation_status' => 'approved',
        ]);
    }

    /**
     * Test admin can reject a product.
     */
    public function test_admin_can_reject_product(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $product = Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/moderation/products/{$product->id}/reject", [
                'reason' => 'Does not meet quality standards',
            ]);

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
            ]);

        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'moderation_status' => 'rejected',
        ]);
    }

    /**
     * Test admin can view pending campaigns.
     */
    public function test_admin_can_view_pending_campaigns(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create(['role' => 'weaver']);

        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/moderation/campaigns');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertEquals('pending', $data[0]['moderation_status']);
    }

    /**
     * Test admin can approve a campaign.
     */
    public function test_admin_can_approve_campaign(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $campaign = Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/moderation/campaigns/{$campaign->id}/approve");

        $response->assertStatus(200);

        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'moderation_status' => 'approved',
        ]);
    }

    /**
     * Test admin can reject a campaign.
     */
    public function test_admin_can_reject_campaign(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $campaign = Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/moderation/campaigns/{$campaign->id}/reject", [
                'reason' => 'Incomplete information',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'moderation_status' => 'rejected',
        ]);
    }

    /**
     * Test admin can view pending stories.
     */
    public function test_admin_can_view_pending_stories(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create(['role' => 'weaver']);

        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/moderation/stories');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertEquals('pending', $data[0]['moderation_status']);
    }

    /**
     * Test admin can approve a story.
     */
    public function test_admin_can_approve_story(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $story = Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/moderation/stories/{$story->id}/approve");

        $response->assertStatus(200);

        $this->assertDatabaseHas('stories', [
            'id' => $story->id,
            'moderation_status' => 'approved',
        ]);
    }

    /**
     * Test admin can reject a story.
     */
    public function test_admin_can_reject_story(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $story = Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/moderation/stories/{$story->id}/reject", [
                'reason' => 'Inappropriate content',
            ]);

        $response->assertStatus(200);

        $this->assertDatabaseHas('stories', [
            'id' => $story->id,
            'moderation_status' => 'rejected',
        ]);
    }

    /**
     * Test weaver cannot approve their own content.
     */
    public function test_weaver_cannot_approve_own_content(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $product = Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->postJson("/api/admin/moderation/products/{$product->id}/approve");

        $response->assertStatus(403);
    }

    /**
     * Test moderation requires authentication.
     */
    public function test_moderation_requires_authentication(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $product = Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        $response = $this->getJson('/api/admin/moderation/products');

        $response->assertStatus(401);
    }

    /**
     * Test moderation list includes creator information.
     */
    public function test_moderation_list_includes_creator_info(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);
        $weaver = User::factory()->create([
            'role' => 'weaver',
            'name' => 'Test Weaver',
        ]);

        Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/moderation/products');

        $response->assertStatus(200)
            ->assertJsonFragment(['name' => 'Test Weaver']);
    }

    /**
     * Test rejected items are not shown in public listings.
     */
    public function test_rejected_items_not_shown_publicly(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $rejectedProduct = Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'rejected',
            'title' => 'Rejected Product',
        ]);

        $approvedProduct = Product::factory()->create([
            'user_id' => $weaver->id,
            'moderation_status' => 'approved',
            'title' => 'Approved Product',
        ]);

        $response = $this->getJson('/api/products');

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Approved Product'])
            ->assertJsonMissing(['title' => 'Rejected Product']);
    }
}

