<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CampaignUpdateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'goal_amount' => 'sometimes|numeric|min:0',
            'end_date' => 'sometimes|date|after:today',
            'image' => 'nullable|string',
            'category' => 'sometimes|in:preservation,education,equipment,community',
        ];
    }
}
