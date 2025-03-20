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
        // Primero elimina el procedimiento si existe
        DB::unprepared("DROP PROCEDURE IF EXISTS RestaurarRegistro");
        
        // Luego crea el procedimiento
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `RestaurarRegistro`(
    IN tabla VARCHAR(50),
    IN registro_id INT
)
BEGIN
    DECLARE sql_query VARCHAR(500);
    
    -- Construir la consulta dinámicamente
    SET @sql_query = CONCAT('UPDATE ', tabla, 
                           ' SET eliminado = FALSE, fecha_eliminacion = NULL, eliminado_por = NULL',
                           ' WHERE id = ', registro_id);
    
    -- Preparar y ejecutar la consulta
    PREPARE stmt FROM @sql_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    SELECT CONCAT('Registro ', registro_id, ' de la tabla ', tabla, ' restaurado') AS mensaje;
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS RestaurarRegistro");
    }
};