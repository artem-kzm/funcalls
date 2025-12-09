<?php

namespace App\Http\Requests;

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
            'nickname' => 'required|string|max:255|unique:users,nickname',
            'password' => 'required|string|min:6',
        ];
    }

    public function nickname(): string
    {
        return $this->input('nickname');
    }

    public function password(): string
    {
        return $this->input('password');
    }

    public function messages(): array
    {
        return [
            'nickname.required' => 'Nickname is required',
            'nickname.unique' => 'This nickname is already taken',
            'password.required' => 'Password is required',
            'password.min' => 'Password must be at least :min characters',
        ];
    }
}
