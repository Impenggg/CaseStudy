<?php

namespace Tests\Feature;

use App\Models\Story;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;

class StoryTest extends TestCase
{
    use RefreshDatabase, WithFaker;

    /**
     * Test weaver can create a story.
     */
    public function test_weaver_can_create_story(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);

        $response = $this->actingAs($weaver, 'sanctum')
            ->postJson('/api/stories', [
                'title' => 'Traditional Weaving Heritage',
                'content' => 'A story about our traditional weaving methods passed down through generations.',
                'category' => 'cultural_heritage',
                'is_published' => true,
            ]);

        $response->assertStatus(201)
            ->assertJsonStructure([
                'status',
                'message',
                'data' => [
                    'id',
                    'title',
                    'content',
                    'moderation_status',
                ]
            ]);

        $this->assertDatabaseHas('stories', [
            'title' => 'Traditional Weaving Heritage',
            'author_id' => $weaver->id,
            'moderation_status' => 'pending',
        ]);
    }

    /**
     * Test buyer cannot create stories.
     */
    public function test_buyer_cannot_create_story(): void
    {
        $buyer = User::factory()->create(['role' => 'buyer']);

        $response = $this->actingAs($buyer, 'sanctum')
            ->postJson('/api/stories', [
                'title' => 'Test Story',
                'content' => 'Test content',
                'category' => 'cultural_heritage',
            ]);

        $response->assertStatus(403)
            ->assertJson([
                'status' => 'error',
                'message' => 'Unauthorized',
            ]);
    }

    /**
     * Test admin created story is auto-approved.
     */
    public function test_admin_created_story_is_auto_approved(): void
    {
        $admin = User::factory()->create(['role' => 'admin']);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson('/api/stories', [
                'title' => 'Admin Story',
                'content' => 'Story created by admin',
                'category' => 'cultural_heritage',
                'is_published' => true,
            ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('stories', [
            'title' => 'Admin Story',
            'moderation_status' => 'approved',
        ]);
    }

    /**
     * Test guest can view approved and published stories.
     */
    public function test_guest_can_view_approved_published_stories(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
            'title' => 'Approved Story',
        ]);

        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'pending',
            'is_published' => true,
            'title' => 'Pending Story',
        ]);

        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => false,
            'title' => 'Draft Story',
        ]);

        $response = $this->getJson('/api/stories');

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Approved Story'])
            ->assertJsonMissing(['title' => 'Pending Story'])
            ->assertJsonMissing(['title' => 'Draft Story']);
    }

    /**
     * Test story search functionality.
     */
    public function test_stories_can_be_searched(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
            'title' => 'Traditional Weaving Techniques',
        ]);

        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
            'title' => 'Modern Art Forms',
        ]);

        $response = $this->getJson('/api/stories?search=Weaving');

        $response->assertStatus(200)
            ->assertJsonFragment(['title' => 'Traditional Weaving Techniques'])
            ->assertJsonMissing(['title' => 'Modern Art Forms']);
    }

    /**
     * Test story category filtering.
     */
    public function test_stories_can_be_filtered_by_category(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
            'category' => 'cultural_heritage',
        ]);

        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
            'category' => 'artisan_journey',
        ]);

        $response = $this->getJson('/api/stories?category=cultural_heritage');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertEquals('cultural_heritage', $data[0]['category']);
    }

    /**
     * Test featured stories filtering.
     */
    public function test_can_filter_featured_stories(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
            'is_featured' => true,
        ]);

        Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
            'is_featured' => false,
        ]);

        $response = $this->getJson('/api/stories?featured=1');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(1, $data);
        $this->assertTrue($data[0]['is_featured']);
    }

    /**
     * Test author can update their story.
     */
    public function test_author_can_update_story(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $story = Story::factory()->create(['author_id' => $weaver->id]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->putJson("/api/stories/{$story->id}", [
                'title' => 'Updated Story Title',
                'content' => 'Updated content',
            ]);

        $response->assertStatus(200)
            ->assertJsonFragment([
                'title' => 'Updated Story Title',
                'content' => 'Updated content',
            ]);

        $this->assertDatabaseHas('stories', [
            'id' => $story->id,
            'title' => 'Updated Story Title',
        ]);
    }

    /**
     * Test non-author cannot update story.
     */
    public function test_non_author_cannot_update_story(): void
    {
        $weaver1 = User::factory()->create(['role' => 'weaver']);
        $weaver2 = User::factory()->create(['role' => 'weaver']);
        $story = Story::factory()->create(['author_id' => $weaver1->id]);

        $response = $this->actingAs($weaver2, 'sanctum')
            ->putJson("/api/stories/{$story->id}", [
                'title' => 'Updated Title',
            ]);

        $response->assertStatus(403);
    }

    /**
     * Test author can delete their story.
     */
    public function test_author_can_delete_story(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $story = Story::factory()->create(['author_id' => $weaver->id]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->deleteJson("/api/stories/{$story->id}");

        $response->assertStatus(200)
            ->assertJson([
                'status' => 'success',
                'message' => 'Story deleted successfully',
            ]);

        $this->assertDatabaseMissing('stories', [
            'id' => $story->id,
        ]);
    }

    /**
     * Test weaver can view their own stories.
     */
    public function test_weaver_can_view_own_stories(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        $otherWeaver = User::factory()->create(['role' => 'weaver']);

        Story::factory()->count(3)->create(['author_id' => $weaver->id]);
        Story::factory()->count(2)->create(['author_id' => $otherWeaver->id]);

        $response = $this->actingAs($weaver, 'sanctum')
            ->getJson('/api/my-stories');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertCount(3, $data);
    }

    /**
     * Test story validation rules.
     */
    public function test_story_creation_validates_required_fields(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);

        $response = $this->actingAs($weaver, 'sanctum')
            ->postJson('/api/stories', []);

        $response->assertStatus(422)
            ->assertJsonValidationErrors(['title', 'content']);
    }

    /**
     * Test story sorting by newest.
     */
    public function test_stories_sorted_by_newest_by_default(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        
        $oldStory = Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
            'created_at' => now()->subDays(5),
            'title' => 'Old Story',
        ]);

        $newStory = Story::factory()->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
            'created_at' => now(),
            'title' => 'New Story',
        ]);

        $response = $this->getJson('/api/stories');

        $response->assertStatus(200);
        $data = $response->json('data');
        
        $this->assertEquals('New Story', $data[0]['title']);
        $this->assertEquals('Old Story', $data[1]['title']);
    }

    /**
     * Test can fetch all stories without pagination.
     */
    public function test_can_fetch_all_stories_without_pagination(): void
    {
        $weaver = User::factory()->create(['role' => 'weaver']);
        Story::factory()->count(15)->create([
            'author_id' => $weaver->id,
            'moderation_status' => 'approved',
            'is_published' => true,
        ]);

        $response = $this->getJson('/api/stories?per_page=all');

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

