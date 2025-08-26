<?php

namespace App\Http\Requests\Story;

use Illuminate\Foundation\Http\FormRequest;

class StoryUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'excerpt' => 'sometimes|string|max:500',
            'media_url' => 'nullable|string',
            'media_type' => 'nullable|in:image,video',
            'category' => 'sometimes|in:tradition,technique,artisan,community',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
            'published' => 'boolean',
        ];
    }
}
