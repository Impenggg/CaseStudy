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
     * Get the story for this media.
     */
    public function story()
    {
        return $this->belongsTo(Story::class);
    }
}
