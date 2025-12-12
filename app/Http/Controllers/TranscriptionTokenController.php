<?php

namespace App\Http\Controllers;

use App\Http\Requests\TranscriptionTokenRequest;
use App\Services\Transcription\TranscriptionTokenFactory;
use Illuminate\Http\JsonResponse;

class TranscriptionTokenController extends Controller
{
    public function generateEphemeralToken(TranscriptionTokenRequest $request): JsonResponse
    {
        $provider = $request->provider();

        $tokenProvider = TranscriptionTokenFactory::make($provider);
        $token = $tokenProvider->generateEphemeralToken();

        return response()->json([
            'token' => $token,
        ]);
    }
}

