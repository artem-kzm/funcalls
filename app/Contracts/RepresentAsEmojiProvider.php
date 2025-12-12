<?php

namespace App\Contracts;

interface RepresentAsEmojiProvider
{
    public function analyze(string $transcript): string;
}
