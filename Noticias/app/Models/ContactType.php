<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ContactType extends Model
{
    use HasFactory;

    protected $table = 'contacts_type';

    protected $fillable = [
        'social_network_id',
        'profile_url',
        'deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'deleted' => 'boolean',
        'deleted_at' => 'datetime',
    ];

    public function contacts()
    {
        return $this->hasMany(Contact::class);
    }

    public function socialMedia()
    {
        return $this->belongsTo(SocialNetwork::class);
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}