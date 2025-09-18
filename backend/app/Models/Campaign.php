<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Campaign extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'goal_amount',
        'current_amount',
        'end_date',
        'organizer_id',
        'image',
        'category',
        'status',
        'backers_count',
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
        'goal_amount' => 'decimal:2',
        'current_amount' => 'decimal:2',
        'end_date' => 'date',
    ];

    /**
     * Get the organizer of this campaign.
     */
    public function organizer()
    {
        return $this->belongsTo(User::class, 'organizer_id');
    }

    /**
     * Get the donations for this campaign.
     */
    public function donations()
    {
        return $this->hasMany(Donation::class);
    }

    /**
     * Get the images for this campaign.
     */
    public function images()
    {
        return $this->hasMany(CampaignImage::class);
    }

    /**
     * Get the primary image for this campaign.
     */
    public function primaryImage()
    {
        return $this->hasOne(CampaignImage::class)->where('is_primary', true);
    }

    /**
     * Scope a query to only include active campaigns.
     */
    public function scopeActive($query)
    {
        return $query->where('status', 'active');
    }

    /**
     * Scope a query to only include approved campaigns.
     */
    public function scopeApproved($query)
    {
        return $query->where('moderation_status', 'approved');
    }

    /**
     * Scope a query to only include pending campaigns.
     */
    public function scopePending($query)
    {
        return $query->where('moderation_status', 'pending');
    }

    /**
     * Scope a query to only include rejected campaigns.
     */
    public function scopeRejected($query)
    {
        return $query->where('moderation_status', 'rejected');
    }

    /**
     * Scope a query to only include completed campaigns.
     */
    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    /**
     * Scope a query to filter by category.
     */
    public function scopeByCategory($query, $category)
    {
        return $query->where('category', $category);
    }

    /**
     * Scope a query to search campaigns.
     */
    public function scopeSearch($query, $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('title', 'like', "%{$search}%")
              ->orWhere('description', 'like', "%{$search}%");
        });
    }

    /**
     * Get the progress percentage of the campaign.
     */
    public function getProgressPercentageAttribute()
    {
        if ($this->goal_amount == 0) {
            return 0;
        }
        return min(100, round(($this->current_amount / $this->goal_amount) * 100, 2));
    }

    /**
     * Get the days remaining for the campaign.
     */
    public function getDaysRemainingAttribute()
    {
        return max(0, now()->diffInDays($this->end_date, false));
    }

    /**
     * Check if the campaign is ending soon (within 7 days).
     */
    public function getIsEndingSoonAttribute()
    {
        return $this->days_remaining <= 7 && $this->days_remaining > 0;
    }

    /**
     * Check if the campaign has reached its goal.
     */
    public function getHasReachedGoalAttribute()
    {
        return $this->current_amount >= $this->goal_amount;
    }

    /**
     * Update campaign status based on end date and goal.
     */
    public function updateStatus()
    {
        if ($this->end_date->isPast()) {
            $this->status = 'completed';
        } elseif ($this->current_amount >= $this->goal_amount) {
            $this->status = 'completed';
        } else {
            $this->status = 'active';
        }
        $this->save();
    }
}
