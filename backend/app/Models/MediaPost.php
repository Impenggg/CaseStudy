<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class MediaPost extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'caption',
        'image_path',
        // Moderation
        'moderation_status',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    protected $appends = [
        'image_url',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(MediaComment::class)->latest();
    }

    public function reactions(): HasMany
    {
        return $this->hasMany(MediaReaction::class);
    }

    /**
     * Scope a query to only include approved posts.
     */
    public function scopeApproved($query)
    {
        return $query->where('moderation_status', 'approved');
    }

    /**
     * Scope a query to only include pending posts.
     */
    public function scopePending($query)
    {
        return $query->where('moderation_status', 'pending');
    }

    /**
     * Scope a query to only include rejected posts.
     */
    public function scopeRejected($query)
    {
        return $query->where('moderation_status', 'rejected');
    }

    public function getImageUrlAttribute(): string
    {
        if (empty($this->image_path)) {
            return '';
        }
        
        // If it's already a full URL, return as is
        if (str_starts_with($this->image_path, 'http')) {
            return $this->image_path;
        }
        
        // Remove any leading slashes to prevent double slashes in URL
        $path = ltrim($this->image_path, '/\\');
        
        // Return the full URL
        return asset('storage/' . $path);
    }
}
