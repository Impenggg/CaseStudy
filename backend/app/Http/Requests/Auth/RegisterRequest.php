<?php

namespace App\Http\Requests\Auth;

use Illuminate\Foundation\Http\FormRequest;

class RegisterRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'name' => 'required|string|min:2|max:255',
            'email' => 'required|string|email:filter|max:255|unique:users,email',
            'password' => [
                'required',
                'string',
                'min:8',
            ],
            'role' => 'sometimes|in:weaver,buyer,artisan,customer',
            'bio' => 'nullable|string|max:1000',
            'location' => 'nullable|string|max:255',
            'terms_accepted' => 'required|accepted',
        ];
    }
}
