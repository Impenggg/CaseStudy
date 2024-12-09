<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'barcode',
        'name',
        'description',
        'price',
        'quantity',
        'category',
        'featured'
    ];

    protected $casts = [
        'featured' => 'boolean'
    ];

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }
} 