<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class CallInitiateRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'target_nickname' => 'required|string|max:255|exists:users,nickname',
        ];
    }

    public function targetNickname(): string
    {
        return $this->input('target_nickname');
    }

    public function messages(): array
    {
        return [
            'target_nickname.required' => 'Target nickname is required',
            'target_nickname.string' => 'Target nickname must be a string',
            'target_nickname.max' => 'Target nickname must not exceed 255 characters',
            'target_nickname.exists' => 'User with the specified nickname does not exist',
        ];
    }
}
