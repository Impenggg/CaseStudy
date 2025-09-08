<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class StoryMedia extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'story_id',
        'media_url',
        'media_type',
        'alt_text',
        'sort_order',
    ];

    /**
     * Auto-append computed full URL for media assets.
     */
    protected $appends = [
        'media_url',
    ];

    /**
     * Get the story for this media.
     */
    public function story()
    {
        return $this->belongsTo(Story::class);
    }

    /**
     * Accessor: normalize stored media_url into an absolute, web-accessible URL.
     */
    public function getMediaUrlAttribute(): string
    {
        $raw = (string) ($this->attributes['media_url'] ?? '');
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
