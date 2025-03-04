<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Status extends Model
{
    use HasFactory;

    protected $table = 'status';
    
    public $timestamps = false;
    
    protected $fillable = [
        'nombre',
        'descripcion',
        'tipo',
        'eliminado',
        'fecha_eliminacion',
        'eliminado_por'
    ];
    
    protected $dates = [
        'fecha_eliminacion'
    ];
    
    // Relaciones
    public function usuarios()
    {
        return $this->hasMany(Usuario::class);
    }
    
    public function superAdmins()
    {
        return $this->hasMany(SuperAdmin::class);
    }
    
    public function noticias()
    {
        return $this->hasMany(Noticia::class);
    }
    
    public function eventos()
    {
        return $this->hasMany(Evento::class);
    }
    
    public function comentarios()
    {
        return $this->hasMany(Comentario::class);
    }
    
    public function miembros()
    {
        return $this->hasMany(Miembro::class);
    }
    
    public function microCredenciales()
    {
        return $this->hasMany(MicroCredencial::class);
    }
    
    public function asistenciaEventos()
    {
        return $this->hasMany(AsistenciaEvento::class);
    }
}