<?php

namespace App\Contracts;

interface IceServersProvider
{
    /**
     * Get ICE servers configuration for WebRTC
     */
    public function getIceServers(): array;
}
