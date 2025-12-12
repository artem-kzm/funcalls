<?php

namespace App\Services\Transcription;

use App\Contracts\TranscriptionTokenProvider;

class DeepgramTranscriptionProvider implements TranscriptionTokenProvider
{
    public function generateEphemeralToken(): string
    {
        return "just-a-mock-token";
    }
}

