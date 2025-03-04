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
        DB::statement("CREATE VIEW `usuarios_activos` AS select `noticias`.`usuarios`.`id` AS `id`,`noticias`.`usuarios`.`persona_id` AS `persona_id`,`noticias`.`usuarios`.`tipo_usuario_id` AS `tipo_usuario_id`,`noticias`.`usuarios`.`creado_por_superadmin_id` AS `creado_por_superadmin_id`,`noticias`.`usuarios`.`status_id` AS `status_id`,`noticias`.`usuarios`.`email` AS `email`,`noticias`.`usuarios`.`salt` AS `salt`,`noticias`.`usuarios`.`password` AS `password`,`noticias`.`usuarios`.`ultima_autenticacion` AS `ultima_autenticacion`,`noticias`.`usuarios`.`bloqueado` AS `bloqueado`,`noticias`.`usuarios`.`intentos_fallidos_contraseña` AS `intentos_fallidos_contraseña`,`noticias`.`usuarios`.`eliminado` AS `eliminado`,`noticias`.`usuarios`.`fecha_eliminacion` AS `fecha_eliminacion`,`noticias`.`usuarios`.`eliminado_por` AS `eliminado_por` from `noticias`.`usuarios` where `noticias`.`usuarios`.`eliminado` = 0");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement("DROP VIEW IF EXISTS `usuarios_activos`");
    }
};
