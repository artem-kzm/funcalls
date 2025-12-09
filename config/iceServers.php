<?php

return [

    /*
    |--------------------------------------------------------------------------
    | ICE Servers Provider
    |--------------------------------------------------------------------------
    |
    | This value determines which ICE servers provider will be used for WebRTC
    | connections. Supported values: "free", "cloudflare"
    |
    | - free: Uses free public STUN/TURN servers (Google STUN + OpenRelay TURN)
    | - cloudflare: Uses Cloudflare's TURN servers
    |
    */

    'provider' => env('ICE_SERVERS_PROVIDER', 'free'),
];

