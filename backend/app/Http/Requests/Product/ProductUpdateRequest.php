<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'sometimes|string|max:255',
            'price' => 'sometimes|numeric|min:0',
            'category' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'cultural_background' => 'nullable|string',
            'materials' => 'sometimes|array',
            'materials.*' => 'string',
            'care_instructions' => 'sometimes|string',
            'image' => 'nullable|file|image|mimes:jpg,jpeg,png,webp,jfif|max:4096',
            'stock_quantity' => 'sometimes|integer|min:0',
            'dimensions' => 'nullable|array',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
        ];
    }
}
