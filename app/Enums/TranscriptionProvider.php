<?php

namespace App\Enums;

enum TranscriptionProvider: string
{
    case OPENAI = 'open-ai';
    case DEEPGRAM = 'deepgram';
}
