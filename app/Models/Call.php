<?php

namespace App\Models;

use App\Enums\CallStatus;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Call extends Model
{
    protected $fillable = [
        'caller_id',
        'receiver_id',
        'status',
        'started_at',
        'ended_at',
    ];

    protected $casts = [
        'status' => CallStatus::class,
        'started_at' => 'datetime',
        'ended_at' => 'datetime',
    ];

    public function caller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'caller_id');
    }

    public function receiver(): BelongsTo
    {
        return $this->belongsTo(User::class, 'receiver_id');
    }

    public function getOtherParticipant(int $userId): ?User
    {
        if ($this->caller_id === $userId) {
            return $this->receiver;
        }

        if ($this->receiver_id === $userId) {
            return $this->caller;
        }

        return null;
    }

    public function isParticipant(int $userId): bool
    {
        return $this->caller_id === $userId || $this->receiver_id === $userId;
    }


    /**
     * Scopes
     */

    public function scopeActive($query)
    {
        return $query->where('status', CallStatus::ACTIVE);
    }

    public function scopeRinging($query)
    {
        return $query->where('status', CallStatus::RINGING);
    }

    public function scopeForUser($query, int $userId)
    {
        return $query->where(function ($q) use ($userId) {
            $q->where('caller_id', $userId)
              ->orWhere('receiver_id', $userId);
        });
    }
}
