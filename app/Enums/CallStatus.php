<?php

namespace App\Enums;

enum CallStatus: string
{
    case RINGING = 'ringing';
    case ACTIVE = 'active';
    case ENDED = 'ended';
    case MISSED = 'missed';
}
