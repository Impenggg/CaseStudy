<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\User;

class ProductFromLocalImagesSeeder extends Seeder
{
    /**
     * Seed products from local images with curated details.
     */
    public function run(): void
    {
        // Resolve a default weaver (seller)
        $weavers = User::where('role', 'weaver')->get();
        $maria = $weavers->where('name', 'Maria Santos')->first();
        $rosa = $weavers->where('name', 'Rosa Dulawan')->first();
        $elena = $weavers->where('name', 'Elena Badiw')->first();
        $weaverId = ($maria ?? $rosa ?? $elena ?? $weavers->first())?->id;

        // Source folder provided by user (outside Laravel storage)
        $sourceFolder = base_path('..' . DIRECTORY_SEPARATOR . 'products');

        // Destination public storage path: storage/app/public/products
        $destFolder = storage_path('app/public/products');
        if (!File::exists($destFolder)) {
            File::makeDirectory($destFolder, 0755, true);
        }

        // Map of product metadata keyed by canonical name
        $meta = [
            'Binakul' => [
                'category' => 'Textiles',
                'description' => 'Binakul (binakol) is an optical-illusion weave from Northern Luzon, commonly associated with Ilocano and Itneg (Tingguian) communities. Its whirling patterns are believed to ward off malevolent spirits.',
                'cultural_background' => 'Ilocano / Itneg (Abra)',
                'materials' => ['Cotton'],
                'care_instructions' => 'Hand wash cold; lay flat to dry; iron low.',
                'price' => 3000.00,
                'stock_quantity' => 6,
                'tags' => ['binakul', 'binakol', 'optical', 'ilocos', 'itneg'],
            ],
            'Bulul' => [
                'category' => 'Sculpture',
                'description' => 'Bulul is the Ifugao rice granary guardian figure, traditionally carved from hardwood and invoked for abundance and protection.',
                'cultural_background' => 'Ifugao',
                'materials' => ['Hardwood'],
                'care_instructions' => 'Keep dry and away from direct sunlight. Dust with soft cloth.',
                'price' => 6800.00,
                'stock_quantity' => 2,
                'tags' => ['ifugao', 'bulul', 'sculpture', 'ritual'],
            ],
            'Inabnutan' => [
                'category' => 'Basketry',
                'description' => 'Inabnutan is an Ifugao hunter’s backpack covered with abnut fiber, valued for its weather resistance in the highlands.',
                'cultural_background' => 'Ifugao',
                'materials' => ['Rattan', 'Bamboo', 'Abnut Fiber'],
                'care_instructions' => 'Air dry after rain; store in a cool, dry place.',
                'price' => 3200.00,
                'stock_quantity' => 3,
                'tags' => ['ifugao', 'backpack', 'rattan'],
            ],
            'Itneg' => [
                'category' => 'Textiles',
                'description' => 'Itneg (Tingguian) weaving from Abra features intricate supplementary weft motifs such as pinilian, showcasing highland artistry.',
                'cultural_background' => 'Itneg (Tingguian), Abra',
                'materials' => ['Cotton', 'Natural Dyes'],
                'care_instructions' => 'Hand wash cold with mild detergent; line dry; iron low.',
                'price' => 2100.00,
                'stock_quantity' => 7,
                'tags' => ['itneg', 'tingguian', 'abra', 'weaving'],
            ],
            'Kain' => [
                'category' => 'Textiles',
                'description' => 'Kain refers to the traditional wrap-around skirt cloth in Cordillera, with bold bands and motifs varying by community.',
                'cultural_background' => 'Cordillera (e.g., Kalinga)',
                'materials' => ['Cotton', 'Natural Dyes'],
                'care_instructions' => 'Hand wash cold; do not bleach; iron low.',
                'price' => 2600.00,
                'stock_quantity' => 5,
                'tags' => ['kain', 'tapis', 'textile'],
            ],
            'Kulikug' => [
                'category' => 'Basketry',
                'description' => 'Kulikug is a traditional basket associated with rice preparation and storage among Cordillera groups.',
                'cultural_background' => 'Bontoc / Cordillera',
                'materials' => ['Bamboo', 'Rattan'],
                'care_instructions' => 'Keep dry; clean with soft brush or cloth.',
                'price' => 1600.00,
                'stock_quantity' => 6,
                'tags' => ['kulikug', 'basket', 'rice'],
            ],
            'Lingling-o' => [
                'category' => 'Jewelry',
                'description' => 'Lingling-o is an omega-shaped pendant from the Cordillera, symbolizing protection, fertility, and balance.',
                'cultural_background' => 'Ifugao / Kalinga / Bontoc',
                'materials' => ['Brass'],
                'care_instructions' => 'Wipe with jewelry cloth; keep away from chemicals and saltwater.',
                'price' => 950.00,
                'stock_quantity' => 12,
                'tags' => ['lingling-o', 'pendant', 'jewelry'],
            ],
            'Oban' => [
                'category' => 'Accessories',
                'description' => 'Oban is a woven belt or sash used to secure the traditional wrap skirt (tapis).',
                'cultural_background' => 'Cordillera',
                'materials' => ['Cotton'],
                'care_instructions' => 'Hand wash cold; do not tumble dry; iron low.',
                'price' => 650.00,
                'stock_quantity' => 10,
                'tags' => ['oban', 'belt', 'sash', 'tapis'],
            ],
            'Sangi' => [
                'category' => 'Basketry',
                'description' => 'Sangi is a traditional Bontoc plaited backpack with lid, used for everyday carrying.',
                'cultural_background' => 'Bontoc',
                'materials' => ['Rattan', 'Bamboo'],
                'care_instructions' => 'Keep dry; wipe with damp cloth. Store away from moisture.',
                'price' => 2400.00,
                'stock_quantity' => 5,
                'tags' => ['bontoc', 'sangi', 'backpack'],
            ],
            'Siniwsiwan' => [
                'category' => 'Textiles',
                'description' => 'Siniwsiwan is a Bontoc fabric featuring geometric motifs used in clothing and blankets.',
                'cultural_background' => 'Bontoc',
                'materials' => ['Cotton', 'Dyed Yarn'],
                'care_instructions' => 'Dry clean recommended; store away from direct sunlight.',
                'price' => 3400.00,
                'stock_quantity' => 4,
                'tags' => ['bontoc', 'siniwsiwan', 'blanket'],
            ],
            'Tudung' => [
                'category' => 'Basketry',
                'description' => 'Tudung is a trough-shaped carrier made of pandanus leaf with rattan framework; it can double as a rain cover.',
                'cultural_background' => 'Luzon Highland',
                'materials' => ['Pandanus Leaves', 'Rattan'],
                'care_instructions' => 'Air dry after use; avoid prolonged moisture.',
                'price' => 1800.00,
                'stock_quantity' => 4,
                'tags' => ['tudung', 'pandanus', 'rattan', 'carrier'],
            ],
        ];

        // Filenames provided by the user in the products folder
        $fileMap = [
            'Binakul' => 'Binakul.jpg',
            'Bulul' => 'Bulul.jfif',
            'Inabnutan' => 'Inabnutan.webp',
            'Itneg' => 'Itneg.jpg',
            'Kain' => 'Kain.jpg',
            'Kulikug' => 'Kulikug.webp',
            'Lingling-o' => 'Lingling-o.jpg',
            'Oban' => 'Oban.jpg',
            'Sangi' => 'Sangi.webp',
            'Siniwsiwan' => 'Siniwsiwan.webp',
            'Tudung' => 'Tudung.webp',
        ];

        foreach ($fileMap as $name => $filename) {
            $src = $sourceFolder . DIRECTORY_SEPARATOR . $filename;
            if (!File::exists($src)) {
                $this->command?->warn("Missing source image for {$name}: {$filename}");
                continue;
            }

            // Copy to public storage with original filename
            $dst = $destFolder . DIRECTORY_SEPARATOR . $filename;
            try {
                File::copy($src, $dst);
            } catch (\Throwable $e) {
                // Overwrite if exists
                try {
                    File::delete($dst);
                } catch (\Throwable $e2) {}
                File::copy($src, $dst);
            }

            $m = $meta[$name] ?? [];
            $slug = Str::slug($name);

            // Upsert product by name
            Product::updateOrCreate(
                ['name' => $name],
                [
                    'price' => $m['price'] ?? 1000.00,
                    'category' => $m['category'] ?? 'General',
                    'description' => $m['description'] ?? ($name . ' — handcrafted item from the Cordillera region.'),
                    'cultural_background' => $m['cultural_background'] ?? 'Cordillera',
                    'materials' => $m['materials'] ?? ['Natural Materials'],
                    'care_instructions' => $m['care_instructions'] ?? 'Handle with care; keep dry; avoid direct sunlight.',
                    'image' => 'storage/products/' . $filename,
                    'user_id' => $weaverId,
                    'stock_quantity' => $m['stock_quantity'] ?? 5,
                    'dimensions' => $m['dimensions'] ?? null,
                    'tags' => $m['tags'] ?? [$slug],
                    'featured' => in_array($name, ['Bulul', 'Inabnutan', 'Itneg', 'Siniwsiwan', 'Binakul']),
                ]
            );
        }

        $this->command?->info('ProductFromLocalImagesSeeder completed. Ensure you have run: php artisan storage:link');
    }
}
