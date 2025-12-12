<?php

namespace App\Services\RepresentAsEmoji;

use App\Contracts\RepresentAsEmojiProvider;
use App\Enums\RepresentAsEmojiProvider as RepresentAsEmojiProviderEnum;
use InvalidArgumentException;

class RepresentAsEmojiFactory
{
    public static function make(RepresentAsEmojiProviderEnum $provider): RepresentAsEmojiProvider
    {
        return match ($provider) {
            RepresentAsEmojiProviderEnum::OPENAI => new OpenAIAnalyzer(),
            RepresentAsEmojiProviderEnum::RULE_BASED => throw new InvalidArgumentException('Rule-based provider not implemented yet'),
        };
    }
}

