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
        DB::statement("CREATE VIEW `personas_activas` AS select `noticias`.`personas`.`id` AS `id`,`noticias`.`personas`.`nombres` AS `nombres`,`noticias`.`personas`.`apellido_paterno` AS `apellido_paterno`,`noticias`.`personas`.`apellido_materno` AS `apellido_materno`,`noticias`.`personas`.`fecha_nacimiento` AS `fecha_nacimiento`,`noticias`.`personas`.`genero` AS `genero`,`noticias`.`personas`.`fecha_registro` AS `fecha_registro`,`noticias`.`personas`.`eliminado` AS `eliminado`,`noticias`.`personas`.`fecha_eliminacion` AS `fecha_eliminacion`,`noticias`.`personas`.`eliminado_por` AS `eliminado_por` from `noticias`.`personas` where `noticias`.`personas`.`eliminado` = 0");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `personas_activas`");
    }
};
