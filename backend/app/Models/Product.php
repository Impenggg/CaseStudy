<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'price',
        'category',
        'description',
        'cultural_background',
        'materials',
        'care_instructions',
        'image',
        'user_id',
        'stock_quantity',
        'dimensions',
        'tags',
        'featured',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'materials' => 'array',
        'dimensions' => 'array',
        'tags' => 'array',
        'featured' => 'boolean',
        'price' => 'decimal:2',
    ];

    /**
     * Get the seller (user) who created this product.
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Get the orders for this product.
     */
    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    /**
     * Get the images for this product.
     */
    public function images()
    {
        return $this->hasMany(ProductImage::class);
    }

    /**
     * Get the primary image for this product.
     */
    public function primaryImage()
    {
        return $this->hasOne(ProductImage::class)->where('is_primary', true);
    }

    /**
     * Scope a query to only include featured products.
     */
    public function scopeFeatured($query)
    {
        return $query->where('featured', true);
    }

    /**
     * Scope a query to only include products in stock.
     */
    public function scopeInStock($query)
    {
        return $query->where('stock_quantity', '>', 0);
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to search products.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%")
              ->orWhere('cultural_background', 'like', "%{$search}%");
        });
    }

    /**
     * Get the images array for API response.
     */
    public function getImagesArrayAttribute()
    {
        return $this->images()->orderBy('sort_order')->pluck('image_url')->toArray();
    }
}
