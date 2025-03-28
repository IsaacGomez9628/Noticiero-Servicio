<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $table = 'persons';

    protected $fillable = [
        'name',
        'apellido_paterno',
        'apellido_materno',
        'gender_id',
        'user_id',
        'age'
    ];
    
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function gender()
    {
        return $this->belongsTo(Gender::class);
    }
    
    public function getFullNameAttribute()
    {
        return "{$this->name} {$this->apellido_paterno} {$this->apellido_materno}";
    }
}