<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;

class CheckProducts extends Command
{
    protected $signature = 'products:check';
    protected $description = 'Check products and their moderation status';

    public function handle()
    {
        $products = Product::all(['id', 'name', 'moderation_status', 'user_id']);
        
        $this->info('Products with moderation status:');
        $this->line('');
        
        foreach ($products as $product) {
            $status = $product->moderation_status ?: 'null';
            $this->line("ID: {$product->id} | {$product->name} | Status: {$status} | User: {$product->user_id}");
        }
        
        return 0;
    }
}
