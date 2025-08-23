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

    public function getImageUrlAttribute(): string
    {
        return url(\Illuminate\Support\Facades\Storage::url($this->image_path));
    }
}
