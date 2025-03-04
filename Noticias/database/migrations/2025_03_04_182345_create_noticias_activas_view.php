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
        DB::statement("CREATE VIEW `noticias_activas` AS select `noticias`.`noticias`.`id` AS `id`,`noticias`.`noticias`.`status_id` AS `status_id`,`noticias`.`noticias`.`autor_id` AS `autor_id`,`noticias`.`noticias`.`multimedia_id` AS `multimedia_id`,`noticias`.`noticias`.`titulo` AS `titulo`,`noticias`.`noticias`.`contenido` AS `contenido`,`noticias`.`noticias`.`visitas` AS `visitas`,`noticias`.`noticias`.`ultima_edicion` AS `ultima_edicion`,`noticias`.`noticias`.`fecha_creacion` AS `fecha_creacion`,`noticias`.`noticias`.`eliminado` AS `eliminado`,`noticias`.`noticias`.`fecha_eliminacion` AS `fecha_eliminacion`,`noticias`.`noticias`.`eliminado_por` AS `eliminado_por` from `noticias`.`noticias` where `noticias`.`noticias`.`eliminado` = 0");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `noticias_activas`");
    }
};
