<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Company extends Model
{
    use HasFactory;

    protected $table = 'companies';

    protected $fillable = [
        'name',
        'list_companies_id',
        'description',
        'phone',
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
        'deleted' => 'boolean',
    ];
    
    protected $hidden = [
        'deleted_at',
        'deleted',
    ];
    public function listCompany()
    {
        return $this->belongsTo(ListCompany::class, 'list_companies_id');
    }
    
    public function contacts()
    {
        return $this->belongsToMany(Contact::class, 'company_contacts');
    }
}