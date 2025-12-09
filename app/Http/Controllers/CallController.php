<?php

namespace App\Http\Controllers;

use App\Enums\CallStatus;
use App\Events\IncomingCall;
use App\Events\CallAnswered;
use App\Events\CallEnded;
use App\Events\WebRTCSignal;
use App\Http\Requests\CallInitiateRequest;
use App\Http\Requests\WebRTCSignalRequest;
use App\Models\Call;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CallController extends Controller
{
    public function initiate(CallInitiateRequest $request): JsonResponse
    {
        /** @var User $caller */
        $caller = $request->user();

        /** @var User $receiver */
        $receiver = User::where('nickname', $request->targetNickname())->first();

        if (!$receiver) {
            return response()->json([
                'success' => false,
                'message' => 'User not found'
            ], 404);
        }

        if ($receiver->id === $caller->id) {
            return response()->json([
                'success' => false,
                'message' => 'Cannot call yourself'
            ], 400);
        }

        if ($caller->isBusy()) {
            return response()->json([
                'success' => false,
                'message' => 'You are already in a call'
            ], 400);
        }

        if ($receiver->isBusy()) {
            return response()->json([
                'success' => false,
                'message' => 'User is busy at the moment'
            ], 400);
        }

        $call = Call::create([
            'caller_id' => $caller->id,
            'receiver_id' => $receiver->id,
            'status' => CallStatus::RINGING,
        ]);

        broadcast(new IncomingCall($caller->nickname, $caller->id, $receiver->id));

        return response()->json([
            'success' => true,
            'message' => 'Call initiated',
            'call_id' => $call->id,
            'target_user' => [
                'id' => $receiver->id,
                'nickname' => $receiver->nickname
            ]
        ]);
    }

    public function answer(Request $request): JsonResponse
    {
        $user = $request->user();

        $call = Call::where('receiver_id', $user->id)
                    ->where('status', CallStatus::RINGING)
                    ->first();

        if (!$call) {
            return response()->json([
                'success' => false,
                'message' => 'No incoming call found'
            ], 404);
        }

        $call->update([
            'status' => CallStatus::ACTIVE,
            'started_at' => now(),
        ]);

        broadcast(new CallAnswered($call->caller_id));

        return response()->json([
            'success' => true,
            'message' => 'Call answered',
            'call_id' => $call->id
        ]);
    }

    public function end(Request $request): JsonResponse
    {
        /** @var User $user */
        $user = $request->user();

        /** @var Call $call */
        $call = Call::forUser($user->id)
                    ->whereIn('status', [CallStatus::ACTIVE, CallStatus::RINGING])
                    ->first();

        if (!$call) {
            return response()->json([
                'success' => false,
                'message' => 'No active call found'
            ], 404);
        }

        $newStatus = $call->status === CallStatus::RINGING ? CallStatus::MISSED : CallStatus::ENDED;

        $call->update([
            'status' => $newStatus,
            'ended_at' => now(),
        ]);

        $otherUser = $call->getOtherParticipant($user->id);

        if ($otherUser) {
            broadcast(new CallEnded($otherUser->id));
        }

        return response()->json([
            'success' => true,
            'message' => 'Call ended'
        ]);
    }

    public function signal(WebRTCSignalRequest $request): JsonResponse
    {
        $user = $request->user();

        $call = Call::forUser($user->id)
                    ->where('status', CallStatus::ACTIVE)
                    ->first();

        if (!$call) {
            return response()->json([
                'success' => false,
                'message' => 'No active call found'
            ], 404);
        }

        $otherUser = $call->getOtherParticipant($user->id);

        if (!$otherUser) {
            return response()->json([
                'success' => false,
                'message' => 'Other participant not found'
            ], 404);
        }

        broadcast(new WebRTCSignal(
            $request->getType(),
            $request->getData(),
            $otherUser->id
        ));

        return response()->json([
            'success' => true,
            'message' => 'Signal sent'
        ]);
    }
}
