<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Estate extends Model
{
    /** @use HasFactory<\Database\Factories\EstateFactory> */
    use HasFactory;

    public function location (){
        return $this->hasMany(Location::class, 'estate_id');
    }
}
