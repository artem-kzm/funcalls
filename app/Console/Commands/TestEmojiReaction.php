<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Events\EmojiReaction;

class TestEmojiReaction extends Command
{
    protected $signature = 'test:emoji {emoji} {affectedUserId} {participantUserId}';

    protected $description = 'Test emoji reaction broadcast. Usage: test:emoji "❤️" 1 2';

    public function handle(): int
    {
        $emoji = $this->argument('emoji');
        $affectedUserId = $this->argument('affectedUserId');
        $participantUserId = $this->argument('participantUserId');

        $this->info("Broadcasting emoji reaction: {$emoji}");

        broadcast(new EmojiReaction($emoji, $affectedUserId, $participantUserId));

        $this->info('✅ Emoji reaction broadcasted successfully!');

        return 0;
    }
}
