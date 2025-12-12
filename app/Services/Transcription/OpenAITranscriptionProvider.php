<?php

namespace App\Services\Transcription;

use App\Contracts\TranscriptionTokenProvider;
use Illuminate\Support\Facades\Http;

class OpenAITranscriptionProvider implements TranscriptionTokenProvider
{
    private const SESSIONS_ENDPOINT = 'https://api.openai.com/v1/realtime/transcription_sessions';

    public function generateEphemeralToken(): string
    {
        $payload = [
            'input_audio_transcription' => [
                'model' => 'gpt-4o-mini-transcribe',
                'prompt' => 'Casual conversation transcription.',
                'language' => 'en',
            ],
            "turn_detection" => [
                "type" => "server_vad",
                "prefix_padding_ms" => 150,
            ]
        ];

        $response = Http::withToken(config('services.openai.key'))
            ->withHeaders([
                'Content-Type' => 'application/json',
                "openai-beta" => "realtime-v1",
            ])->post(self::SESSIONS_ENDPOINT, $payload);

        if (!$response->successful()) {
            throw new \RuntimeException(
                'Failed to create OpenAI transcription session: ' . $response->body(),
                $response->status()
            );
        }

        return $response->json('client_secret.value');
    }
}

