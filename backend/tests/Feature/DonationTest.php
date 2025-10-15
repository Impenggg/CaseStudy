<?php

namespace Tests\Feature;

use App\Models\Campaign;
use App\Models\Donation;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class DonationTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test authenticated user can make a donation.
     */
    public function test_authenticated_user_can_make_donation(): void
    {
        $donor = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $campaign = Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
            'goal_amount' => 5000.00,
            'current_amount' => 0,
            'backers_count' => 0,
        ]);

        $response = $this->actingAs($donor, 'sanctum')
            ->postJson('/api/donations', [
                'campaign_id' => $campaign->id,
                'amount' => 100.00,
                'payment_method' => 'card',
                'donor_name' => 'John Doe',
                'donor_email' => 'john@example.com',
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'id',
                    'amount',
                    'campaign_id',
                ]
            ]);

        $this->assertDatabaseHas('donations', [
            'campaign_id' => $campaign->id,
            'donor_id' => $donor->id,
            'amount' => 100.00,
        ]);
    }

    /**
     * Test donation updates campaign totals.
     */
    public function test_donation_updates_campaign_totals(): void
    {
        $donor = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $campaign = Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
            'goal_amount' => 5000.00,
            'current_amount' => 1000.00,
            'backers_count' => 5,
        ]);

        $this->actingAs($donor, 'sanctum')
            ->postJson('/api/donations', [
                'campaign_id' => $campaign->id,
                'amount' => 500.00,
                'payment_method' => 'card',
                'donor_name' => 'Jane Doe',
                'donor_email' => 'jane@example.com',
            ]);

        $campaign->refresh();
        $this->assertEquals(1500.00, $campaign->current_amount);
        $this->assertEquals(6, $campaign->backers_count);
    }

    /**
     * Test user can view their donation history.
     */
    public function test_user_can_view_donation_history(): void
    {
        $donor = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $campaign1 = Campaign::factory()->create(['organizer_id' => $weaver->id]);
        $campaign2 = Campaign::factory()->create(['organizer_id' => $weaver->id]);

        Donation::factory()->create([
            'donor_id' => $donor->id,
            'campaign_id' => $campaign1->id,
            'amount' => 100.00,
        ]);

        Donation::factory()->create([
            'donor_id' => $donor->id,
            'campaign_id' => $campaign2->id,
            'amount' => 200.00,
        ]);

        $response = $this->actingAs($donor, 'sanctum')
            ->getJson('/api/my-donations');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(2, $data);
    }

    /**
     * Test can view campaign donations.
     */
    public function test_can_view_campaign_donations(): void
    {
        $donor1 = User::factory()->create(['role' => 'buyer']);
        $donor2 = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $campaign = Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
        ]);

        Donation::factory()->create([
            'donor_id' => $donor1->id,
            'campaign_id' => $campaign->id,
            'amount' => 100.00,
        ]);

        Donation::factory()->create([
            'donor_id' => $donor2->id,
            'campaign_id' => $campaign->id,
            'amount' => 200.00,
        ]);

        $response = $this->getJson("/api/campaigns/{$campaign->id}/donations");

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(2, $data);
    }

    /**
     * Test donation validation rules.
     */
    public function test_donation_validates_required_fields(): void
    {
        $donor = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($donor, 'sanctum')
            ->postJson('/api/donations', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['campaign_id', 'amount', 'payment_method']);
    }

    /**
     * Test donation amount must be positive.
     */
    public function test_donation_amount_must_be_positive(): void
    {
        $donor = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $campaign = Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
        ]);

        $response = $this->actingAs($donor, 'sanctum')
            ->postJson('/api/donations', [
                'campaign_id' => $campaign->id,
                'amount' => -50.00,
                'payment_method' => 'card',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['amount']);
    }

    /**
     * Test cannot donate to non-existent campaign.
     */
    public function test_cannot_donate_to_non_existent_campaign(): void
    {
        $donor = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($donor, 'sanctum')
            ->postJson('/api/donations', [
                'campaign_id' => 99999,
                'amount' => 100.00,
                'payment_method' => 'card',
            ]);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['campaign_id']);
    }

    /**
     * Test anonymous donations are supported.
     */
    public function test_anonymous_donations_are_supported(): void
    {
        $donor = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $campaign = Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
        ]);

        $response = $this->actingAs($donor, 'sanctum')
            ->postJson('/api/donations', [
                'campaign_id' => $campaign->id,
                'amount' => 100.00,
                'payment_method' => 'card',
                'is_anonymous' => true,
            ]);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('donations', [
            'campaign_id' => $campaign->id,
            'is_anonymous' => true,
        ]);
    }

    /**
     * Test donation includes optional message.
     */
    public function test_donation_can_include_message(): void
    {
        $donor = User::factory()->create(['role' => 'buyer']);
        $weaver = User::factory()->create(['role' => 'weaver']);
        $campaign = Campaign::factory()->create([
            'organizer_id' => $weaver->id,
            'moderation_status' => 'approved',
        ]);

        $message = 'Great cause! Keep up the good work!';

        $response = $this->actingAs($donor, 'sanctum')
            ->postJson('/api/donations', [
                'campaign_id' => $campaign->id,
                'amount' => 100.00,
                'payment_method' => 'card',
                'message' => $message,
            ]);

        $response->assertStatus(201);
        
        $this->assertDatabaseHas('donations', [
            'campaign_id' => $campaign->id,
            'message' => $message,
        ]);
    }
}

