<?php

namespace App\Services\IceServers;

use App\Contracts\IceServersProvider;
use Illuminate\Support\Facades\Http;

class CloudflareIceServerProvider implements IceServersProvider
{
    public function getIceServers(): array
    {
        $appId = config('services.cloudflare.app_id');
        $apiToken = config('services.cloudflare.api_token');

        $response = Http::withToken($apiToken)
            ->withHeaders([
                'Content-Type' => 'application/json',
            ])
            ->post(
                "https://rtc.live.cloudflare.com/v1/turn/keys/{$appId}/credentials/generate-ice-servers", [
                'ttl' => 7200, // 2 hours
            ]);

        if (!$response->successful()) {
            // TODO: properly handle the error
            return [];
        }

        return $response->json();
    }
}

