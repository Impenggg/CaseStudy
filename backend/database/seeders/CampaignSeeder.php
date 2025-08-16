<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Campaign;
use App\Models\User;

class CampaignSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $weavers = User::where('role', 'weaver')->get();

        // Maria Santos campaign
        $maria = $weavers->where('name', 'Maria Santos')->first();
        Campaign::create([
            'title' => 'Support Traditional Ikat Weaving Education',
            'description' => 'Help us establish a weaving school to teach young people traditional ikat techniques. This campaign aims to preserve our cultural heritage by providing training, materials, and equipment for the next generation of weavers.',
            'goal_amount' => 50000.00,
            'current_amount' => 32500.00,
            'end_date' => '2024-12-31',
            'organizer_id' => $maria->id,
            'image' => 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
            'category' => 'education',
            'status' => 'active',
            'backers_count' => 45,
        ]);

        // Rosa Dulawan campaign
        $rosa = $weavers->where('name', 'Rosa Dulawan')->first();
        Campaign::create([
            'title' => 'Preserve Ancient Looms',
            'description' => 'Help us restore and maintain traditional wooden looms that have been passed down through generations. These looms are not just tools – they are pieces of our cultural heritage that tell the story of our ancestors.',
            'goal_amount' => 25000.00,
            'current_amount' => 18750.00,
            'end_date' => '2024-11-30',
            'organizer_id' => $rosa->id,
            'image' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800',
            'category' => 'preservation',
            'status' => 'active',
            'backers_count' => 32,
        ]);

        // Elena Badiw campaign
        $elena = $weavers->where('name', 'Elena Badiw')->first();
        Campaign::create([
            'title' => 'Community Weaving Center',
            'description' => 'Help us build a community weaving center where weavers can work together, share techniques, and create beautiful textiles as a community. This center will serve as a hub for cultural preservation and economic development.',
            'goal_amount' => 75000.00,
            'current_amount' => 15000.00,
            'end_date' => '2025-03-31',
            'organizer_id' => $elena->id,
            'image' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            'category' => 'community',
            'status' => 'active',
            'backers_count' => 18,
        ]);
    }
}
