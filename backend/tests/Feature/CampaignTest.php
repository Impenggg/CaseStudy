<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class CampaignTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test weaver can create a campaign.
     */
    public function test_weaver_can_create_campaign(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);

        $response = $this->actingAs($weaver, 'sanctum')
            ->postJson('/api/campaigns', [
                'title' => 'Save Traditional Weaving',
                'description' => 'Help preserve traditional weaving techniques',
                'goal_amount' => 5000.00,
                'category' => 'cultural_preservation',
                'start_date' => now()->format('Y-m-d'),
                'end_date' => now()->addDays(30)->format('Y-m-d'),
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'id',
                    'title',
                    'goal_amount',
                    'current_amount',
                    'backers_count',
                    'moderation_status',
                ]
            ]);

        $this->assertDatabaseHas('campaigns', [
            'title' => 'Save Traditional Weaving',
            'organizer_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);
    }

    /**
     * Test buyer cannot create campaigns.
     */
    public function test_buyer_cannot_create_campaign(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/campaigns', [
                'title' => 'Test Campaign',
                'description' => 'Test description',
                'goal_amount' => 1000.00,
                'category' => 'cultural_preservation',
                'start_date' => now()->format('Y-m-d'),
                'end_date' => now()->addDays(30)->format('Y-m-d'),
            ]);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'Unauthorized',
            ]);
    }

    /**
     * Test admin created campaign is auto-approved.
     */
    public function test_admin_created_campaign_is_auto_approved(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/campaigns', [
                'title' => 'Admin Campaign',
                'description' => 'Campaign created by admin',
                'goal_amount' => 3000.00,
                'category' => 'cultural_preservation',
                'start_date' => now()->format('Y-m-d'),
                'end_date' => now()->addDays(30)->format('Y-m-d'),
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('campaigns', [
            'title' => 'Admin Campaign',
            'moderation_status' => 'approved',
        ]);
    }

    /**
     * Test guest can view approved campaigns.
     */
    public function test_guest_can_view_approved_campaigns(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
            'title' => 'Approved Campaign',
        ]);

        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'pending',
            'title' => 'Pending Campaign',
        ]);

        $response = $this->getJson('/api/campaigns');

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Approved Campaign'])
            ->assertJsonMissing(['title' => 'Pending Campaign']);
    }

    /**
     * Test campaign search functionality.
     */
    public function test_campaigns_can_be_searched(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
            'title' => 'Traditional Weaving Preservation',
        ]);

        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
            'title' => 'Modern Art Initiative',
        ]);

        $response = $this->getJson('/api/campaigns?search=Weaving');

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Traditional Weaving Preservation'])
            ->assertJsonMissing(['title' => 'Modern Art Initiative']);
    }

    /**
     * Test campaign category filtering.
     */
    public function test_campaigns_can_be_filtered_by_category(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
            'category' => 'cultural_preservation',
        ]);

        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
            'category' => 'education',
        ]);

        $response = $this->getJson('/api/campaigns?category=cultural_preservation');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertEquals('cultural_preservation', $data[0]['category']);
    }

    /**
     * Test campaign sorting by ending soon.
     */
    public function test_campaigns_can_be_sorted_by_ending_soon(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
            'end_date' => now()->addDays(10),
        ]);

        Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
            'end_date' => now()->addDays(5),
        ]);

        $response = $this->getJson('/api/campaigns?sort_by=ending_soon');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        // First campaign should be the one ending sooner
        $this->assertEquals(now()->addDays(5)->format('Y-m-d'), 
            \Carbon\Carbon::parse($data[0]['end_date'])->format('Y-m-d'));
    }

    /**
     * Test organizer can update their campaign.
     */
    public function test_organizer_can_update_campaign(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $campaign = Campaign::factory()->create(['organizer_id' => $weaver->id]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->putJson("/api/campaigns/{$campaign->id}", [
                'title' => 'Updated Campaign Title',
                'goal_amount' => 10000.00,
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'Updated Campaign Title',
                'goal_amount' => 10000.00,
            ]);

        $this->assertDatabaseHas('campaigns', [
            'id' => $campaign->id,
            'title' => 'Updated Campaign Title',
        ]);
    }

    /**
     * Test non-organizer cannot update campaign.
     */
    public function test_non_organizer_cannot_update_campaign(): void
    {
        $weaver1 = User::factory()->create(['role' => 'weaver']);
        $weaver2 = User::factory()->create(['role' => 'weaver']);
        $campaign = Campaign::factory()->create(['organizer_id' => $weaver1->id]);

        $response = $this->actingAs($weaver2, 'sanctum')
            ->putJson("/api/campaigns/{$campaign->id}", [
                'title' => 'Updated Title',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test organizer can delete their campaign.
     */
    public function test_organizer_can_delete_campaign(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $campaign = Campaign::factory()->create(['organizer_id' => $weaver->id]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->deleteJson("/api/campaigns/{$campaign->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Campaign deleted successfully',
            ]);

        $this->assertDatabaseMissing('campaigns', [
            'id' => $campaign->id,
        ]);
    }

    /**
     * Test weaver can view their own campaigns.
     */
    public function test_weaver_can_view_own_campaigns(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $otherWeaver = User::factory()->create(['role' => 'weaver']);

        Campaign::factory()->count(3)->create(['organizer_id' => $weaver->id]);
        Campaign::factory()->count(2)->create(['organizer_id' => $otherWeaver->id]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->getJson('/api/my-campaigns');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(3, $data);
    }

    /**
     * Test campaign validation rules.
     */
    public function test_campaign_creation_validates_required_fields(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);

        $response = $this->actingAs($weaver, 'sanctum')
            ->postJson('/api/campaigns', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'description', 'goal_amount']);
    }

    /**
     * Test campaign goal amount must be positive.
     */
    public function test_campaign_goal_amount_must_be_positive(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);

        $response = $this->actingAs($weaver, 'sanctum')
            ->postJson('/api/campaigns', [
                'title' => 'Test Campaign',
                'description' => 'Test description',
                'goal_amount' => -1000.00,
                'category' => 'cultural_preservation',
                'start_date' => now()->format('Y-m-d'),
                'end_date' => now()->addDays(30)->format('Y-m-d'),
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['goal_amount']);
    }

    /**
     * Test can fetch all campaigns without pagination.
     */
    public function test_can_fetch_all_campaigns_without_pagination(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        Campaign::factory()->count(15)->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
        ]);

        $response = $this->getJson('/api/campaigns?per_page=all');

        $response->assertStatus(200)
            ->assertJsonStructure([
                'status',
                'data',
                'pagination',
            ]);

        $data = $response->json('data');
        $this->assertCount(15, $data);
        $this->assertNull($response->json('pagination'));
    }
}

