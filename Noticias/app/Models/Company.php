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
        'user_id', // Añadido campo user_id
    ];

    protected $casts = [
        'deleted_at' => 'datetime',
        'deleted' => 'boolean',
    ];
    
    protected $hidden = [
        'deleted_at',
        'deleted',
    ];
    
    /**
     * Obtiene el tipo de empresa al que pertenece
     */
    public function listCompany()
    {
        return $this->belongsTo(ListCompany::class, 'list_companies_id');
    }
    
    /**
     * Obtiene los contactos asociados a esta empresa
     */
    public function contacts()
    {
        return $this->belongsToMany(Contact::class, 'company_contacts');
    }
    
    /**
     * Obtiene el usuario propietario de esta empresa (relación nueva)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}