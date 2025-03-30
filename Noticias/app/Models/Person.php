<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Person extends Model
{
    protected $table = 'persons';

    protected $fillable = [
        'name',
        'last_name',
        'second_last_name',
        'gender_id',
        'age',
        'birth_date',
    ];


    
    protected $casts = [
        'birth_date' => 'datetime',
        'age' => 'integer',
    ];

    public function user()
    {
        return $this->hasOne(User::class);
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