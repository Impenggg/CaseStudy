<?php

namespace App\Http\Requests\Product;

use Illuminate\Foundation\Http\FormRequest;

class ProductStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0',
            'category' => 'required|string|max:255',
            'description' => 'required|string',
            'cultural_background' => 'nullable|string',
            'materials' => 'required|array',
            'materials.*' => 'string',
            'care_instructions' => 'required|string',
            'image' => 'nullable|file|image|mimes:jpg,jpeg,png,webp,jfif|max:4096',
            'stock_quantity' => 'required|integer|min:0',
            'dimensions' => 'nullable|array',
            'tags' => 'nullable|array',
            'tags.*' => 'string',
            'featured' => 'boolean',
        ];
    }
}
