<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LoginRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'nickname' => 'required|string',
            'password' => 'required|string',
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
}
