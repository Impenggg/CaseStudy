<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $weavers = User::where('role', 'weaver')->get();

        // Maria Santos products
        $maria = $weavers->where('name', 'Maria Santos')->first();
        Product::create([
            'name' => 'Traditional Ikat Weaving',
            'price' => 2500.00,
            'category' => 'Traditional Textiles',
            'description' => 'Authentic handwoven ikat textile featuring traditional geometric patterns passed down through generations. Each piece tells a story of our ancestors and preserves our cultural heritage.',
            'cultural_background' => 'Ikat weaving is a traditional dyeing technique used to pattern textiles that employs a resist dyeing process similar to tie-dye on either the warp or weft fibres.',
            'materials' => ['Cotton', 'Natural Dyes', 'Traditional Loom'],
            'care_instructions' => 'Hand wash in cold water with mild detergent. Do not bleach. Iron on low heat if needed. Store in a cool, dry place.',
            'image' => 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
            'user_id' => $maria->id,
            'stock_quantity' => 5,
            'dimensions' => [
                'length' => 200,
                'width' => 150,
                'weight' => 500
            ],
            'tags' => ['ikat', 'traditional', 'handwoven', 'cultural'],
            'featured' => true,
        ]);

        // Rosa Dulawan products
        $rosa = $weavers->where('name', 'Rosa Dulawan')->first();
        Product::create([
            'name' => 'Cordillera Blanket',
            'price' => 1800.00,
            'category' => 'Home Textiles',
            'description' => 'Warm and comfortable blanket woven with traditional Cordillera patterns. Perfect for cold mountain nights and adds cultural beauty to any home.',
            'cultural_background' => 'Cordillera blankets are traditionally woven by women in the mountain provinces, using patterns that represent their community and family heritage.',
            'materials' => ['Wool', 'Cotton Blend', 'Natural Fibers'],
            'care_instructions' => 'Dry clean only. Do not machine wash. Store in a dry place away from direct sunlight.',
            'image' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800',
            'user_id' => $rosa->id,
            'stock_quantity' => 8,
            'dimensions' => [
                'length' => 180,
                'width' => 120,
                'weight' => 800
            ],
            'tags' => ['blanket', 'warm', 'traditional', 'cordillera'],
            'featured' => false,
        ]);

        // Elena Badiw products
        $elena = $weavers->where('name', 'Elena Badiw')->first();
        Product::create([
            'name' => 'Woven Table Runner',
            'price' => 850.00,
            'category' => 'Home Decor',
            'description' => 'Elegant table runner featuring intricate traditional motifs. Perfect for special occasions and adds a touch of cultural elegance to your dining table.',
            'cultural_background' => 'Table runners in the Cordillera region often feature patterns that represent fertility, prosperity, and protection for the family.',
            'materials' => ['Cotton', 'Silk Blend', 'Natural Dyes'],
            'care_instructions' => 'Hand wash in cold water. Iron on low heat. Do not bleach or tumble dry.',
            'image' => 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
            'user_id' => $elena->id,
            'stock_quantity' => 12,
            'dimensions' => [
                'length' => 120,
                'width' => 30,
                'weight' => 200
            ],
            'tags' => ['table runner', 'elegant', 'traditional', 'home decor'],
            'featured' => true,
        ]);

        // Additional products
        Product::create([
            'name' => 'Traditional Shoulder Bag',
            'price' => 1200.00,
            'category' => 'Accessories',
            'description' => 'Handwoven shoulder bag with traditional patterns. Functional and beautiful, perfect for everyday use while showcasing our cultural heritage.',
            'cultural_background' => 'Shoulder bags are essential items in Cordillera culture, used for carrying personal belongings and often given as gifts during important ceremonies.',
            'materials' => ['Rattan', 'Cotton', 'Leather Straps'],
            'care_instructions' => 'Wipe with damp cloth. Keep away from moisture. Store in a dry place.',
            'image' => 'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=800',
            'user_id' => $maria->id,
            'stock_quantity' => 10,
            'dimensions' => [
                'length' => 25,
                'width' => 20,
                'weight' => 300
            ],
            'tags' => ['bag', 'shoulder bag', 'traditional', 'accessories'],
            'featured' => false,
        ]);

        Product::create([
            'name' => 'Woven Wall Hanging',
            'price' => 3200.00,
            'category' => 'Wall Art',
            'description' => 'Stunning wall hanging featuring traditional Cordillera patterns. A beautiful piece of art that tells the story of our ancestors and adds cultural depth to any space.',
            'cultural_background' => 'Wall hangings in Cordillera culture often depict stories, legends, and important events in the community\'s history.',
            'materials' => ['Cotton', 'Natural Dyes', 'Wooden Frame'],
            'care_instructions' => 'Dust regularly with soft cloth. Avoid direct sunlight. Do not wash.',
            'image' => 'https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=800',
            'user_id' => $rosa->id,
            'stock_quantity' => 3,
            'dimensions' => [
                'length' => 100,
                'width' => 80,
                'weight' => 1500
            ],
            'tags' => ['wall art', 'traditional', 'cultural', 'decorative'],
            'featured' => true,
        ]);
    }
}
