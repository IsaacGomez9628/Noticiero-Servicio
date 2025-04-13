<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PendingRegistration extends Model
{
    protected $fillable = [
        'email',
        'token',
        'registration_data',
        'registration_type',
        'expires_at'
    ];

    protected $casts = [
        'registration_data' => 'array',
        'expires_at' => 'datetime',
    ];

    public function isExpired()
    {
        return $this->expires_at->isPast();
    }
}
