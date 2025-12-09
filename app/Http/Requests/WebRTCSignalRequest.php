<?php

namespace App\Http\Requests;

use App\Enums\WebRTCSignalType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\Enum;

class WebRTCSignalRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'type' => ['required', new Enum(WebRTCSignalType::class)],
            'data' => ['required', 'string'],
        ];
    }

    public function getType(): WebRTCSignalType
    {
        return WebRTCSignalType::from($this->input('type'));
    }

    public function getData(): string
    {
        return $this->input('data');
    }

    public function messages(): array
    {
        return [
            'type.required' => 'Signal type is required',
            'data.required' => 'Signal data is required',
            'data.string' => 'Signal data must be a string',
        ];
    }
}
