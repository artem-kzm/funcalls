<?php

namespace App\Http\Requests;

use App\Enums\TranscriptionProvider;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class TranscriptionTokenRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    /**
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'provider' => ['required', 'string', Rule::enum(TranscriptionProvider::class)],
        ];
    }

    public function provider(): TranscriptionProvider
    {
        return TranscriptionProvider::from($this->input('provider'));
    }
}

