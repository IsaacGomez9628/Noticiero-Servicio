<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SuperAdmin extends Model
{
    use HasFactory;

    protected $table = 'super_admins';
    
    public $timestamps = false;
    
    protected $fillable = [
        'persona_id',
        'status_id',
        'email',
        'salt',
        'password',
        'ultima_actualizacion',
        'intentos_fallidos',
        'ultimo_acceso',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por'
    ];
    
    protected $dates = [
        'ultima_actualizacion',
        'ultimo_acceso',
        'fecha_eliminacion'
    ];
    
    protected $hidden = [
        'password',
        'salt'
    ];
    
    // Relaciones
    public function persona()
    {
        return $this->belongsTo(Persona::class);
    }
    
    public function status()
    {
        return $this->belongsTo(Status::class);
    }
}