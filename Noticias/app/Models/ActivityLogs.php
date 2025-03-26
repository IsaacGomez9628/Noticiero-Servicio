<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ActivityLogs extends Model
{
    /** @use HasFactory<\Database\Factories\ActivityLogsFactory> */
    use HasFactory;
    
    // Relación con Admin (un registro de actividad pertenece a un admin)
    public function admin()
    {
        return $this->belongsTo(Admins::class);
    }
    
    // Relación polimórfica (un registro puede relacionarse con cualquier modelo)
    public function object()
    {
        return $this->morphTo();
    }
}