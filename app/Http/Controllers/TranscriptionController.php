<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProcessTranscriptionRequest;
use App\Jobs\ProcessTranscription;
use Illuminate\Http\JsonResponse;

class TranscriptionController extends Controller
{
    public function process(ProcessTranscriptionRequest $request): JsonResponse
    {
        $user = $request->user();
        $transcript = $request->transcript();

        ProcessTranscription::dispatch(
            userId: $user->id,
            transcript: $transcript,
        );

        return response()->json();
    }
}

