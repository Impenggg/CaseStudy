<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Story;
use App\Models\User;

class StorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Include both 'weaver' and 'artisan' roles, prefer a specific test artisan if present
        $authors = User::whereIn('role', ['weaver', 'artisan'])->get();
        $preferred = $authors->where('name', 'Test Artisan')->first()
            ?? $authors->first();
        $maria = $authors->where('name', 'Maria Santos')->first();
        $rosa = $authors->where('name', 'Rosa Dulawan')->first();
        $elena = $authors->where('name', 'Elena Badiw')->first();
        $defaultAuthorId = $preferred?->id ?? $maria?->id ?? $rosa?->id ?? $elena?->id;

        // 1) UNESCO World Heritage: Rice Terraces of the Philippine Cordilleras
        Story::create([
            'title' => 'Rice Terraces of the Philippine Cordilleras (UNESCO World Heritage)',
            'content' => 'An overview of the Rice Terraces of the Philippine Cordilleras—centuries-old, living cultural landscapes shaped by Indigenous knowledge systems and sustainable rice cultivation.',
            'excerpt' => 'UNESCO-listed Rice Terraces of the Philippine Cordilleras: living cultural landscapes and Indigenous knowledge.',
            'media_url' => 'https://whc.unesco.org/en/list/722/',
            'media_type' => null,
            'author_id' => $defaultAuthorId,
            'category' => 'community',
            'tags' => ['unesco', 'world heritage', 'rice terraces', 'cordilleras'],
            'featured' => true,
            'published' => true,
        ]);

        // 2) UNESCO ICH: Hudhud chants of the Ifugao
        Story::create([
            'title' => 'Hudhud Chants of the Ifugao (UNESCO Intangible Cultural Heritage)',
            'content' => 'The Hudhud is a narrative chant tradition of the Ifugao, performed during harvests and significant community occasions—celebrating memory, identity, and oral artistry.',
            'excerpt' => 'Ifugao Hudhud chants—epic oral tradition recognized by UNESCO as Intangible Cultural Heritage.',
            'media_url' => 'https://ich.unesco.org/en/RL/hudhud-chants-of-the-ifugao-00015',
            'media_type' => null,
            'author_id' => $defaultAuthorId,
            'category' => 'tradition',
            'tags' => ['unesco', 'ich', 'ifugao', 'hudhud', 'oral tradition'],
            'featured' => true,
            'published' => true,
        ]);

        // 3) UNESCO ICH: Tugging rituals and games
        Story::create([
            'title' => 'Tugging Rituals and Games (UNESCO Intangible Cultural Heritage)',
            'content' => 'Tugging rituals and games, practiced in various communities, symbolize unity, agricultural cycles, and communal cooperation—recognized by UNESCO for their social significance.',
            'excerpt' => 'Tugging rituals and games—community practices of unity and cooperation recognized by UNESCO.',
            'media_url' => 'https://ich.unesco.org/en/RL/tugging-rituals-and-games-01080',
            'media_type' => null,
            'author_id' => $defaultAuthorId,
            'category' => 'community',
            'tags' => ['unesco', 'ich', 'ritual', 'games', 'community'],
            'featured' => false,
            'published' => true,
        ]);

        // 4) ICBE: Preservation and Promotion of the Cordillera Cultural Heritage
        Story::create([
            'title' => 'Preservation and Promotion of the Cordillera Cultural Heritage',
            'content' => 'A community perspective on sustaining Cordillera cultural heritage while addressing current social issues, featuring initiatives among Igorot and Cordillera organizations in Europe.',
            'excerpt' => 'Sustaining Cordillera heritage and addressing prevailing social issues—community perspectives and initiatives.',
            'media_url' => 'https://www.icbe.eu/articles/926-preservation-and-promotion-of-the-cordillera-cultural-heritage-and-addressing-prevailing-issues-in-society',
            'media_type' => null,
            'author_id' => $defaultAuthorId,
            'category' => 'community',
            'tags' => ['cordillera', 'heritage', 'community', 'preservation'],
            'featured' => false,
            'published' => true,
        ]);

        // 5) NCCA: Northern Cultural Communities
        Story::create([
            'title' => 'Northern Cultural Communities (NCCA)',
            'content' => 'Overview of the Northern Cultural Communities under the NCCA—supporting cultural development and safeguarding traditions across Indigenous communities.',
            'excerpt' => 'NCCA overview of Northern Cultural Communities—cultural development and safeguarding initiatives.',
            'media_url' => 'https://ncca.gov.ph/about-ncca-3/subcommissions/subcommission-on-cultural-communities-and-traditional-arts-sccta/northern-cultural-communities/',
            'media_type' => null,
            'author_id' => $defaultAuthorId,
            'category' => 'community',
            'tags' => ['ncca', 'cultural communities', 'policy', 'heritage'],
            'featured' => false,
            'published' => true,
        ]);
    }
}
