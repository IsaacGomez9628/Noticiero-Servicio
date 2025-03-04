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
        DB::statement("CREATE VIEW `comentarios_activos` AS select `noticias`.`comentarios`.`id` AS `id`,`noticias`.`comentarios`.`usuario_id` AS `usuario_id`,`noticias`.`comentarios`.`tipo_contenido_id` AS `tipo_contenido_id`,`noticias`.`comentarios`.`noticia_id` AS `noticia_id`,`noticias`.`comentarios`.`comentario` AS `comentario`,`noticias`.`comentarios`.`fecha_creacion` AS `fecha_creacion`,`noticias`.`comentarios`.`fecha_actualizacion` AS `fecha_actualizacion`,`noticias`.`comentarios`.`status_id` AS `status_id`,`noticias`.`comentarios`.`eliminado` AS `eliminado`,`noticias`.`comentarios`.`fecha_eliminacion` AS `fecha_eliminacion`,`noticias`.`comentarios`.`eliminado_por` AS `eliminado_por` from `noticias`.`comentarios` where `noticias`.`comentarios`.`eliminado` = 0");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `comentarios_activos`");
    }
};
