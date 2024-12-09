<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Product;

class ProductSeeder extends Seeder
{
    public function run()
    {
        $products = [
            [
                'barcode' => 'FEAT001',
                'name' => 'Premium Headphones',
                'description' => 'High-quality wireless headphones with noise cancellation',
                'price' => 199.99,
                'quantity' => 50,
                'category' => 'Electronics',
                'featured' => true
            ],
            [
                'barcode' => 'FEAT002',
                'name' => 'Smart Watch',
                'description' => 'Advanced fitness tracking and notifications',
                'price' => 299.99,
                'quantity' => 30,
                'category' => 'Electronics',
                'featured' => true
            ],
            // Add more featured products as needed
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
} 