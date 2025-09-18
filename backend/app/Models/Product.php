<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

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
        // Moderation
        'moderation_status',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
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
     * Automatically append computed attributes to model's array / JSON form.
     */
    protected $appends = [
        'image_url',
        'images_array',
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
     * Scope a query to only include approved products.
     */
    public function scopeApproved($query)
    {
        return $query->where('moderation_status', 'approved');
    }

    /**
     * Scope a query to only include pending products.
     */
    public function scopePending($query)
    {
        return $query->where('moderation_status', 'pending');
    }

    /**
     * Scope a query to only include rejected products.
     */
    public function scopeRejected($query)
    {
        return $query->where('moderation_status', 'rejected');
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

    /**
     * Computed full URL for the main image.
     */
    public function getImageUrlAttribute(): string
    {
        $raw = (string) ($this->attributes['image'] ?? '');
        if ($raw === '') {
            return '';
        }
        // Already absolute
        if (str_starts_with($raw, 'http://') || str_starts_with($raw, 'https://')) {
            return $raw;
        }
        // Normalize leading slashes
        $path = ltrim($raw, "/\\");
        // If the path already starts with 'storage/', serve as-is via asset()
        if (str_starts_with($path, 'storage/')) {
            $relative = substr($path, strlen('storage/'));
        } else {
            $relative = $path; // assume relative to public disk
            $path = 'storage/' . $path;
        }

        // If referenced file is missing, attempt to best-match by product name in products/ directory
        if (!empty($relative) && !Storage::disk('public')->exists($relative)) {
            try {
                $files = collect(Storage::disk('public')->files('products'));
                $name = (string) ($this->attributes['name'] ?? '');

                // Build multiple normalized variants from product name
                $stripParens = trim(preg_replace('/\s*\(.*?\)\s*/', '', $name));
                $lower = strtolower($stripParens);
                $noPunct = strtolower(preg_replace('/[^a-z0-9\s]+/i', '', $stripParens));
                $collapsed = preg_replace('/\s+/', ' ', $noPunct);
                $noSpaces = str_replace(' ', '', $collapsed);
                $slug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $stripParens));
                $firstToken = strtok($noPunct, ' ');

                $candidates = collect([$lower, $noPunct, $collapsed, $noSpaces, $slug, $firstToken])
                    ->filter()
                    ->unique();

                $best = $files->first(function ($f) use ($candidates) {
                    $baseRaw = pathinfo($f, PATHINFO_FILENAME);
                    $base = strtolower($baseRaw);
                    $baseNoPunct = strtolower(preg_replace('/[^a-z0-9\s]+/i', '', $base));
                    $baseNoSpaces = str_replace(' ', '', preg_replace('/\s+/', ' ', $baseNoPunct));
                    $baseSlug = strtolower(preg_replace('/[^a-z0-9]+/i', '-', $base));
                    $fileVariants = collect([$base, $baseNoPunct, $baseNoSpaces, $baseSlug])->unique();
                    foreach ($candidates as $needle) {
                        foreach ($fileVariants as $variant) {
                            if ($needle !== '' && ($variant !== '' && (str_contains($variant, $needle) || str_contains($needle, $variant)))) {
                                return true;
                            }
                        }
                    }
                    return false;
                });
                if ($best) {
                    return asset('storage/' . ltrim($best, '/\\'));
                }
            } catch (\Throwable $e) {
                // ignore and fallback
            }
            // Graceful placeholder based on category
            $q = urlencode($this->category ?: 'handicraft');
            return "https://source.unsplash.com/800x600/?{$q}";
        }

        return asset($path);
    }
}
