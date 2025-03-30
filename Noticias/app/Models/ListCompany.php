<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ListCompany extends Model
{
    use HasFactory;

    protected $table = 'list_companies';

    protected $fillable = [
        'name',
    ];

    public function company()
    {
        return $this->hasMany(Company::class);
    }
}