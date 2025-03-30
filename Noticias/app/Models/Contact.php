<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    use HasFactory;

    protected $table = 'contacts';

    protected $fillable = [
        'person_id',
        'address_id',
        'contact_type_id',
        'email',
        'phone',
        'deleted',
        'deleted_at',
        'deleted_by',
    ];

    protected $casts = [
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
        'deleted' => 'boolean',
    ];

    // Relationships
    public function person()
    {
        return $this->belongsTo(Person::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function contactType()
    {
        return $this->belongsTo(ContactType::class);
    }

    public function companies()
    {
        return $this->belongsToMany(Company::class, 'company_contacts');
    }

    public function deletedBy()
    {
        return $this->belongsTo(User::class, 'deleted_by');
    }
}