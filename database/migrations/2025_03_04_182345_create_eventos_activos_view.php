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
        DB::statement("CREATE VIEW `eventos_activos` AS select `noticias`.`eventos`.`id` AS `id`,`noticias`.`eventos`.`direccion_id` AS `direccion_id`,`noticias`.`eventos`.`status_id` AS `status_id`,`noticias`.`eventos`.`organizador_id` AS `organizador_id`,`noticias`.`eventos`.`titulo` AS `titulo`,`noticias`.`eventos`.`capacidad` AS `capacidad`,`noticias`.`eventos`.`fecha_inicio` AS `fecha_inicio`,`noticias`.`eventos`.`fecha_fin` AS `fecha_fin`,`noticias`.`eventos`.`multimedia_id` AS `multimedia_id`,`noticias`.`eventos`.`descripcion` AS `descripcion`,`noticias`.`eventos`.`eliminado` AS `eliminado`,`noticias`.`eventos`.`fecha_eliminacion` AS `fecha_eliminacion`,`noticias`.`eventos`.`eliminado_por` AS `eliminado_por` from `noticias`.`eventos` where `noticias`.`eventos`.`eliminado` = 0");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `eventos_activos`");
    }
};
