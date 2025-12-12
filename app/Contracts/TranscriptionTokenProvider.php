<?php

namespace App\Contracts;

interface TranscriptionTokenProvider
{
    public function generateEphemeralToken(): string;
}

