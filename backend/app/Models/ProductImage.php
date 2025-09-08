<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProductImage extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'product_id',
        'image_url',
        'alt_text',
        'sort_order',
        'is_primary',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'is_primary' => 'boolean',
    ];

    /**
     * Ensure API responses always return a usable full URL for image_url.
     */
    protected $appends = [
        'image_url',
    ];

    /**
     * Get the product for this image.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Accessor: normalize stored image_url into an absolute, web-accessible URL.
     */
    public function getImageUrlAttribute(): string
    {
        $raw = (string) ($this->attributes['image_url'] ?? '');
        if ($raw === '') {
            return '';
        }
        if (str_starts_with($raw, 'http://') || str_starts_with($raw, 'https://')) {
            return $raw;
        }
        $path = ltrim($raw, "/\\");
        if (str_starts_with($path, 'storage/')) {
            return asset($path);
        }
        return asset('storage/' . $path);
    }
}
