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
        DB::unprepared("DROP PROCEDURE IF EXISTS PurgarRegistrosAntiguos");
        
        // Luego crea el procedimiento
        DB::unprepared("CREATE DEFINER=`root`@`localhost` PROCEDURE `PurgarRegistrosAntiguos`(
    IN dias_antiguedad INT
)
BEGIN
    DECLARE fecha_limite DATETIME;
    SET fecha_limite = DATE_SUB(NOW(), INTERVAL dias_antiguedad DAY);
    
    -- Eliminar definitivamente registros que fueron marcados como eliminados hace más de los días especificados
    -- NOTA: Este procedimiento debe usarse con precaución y preferiblemente en un proceso controlado
    
    -- Eliminar registros de tablas secundarias primero (para mantener integridad referencial)
    DELETE FROM Asistencia_Eventos 
    WHERE eliminado = TRUE AND fecha_eliminacion < fecha_limite;
    
    DELETE FROM Interaccion_Noticias 
    WHERE eliminado = TRUE AND fecha_eliminacion < fecha_limite;
    
    DELETE FROM Comentarios 
    WHERE eliminado = TRUE AND fecha_eliminacion < fecha_limite;
    
    -- Luego eliminar de tablas principales
    DELETE FROM Noticias 
    WHERE eliminado = TRUE AND fecha_eliminacion < fecha_limite;
    
    DELETE FROM Eventos 
    WHERE eliminado = TRUE AND fecha_eliminacion < fecha_limite;
    
    DELETE FROM Contactos 
    WHERE eliminado = TRUE AND fecha_eliminacion < fecha_limite;
    
    -- Tablas fundamentales al final
    DELETE FROM Usuarios 
    WHERE eliminado = TRUE AND fecha_eliminacion < fecha_limite;
    
    SELECT CONCAT('Registros anteriores a ', fecha_limite, ' han sido eliminados permanentemente') AS mensaje;
END");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::unprepared("DROP PROCEDURE IF EXISTS PurgarRegistrosAntiguos");
    }
};