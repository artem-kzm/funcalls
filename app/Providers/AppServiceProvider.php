<?php

namespace App\Providers;

use App\Contracts\IceServersProvider;
use App\Services\IceServers\CloudflareIceServerProvider;
use App\Services\IceServers\FreeIceServerProvider;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        $this->app->singleton(IceServersProvider::class, function () {
            $provider = config('iceServers.provider', 'free');

            return match ($provider) {
                'cloudflare' => new CloudflareIceServerProvider(),
                'free' => new FreeIceServerProvider(),
            };
        });
    }

    public function boot(): void
    {
        //
    }
}
