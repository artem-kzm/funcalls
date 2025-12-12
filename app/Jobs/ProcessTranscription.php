<?php

namespace App\Jobs;

use App\Enums\CallStatus;
use App\Enums\RepresentAsEmojiProvider;
use App\Events\EmojiReaction;
use App\Models\Call;
use App\Services\RepresentAsEmoji\RepresentAsEmojiFactory;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;

class ProcessTranscription implements ShouldQueue
{
    use Queueable;

    public function __construct(
        public readonly int $userId,
        public readonly string $transcript,
    ) {}

    public function handle(): void
    {
        $call = $this->getActiveCall();

        if (!$call) {
            return;
        }

        $analyzer = RepresentAsEmojiFactory::make(
            RepresentAsEmojiProvider::OPENAI
        );

        $emoji = $analyzer->analyze($this->transcript);

        if (!$emoji) {
            return;
        }

        $participantUserId = $call->caller_id === $this->userId
            ? $call->receiver_id
            : $call->caller_id;

        broadcast(new EmojiReaction($emoji, $this->userId, $participantUserId));
    }

    private function getActiveCall(): ?Call
    {
        return Call::where(function ($query) {
            $query->where('caller_id', $this->userId)
                ->orWhere('receiver_id', $this->userId);
        })
            ->where('status', CallStatus::ACTIVE)
            ->first();
    }
}
