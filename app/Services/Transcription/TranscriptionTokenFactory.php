<?php

namespace App\Services\Transcription;

use App\Contracts\TranscriptionTokenProvider;
use App\Enums\TranscriptionProvider;
use InvalidArgumentException;

class TranscriptionTokenFactory
{
    public static function make(TranscriptionProvider $provider): TranscriptionTokenProvider
    {
        return match ($provider) {
            TranscriptionProvider::OPENAI => new OpenAITranscriptionProvider(),
            TranscriptionProvider::DEEPGRAM => new DeepgramTranscriptionProvider(),
        };
    }
}

