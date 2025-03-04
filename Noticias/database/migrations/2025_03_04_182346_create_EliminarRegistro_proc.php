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
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `EliminarRegistro`(
    IN tabla VARCHAR(50),
    IN registro_id INT,
    IN admin_id INT,
    IN motivo VARCHAR(255)
)
BEGIN
    DECLARE sql_query VARCHAR(500);
    
    -- Construir la consulta dinámicamente
    SET @sql_query = CONCAT('UPDATE ', tabla, 
                           ' SET eliminado = TRUE, fecha_eliminacion = NOW(), eliminado_por = ', admin_id,
                           ' WHERE id = ', registro_id);
    
    -- Preparar y ejecutar la consulta
    PREPARE stmt FROM @sql_query;
    EXECUTE stmt;
    DEALLOCATE PREPARE stmt;
    
    -- Insertar en historial para auditoría (opcional)
    INSERT INTO Historial_Eliminaciones (tabla, registro_id, datos, eliminado_por, motivo)
    VALUES (tabla, registro_id, JSON_OBJECT('id', registro_id, 'eliminado_por', admin_id), admin_id, motivo);
    
    SELECT CONCAT('Registro ', registro_id, ' de la tabla ', tabla, ' eliminado lógicamente') AS mensaje;
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS EliminarRegistro");
    }
};
