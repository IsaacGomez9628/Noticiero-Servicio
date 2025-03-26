<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PermissionRol extends Model
{
    /** @use HasFactory<\Database\Factories\PermissionRolFactory> */
    use HasFactory;
    
    // Especificar el nombre de la tabla
    protected $table = 'permission_rol';
    
    // Establecer la clave primaria compuesta
    protected $primaryKey = ['permission_id', 'rol_id'];
    
    // Indicar que la clave primaria no es auto-incremental
    public $incrementing = false;
    
    // Relación con Permission (una asignación pertenece a un permiso)
    public function permission()
    {
        return $this->belongsTo(Permissions::class);
    }
    
    // Relación con Rol (una asignación pertenece a un rol)
    public function rol()
    {
        return $this->belongsTo(Roles::class);
    }
}