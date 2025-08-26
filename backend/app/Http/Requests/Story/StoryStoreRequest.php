<?php

namespace App\Http\Requests\Story;

use Illuminate\Foundation\Http\FormRequest;

class StoryStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'excerpt' => 'required|string|max:500',
            'media_url' => 'nullable|string',
            'media_type' => 'nullable|in:image,video',
            'category' => 'required|in:tradition,technique,artisan,community',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
            'published' => 'boolean',
        ];
    }
}
