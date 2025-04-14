// En el componente MisAsistencias.jsx
function MisAsistencias({ asistencias, asistenciasInstitucionales, tieneAsistencias }) {
    // Función para formatear fechas
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha pendiente";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <h2 className="text-2xl font-bold mb-6">Mis Asistencias</h2>

            {!tieneAsistencias ? (
                <div className="flex flex-col items-center justify-center p-10 bg-gray-50 rounded-lg border border-gray-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">
                        No tienes eventos registrados
                    </h3>
                    <p className="text-gray-500 text-center mb-6">
                        Explora los eventos disponibles y regístrate para verlos aquí.
                    </p>
                    <Link href={route('eventos.index')}>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            Ver eventos disponibles
                        </button>
                    </Link>
                </div>
            ) : (
                <div className="space-y-6">
                    {asistencias.map((asistencia) => (
                        <div key={asistencia.id} className="border rounded-md p-4 mb-4 hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-medium">
                                        {asistencia.event?.titulo || asistencia.event?.titule || "Evento sin título"}
                                    </h3>
                                    <p className="text-gray-500">
                                        {formatDate(asistencia.event?.fecha_inicio || asistencia.event?.start_date)}
                                    </p>
                                    <p className="text-gray-500">
                                        {asistencia.event?.location?.name ||
                                         asistencia.event?.direccion?.direccion_completa ||
                                         "Ubicación por confirmar"}
                                    </p>
                                    <p className="mt-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                asistencia.status?.slug === "confirmado"
                                                    ? "bg-green-100 text-green-800"
                                                    : asistencia.status?.slug === "cancelado"
                                                    ? "bg-red-100 text-red-800"
                                                    : "bg-yellow-100 text-yellow-800"
                                            }`}
                                        >
                                            {asistencia.status?.nombre || asistencia.status?.name || "Pendiente"}
                                        </span>
                                    </p>
                                </div>

                                {/* Botón de cancelar (solo muestra si no está cancelada) */}
                                {asistencia.status?.slug !== "cancelado" && (
                                    <form
                                        method="POST"
                                        action={route('eventos.asistencia.cancelar', asistencia.id)}
                                    >
                                        <input
                                            type="hidden"
                                            name="_token"
                                            value={document
                                                .querySelector(
                                                    'meta[name="csrf-token"]'
                                                )
                                                ?.getAttribute("content")}
                                        />
                                        <button
                                            type="submit"
                                            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
                                            onClick={(e) => {
                                                if (
                                                    !confirm(
                                                        "¿Estás seguro de cancelar tu asistencia?"
                                                    )
                                                ) {
                                                    e.preventDefault();
                                                }
                                            }}
                                        >
                                            Cancelar asistencia
                                        </button>
                                    </form>
                                )}
                            </div>
                        </div>
                    ))}

                    {asistenciasInstitucionales.length > 0 && (
                        <div className="mt-10">
                            <h3 className="text-xl font-bold mb-4">Asistencias Institucionales</h3>
                            {asistenciasInstitucionales.map((asistencia) => (
                                <div key={asistencia.id} className="border rounded-md p-4 mb-4 hover:shadow-md transition-shadow">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-lg font-medium">
                                                {asistencia.event?.titulo || asistencia.event?.titule || "Evento sin título"}
                                            </h3>
                                            <p className="text-gray-500">
                                                {formatDate(asistencia.event?.fecha_inicio || asistencia.event?.start_date)}
                                            </p>
                                            <p className="text-gray-500">
                                                {asistencia.event?.location?.name ||
                                                 asistencia.event?.direccion?.direccion_completa ||
                                                 "Ubicación por confirmar"}
                                            </p>
                                            <p className="mt-2">
                                                <span
                                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        asistencia.status?.slug === "confirmado"
                                                            ? "bg-green-100 text-green-800"
                                                            : asistencia.status?.slug === "cancelado"
                                                            ? "bg-red-100 text-red-800"
                                                            : "bg-yellow-100 text-yellow-800"
                                                    }`}
                                                >
                                                    {asistencia.status?.nombre || asistencia.status?.name || "Pendiente"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
