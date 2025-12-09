<?php

namespace App\Enums;

enum WebRTCSignalType: string
{
    case OFFER = 'offer';
    case ANSWER = 'answer';
    case ICE_CANDIDATE = 'ice-candidate';
}
