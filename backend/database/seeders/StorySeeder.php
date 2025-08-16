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
        $weavers = User::where('role', 'weaver')->get();

        // Maria Santos stories
        $maria = $weavers->where('name', 'Maria Santos')->first();
        Story::create([
            'title' => 'The Legacy of Ikat Weaving',
            'content' => 'For generations, our family has preserved the ancient art of ikat weaving. This traditional technique involves tying and dyeing threads before weaving, creating intricate patterns that tell stories of our ancestors. Each piece I create carries the weight of centuries of tradition and the hopes of preserving our cultural heritage for future generations.',
            'excerpt' => 'Discover the ancient art of ikat weaving and how this traditional technique preserves our cultural heritage through generations.',
            'media_url' => 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
            'media_type' => 'image',
            'author_id' => $maria->id,
            'category' => 'tradition',
            'tags' => ['ikat', 'traditional', 'weaving', 'cultural heritage'],
            'featured' => true,
            'published' => true,
        ]);

        // Rosa Dulawan stories
        $rosa = $weavers->where('name', 'Rosa Dulawan')->first();
        Story::create([
            'title' => 'Preserving Cultural Heritage Through Weaving',
            'content' => 'Our cultural heritage is more than just fabric and patterns – it\'s the living connection to our ancestors and the wisdom they passed down through generations. As a master weaver in the Cordillera region, I have dedicated my life to preserving and sharing these traditional techniques.',
            'excerpt' => 'Explore how traditional weaving preserves cultural heritage and connects generations through shared stories and techniques.',
            'media_url' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800',
            'media_type' => 'image',
            'author_id' => $rosa->id,
            'category' => 'tradition',
            'tags' => ['cultural heritage', 'traditional weaving', 'community', 'preservation'],
            'featured' => true,
            'published' => true,
        ]);

        // Elena Badiw stories
        $elena = $weavers->where('name', 'Elena Badiw')->first();
        Story::create([
            'title' => 'The Art of Home Textiles: Bringing Tradition to Modern Homes',
            'content' => 'As a weaver specializing in home textiles, I bridge the gap between traditional craftsmanship and modern living. Our ancestors created beautiful and functional textiles for their homes, and today, I continue this tradition by adapting these techniques to contemporary needs.',
            'excerpt' => 'Discover how traditional home textiles bridge the gap between cultural heritage and modern living spaces.',
            'media_url' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            'media_type' => 'image',
            'author_id' => $elena->id,
            'category' => 'artisan',
            'tags' => ['home textiles', 'modern living', 'traditional crafts', 'cultural connection'],
            'featured' => false,
            'published' => true,
        ]);
    }
}
