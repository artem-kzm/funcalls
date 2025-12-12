<?php

namespace App\Enums;

enum RepresentAsEmojiProvider: string
{
    case OPENAI = 'openai';
    case RULE_BASED = 'rule-based';
}
