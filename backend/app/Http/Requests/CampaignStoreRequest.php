<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CampaignStoreRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true; // Policies handle ownership-sensitive actions elsewhere
    }

    public function rules(): array
    {
        return [
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'goal_amount' => 'required|numeric|min:0',
            'end_date' => 'required|date|after:today',
            'image' => 'nullable|string',
            'category' => 'required|in:preservation,education,equipment,community',
        ];
    }
}
