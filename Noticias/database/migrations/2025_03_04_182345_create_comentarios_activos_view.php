<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Primero elimina la vista si existe
        DB::statement("DROP VIEW IF EXISTS `comentarios_activos`");
        
        // Luego crea la vista
        DB::statement("CREATE VIEW `comentarios_activos` AS 
            select `comentarios`.`id` AS `id`,
            `comentarios`.`usuario_id` AS `usuario_id`,
            `comentarios`.`tipo_contenido_id` AS `tipo_contenido_id`,
            `comentarios`.`noticia_id` AS `noticia_id`,
            `comentarios`.`comentario` AS `comentario`,
            `comentarios`.`fecha_creacion` AS `fecha_creacion`,
            `comentarios`.`fecha_actualizacion` AS `fecha_actualizacion`,
            `comentarios`.`status_id` AS `status_id`,
            `comentarios`.`eliminado` AS `eliminado`,
            `comentarios`.`fecha_eliminacion` AS `fecha_eliminacion`,
            `comentarios`.`eliminado_por` AS `eliminado_por` 
            from `comentarios` 
            where `comentarios`.`eliminado` = 0");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `comentarios_activos`");
    }
};