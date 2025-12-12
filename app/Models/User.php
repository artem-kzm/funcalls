<?php

namespace App\Models;

use App\Enums\CallStatus;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * @var string[]
     */
    protected $fillable = [
        'nickname',
        'password',
    ];

    /**
     * @var string[]
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function isBusy(): bool
    {
        return Call::where(function ($query) {
            $query->where('caller_id', $this->id)
                  ->orWhere('receiver_id', $this->id);
        })
        ->whereIn('status', [CallStatus::RINGING, CallStatus::ACTIVE])
        ->exists();
    }

    public function isInActiveCall(): bool
    {
        return Call::where(function ($query) {
            $query->where('caller_id', $this->id)
                  ->orWhere('receiver_id', $this->id);
        })
        ->where('status', CallStatus::ACTIVE)
        ->exists();
    }
}
