<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Product;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

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
        $rosa = $weavers->where('name', 'Rosa Dulawan')->first();
        $elena = $weavers->where('name', 'Elena Badiw')->first();
        $defaultWeaver = $maria ?? $rosa ?? $elena ?? $weavers->first();

        // Curated Cordillera products for marketplace
        // If specific named weavers are not present, fall back to any weaver
        $weaverId = $defaultWeaver?->id;

        // If still none, create a minimal default weaver so seeding doesn't fail
        if (!$weaverId) {
            $defaultWeaver = User::create([
                'name' => 'Default Weaver',
                'email' => 'weaver@example.com',
                'password' => Hash::make('password'),
                'role' => 'weaver',
                'bio' => 'Auto-created weaver for product ownership during seeding.',
                'location' => 'Cordillera',
            ]);
            $weaverId = $defaultWeaver->id;
        }

        $curatedProducts = [
            [
                'name' => 'Bulul (Ifugao Rice Guardian)',
                'price' => 6800.00,
                'category' => 'Sculpture',
                'description' => 'Hand-carved Ifugao bulul, a rice granary guardian figure traditionally invoked for abundance and protection.',
                'cultural_background' => 'Ifugao',
                'materials' => ['Hardwood'],
                'care_instructions' => 'Keep dry and away from direct sunlight. Dust with soft cloth.',
                'image' => 'storage/products/bulul-01.jpg',
                'stock_quantity' => 2,
                'dimensions' => ['height' => 40, 'width' => 15, 'depth' => 12, 'weight' => 1500],
                'tags' => ['ifugao', 'bulul', 'rice deity', 'sculpture', 'ritual'],
                'featured' => true,
            ],
            [
                'name' => 'Sangi (Bontoc Plaited Backpack)',
                'price' => 2400.00,
                'category' => 'Basketry',
                'description' => 'Traditional Bontoc sangi, a plaited backpack with lid used for everyday carrying.',
                'cultural_background' => 'Bontoc',
                'materials' => ['Rattan', 'Bamboo'],
                'care_instructions' => 'Keep dry; wipe with damp cloth. Store away from moisture.',
                'image' => 'storage/products/sangi-01.jpg',
                'stock_quantity' => 5,
                'dimensions' => ['height' => 35, 'width' => 28, 'depth' => 20, 'weight' => 600],
                'tags' => ['bontoc', 'sangi', 'backpack', 'basket', 'rattan'],
                'featured' => false,
            ],
            [
                'name' => 'Tudung (Pandanus Carrier)',
                'price' => 1800.00,
                'category' => 'Basketry',
                'description' => 'Trough-shaped carrier made of a pandanus leaf layer with rattan framework; can double as a rain cover.',
                'cultural_background' => 'Luzon Highland',
                'materials' => ['Pandanus Leaves', 'Rattan'],
                'care_instructions' => 'Air dry after use; avoid prolonged moisture.',
                'image' => 'storage/products/tudung-01.jpg',
                'stock_quantity' => 4,
                'dimensions' => ['length' => 60, 'width' => 25, 'height' => 18, 'weight' => 500],
                'tags' => ['tudung', 'pandanus', 'rattan', 'basket', 'carrier'],
                'featured' => false,
            ],
            [
                'name' => 'Kulikug (Rice Basket)',
                'price' => 1600.00,
                'category' => 'Basketry',
                'description' => 'Basket for roasted unripe rice, traditionally woven in the Cordillera.',
                'cultural_background' => 'Bontoc',
                'materials' => ['Bamboo', 'Rattan'],
                'care_instructions' => 'Keep dry; clean with soft brush or cloth.',
                'image' => 'storage/products/kulikug-01.jpg',
                'stock_quantity' => 6,
                'dimensions' => ['height' => 20, 'diameter' => 30, 'weight' => 400],
                'tags' => ['kulikug', 'basket', 'rice', 'bontoc'],
                'featured' => false,
            ],
            [
                'name' => 'Inabnutan (Ifugao Hunter’s Backpack)',
                'price' => 3200.00,
                'category' => 'Basketry',
                'description' => 'Weather-resistant Ifugao hunter’s backpack covered with abnut fiber.',
                'cultural_background' => 'Ifugao',
                'materials' => ['Rattan', 'Bamboo', 'Abnut Fiber'],
                'care_instructions' => 'Air dry after exposure to rain; store in a cool, dry place.',
                'image' => 'storage/products/inabnutan-01.jpg',
                'stock_quantity' => 3,
                'dimensions' => ['height' => 40, 'width' => 30, 'depth' => 18, 'weight' => 700],
                'tags' => ['ifugao', 'inabnutan', 'backpack', 'rattan'],
                'featured' => true,
            ],
            [
                'name' => 'Lingling-o Pendant (Brass)',
                'price' => 950.00,
                'category' => 'Jewelry',
                'description' => 'Omega-shaped pendant symbolizing protection and balance, inspired by Cordillera heritage.',
                'cultural_background' => 'Ifugao / Kalinga / Bontoc',
                'materials' => ['Brass'],
                'care_instructions' => 'Wipe with jewelry cloth; keep away from chemicals and saltwater.',
                'image' => 'storage/products/lingling-o-01.jpg',
                'stock_quantity' => 12,
                'dimensions' => ['diameter' => 4, 'weight' => 50],
                'tags' => ['lingling-o', 'pendant', 'jewelry', 'cordillera'],
                'featured' => false,
            ],
            [
                'name' => 'Itneg Woven Textile (Pinilian)',
                'price' => 2100.00,
                'category' => 'Textiles',
                'description' => 'Handwoven Itneg textile using pinilian technique from Abra; intricate supplementary weft motifs.',
                'cultural_background' => 'Itneg (Tingguian), Abra',
                'materials' => ['Cotton', 'Natural Dyes'],
                'care_instructions' => 'Hand wash cold with mild detergent; line dry; iron low.',
                'image' => 'storage/products/itneg-pinilian-01.jpg',
                'stock_quantity' => 7,
                'dimensions' => ['length' => 180, 'width' => 45, 'weight' => 300],
                'tags' => ['itneg', 'tingguian', 'pinilian', 'abra', 'weaving'],
                'featured' => true,
            ],
            [
                'name' => 'Kalinga Kain (Wrap Skirt Cloth)',
                'price' => 2600.00,
                'category' => 'Textiles',
                'description' => 'Traditional Kalinga kain, a wrap-around skirt cloth with bold bands and motifs.',
                'cultural_background' => 'Kalinga',
                'materials' => ['Cotton', 'Natural Dyes'],
                'care_instructions' => 'Hand wash cold; do not bleach; iron on low.',
                'image' => 'storage/products/kalinga-kain-01.jpg',
                'stock_quantity' => 5,
                'dimensions' => ['length' => 170, 'width' => 60, 'weight' => 350],
                'tags' => ['kalinga', 'kain', 'tapis', 'textile'],
                'featured' => false,
            ],
            [
                'name' => 'Bontoc Siniwsiwan Blanket',
                'price' => 3400.00,
                'category' => 'Textiles',
                'description' => 'Bontoc siniwsiwan fabric featuring geometric motifs used for clothing and blankets.',
                'cultural_background' => 'Bontoc',
                'materials' => ['Cotton', 'Dyed Yarn'],
                'care_instructions' => 'Dry clean recommended; store away from direct sunlight.',
                'image' => 'storage/products/siniwsiwan-blanket-01.jpg',
                'stock_quantity' => 4,
                'dimensions' => ['length' => 190, 'width' => 120, 'weight' => 900],
                'tags' => ['bontoc', 'siniwsiwan', 'blanket', 'textile'],
                'featured' => true,
            ],
            [
                'name' => 'Binakul Throw (Optical Weave)',
                'price' => 3000.00,
                'category' => 'Textiles',
                'description' => 'Binakul (binakol) optical-illusion weave associated with Ilocano and Itneg communities.',
                'cultural_background' => 'Ilocano / Itneg (Abra)',
                'materials' => ['Cotton'],
                'care_instructions' => 'Hand wash cold; lay flat to dry; iron low.',
                'image' => 'storage/products/binakul-throw-01.jpg',
                'stock_quantity' => 6,
                'dimensions' => ['length' => 170, 'width' => 110, 'weight' => 700],
                'tags' => ['binakul', 'binakol', 'optical', 'itneg', 'ilocano'],
                'featured' => false,
            ],
            [
                'name' => 'Cordillera Oban (Woven Belt)',
                'price' => 650.00,
                'category' => 'Accessories',
                'description' => 'Traditional woven belt/sash used to secure the wrap skirt (tapis).',
                'cultural_background' => 'Cordillera',
                'materials' => ['Cotton'],
                'care_instructions' => 'Hand wash cold; do not tumble dry; iron low.',
                'image' => 'storage/products/oban-belt-01.jpg',
                'stock_quantity' => 10,
                'dimensions' => ['length' => 200, 'width' => 5, 'weight' => 120],
                'tags' => ['oban', 'belt', 'sash', 'tapis', 'cordillera'],
                'featured' => false,
            ],
        ];

        foreach ($curatedProducts as $p) {
            Product::create([
                'name' => $p['name'],
                'price' => $p['price'],
                'category' => $p['category'],
                'description' => $p['description'],
                'cultural_background' => $p['cultural_background'],
                'materials' => $p['materials'],
                'care_instructions' => $p['care_instructions'],
                'image' => $p['image'],
                'user_id' => $weaverId,
                'stock_quantity' => $p['stock_quantity'],
                'dimensions' => $p['dimensions'],
                'tags' => $p['tags'],
                'featured' => $p['featured'],
            ]);
        }
    }
}
