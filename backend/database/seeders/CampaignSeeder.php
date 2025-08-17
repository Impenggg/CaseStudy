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
        $fallbackOrganizer = $weavers->first();

        // 1. Cordillera Heritage Fair (community)
        Campaign::create([
            'title' => 'Cordillera Heritage Fair',
            'description' => 'Organize a fair showcasing traditional crafts, food, music, and dances. Sell local crafts (woven cloth, jewelry, woodcarvings) and native delicacies. Include cultural performances like the Bendian dance and gong playing. Entrance fees or donations will support heritage programs.',
            'goal_amount' => 150000.00,
            'current_amount' => 60000.00,
            'end_date' => now()->addMonths(4)->toDateString(),
            'organizer_id' => optional($weavers->where('name', 'Maria Santos')->first())->id ?? optional($fallbackOrganizer)->id,
            'image' => 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200',
            'category' => 'community',
            'status' => 'active',
            'backers_count' => 120,
        ]);

        // 2. Crafts & Textile Workshop (education)
        Campaign::create([
            'title' => 'Crafts & Textile Workshop',
            'description' => 'Host weaving or carving workshops led by Cordilleran artisans. Learn binakul weaving, lingling-o jewelry making, or labba basket weaving. Participant fees support heritage preservation and community projects.',
            'goal_amount' => 80000.00,
            'current_amount' => 35000.00,
            'end_date' => now()->addMonths(3)->toDateString(),
            'organizer_id' => optional($weavers->where('name', 'Rosa Dulawan')->first())->id ?? optional($fallbackOrganizer)->id,
            'image' => 'https://images.unsplash.com/photo-1607081692251-5bb4c0940e1e?w=1200',
            'category' => 'education',
            'status' => 'active',
            'backers_count' => 68,
        ]);

        // 3. Cordillera Heritage Run/Walk (community)
        Campaign::create([
            'title' => 'Cordillera Heritage Run/Walk',
            'description' => 'A fun run/walkathon themed around Cordillera culture. Runners wear Cordillera-inspired attire with woven sashes or headbands. Eco-friendly giveaways and culture-themed medals. Entry fees become fundraising proceeds.',
            'goal_amount' => 100000.00,
            'current_amount' => 42000.00,
            'end_date' => now()->addMonths(2)->toDateString(),
            'organizer_id' => optional($weavers->where('name', 'Elena Badiw')->first())->id ?? optional($fallbackOrganizer)->id,
            'image' => 'https://images.unsplash.com/photo-1520975954732-35dd222996f7?w=1200',
            'category' => 'community',
            'status' => 'active',
            'backers_count' => 210,
        ]);

        // 4. Cordillera Storytelling & Music Night (preservation)
        Campaign::create([
            'title' => 'Cordillera Storytelling & Music Night',
            'description' => 'An evening of ullalim (epic chants), indigenous storytelling, and bamboo/gong music. Includes poetry and modern performances inspired by Cordillera heritage. Ticket sales include traditional snacks and drinks.',
            'goal_amount' => 60000.00,
            'current_amount' => 20000.00,
            'end_date' => now()->addMonth()->toDateString(),
            'organizer_id' => optional($weavers->where('name', 'Ben Talugtug')->first())->id ?? optional($fallbackOrganizer)->id,
            'image' => 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=1200',
            'category' => 'preservation',
            'status' => 'active',
            'backers_count' => 95,
        ]);

        // 5. Virtual Heritage Exhibit & Auction (preservation)
        Campaign::create([
            'title' => 'Virtual Heritage Exhibit & Auction',
            'description' => 'Create an online gallery of Cordilleran crafts, photos, and textiles, and host a live-streamed auction of donated crafts or artworks. Partner with local artisans to showcase their work globally. Proceeds support heritage preservation and artisan livelihoods.',
            'goal_amount' => 200000.00,
            'current_amount' => 76000.00,
            'end_date' => now()->addMonths(5)->toDateString(),
            'organizer_id' => optional($weavers->where('name', 'Carlos Mendoza')->first())->id ?? optional($fallbackOrganizer)->id,
            'image' => 'https://images.unsplash.com/photo-1512521743077-c9f923b6f21e?w=1200',
            'category' => 'preservation',
            'status' => 'active',
            'backers_count' => 154,
        ]);
    }
}
