<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MediaComment extends Model
{
    use HasFactory;

    protected $fillable = [
        'media_post_id',
        'user_id',
        'body',
        // Moderation
        'moderation_status',
        'reviewed_by',
        'reviewed_at',
        'rejection_reason',
    ];

    public function post(): BelongsTo
    {
        return $this->belongsTo(MediaPost::class, 'media_post_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Scope a query to only include approved comments.
     */
    public function scopeApproved($query)
    {
        return $query->where('moderation_status', 'approved');
    }

    /**
     * Scope a query to only include pending comments.
     */
    public function scopePending($query)
    {
        return $query->where('moderation_status', 'pending');
    }

    /**
     * Scope a query to only include rejected comments.
     */
    public function scopeRejected($query)
    {
        return $query->where('moderation_status', 'rejected');
    }
}
