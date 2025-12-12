<?php

namespace App\Services\RepresentAsEmoji;

use App\Contracts\RepresentAsEmojiProvider;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAIAnalyzer implements RepresentAsEmojiProvider
{
    private const MODEL = 'gpt-4.1-mini-2025-04-14';
    private const RESPONSES_ENDPOINT = 'https://api.openai.com/v1/responses';

    public function analyze(string $transcript): string
    {
        $instructions = 'You are an emoji expert.
        The user will provide a transcript of a conversation or speech.
        Respond with only ONE emoji that best represents the sentiment/topic.
        The emoji should be relevant to the overall content of the transcript.
        Do not include any text, only the emoji character.
        Possible emojis: 😀, 😢, 😡, ❤️, 😂, 🤔, 🎉, 😊, 🧠, 🌟, 💩, 👍, 👎.
        If no emoji is relevant, respond with empty string.
        ';

        $payload = [
            'model' => self::MODEL,
            'instructions' => $instructions,
            'input' => $transcript,
        ];

        $response = Http::withToken(config('services.openai.key'))
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])->post(self::RESPONSES_ENDPOINT, $payload);

        if (!$response->successful()) {
            return '';
        }

        $output = collect($response->json('output', []));

        $message = $output->first(fn($item) =>
            ($item['type'] ?? null) === 'message' &&
            ($item['status'] ?? null) === 'completed' &&
            is_array($item['content'] ?? null)
        );

        if (!$message) {
            return '';
        }

        $content = collect($message['content']);
        $outputText = $content->first(fn($item) =>
            ($item['type'] ?? null) === 'output_text'
        );

        return $outputText['text'] ?? '';
    }
}

