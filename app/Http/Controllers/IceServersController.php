<?php

namespace App\Http\Controllers;

use App\Contracts\IceServersProvider;
use Illuminate\Http\JsonResponse;

class IceServersController extends Controller
{
    public function __construct(
        private readonly IceServersProvider $iceServersProvider
    ) {}

    public function index(): JsonResponse
    {
        $iceServers = $this->iceServersProvider->getIceServers();

        return response()->json($iceServers);
    }
}
