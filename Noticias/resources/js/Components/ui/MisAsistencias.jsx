// En el componente MisAsistencias.jsx o donde muestres tus asistencias
function MisAsistencias({ asistencias }) {
    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">Mis Asistencias</h2>

            {asistencias.map((asistencia) => (
                <div key={asistencia.id} className="border rounded-md p-4 mb-4">
                    <div className="flex justify-between items-start">
                        <div>
                            <h3 className="text-lg font-medium">
                                {asistencia.event.titulo}
                            </h3>
                            <p className="text-gray-500">
                                {formatDate(asistencia.event.start_date)}
                            </p>
                            <p className="text-gray-500">
                                {asistencia.event.location?.name ||
                                    "Ubicación por confirmar"}
                            </p>
                            <p className="mt-2">
                                <span
                                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                                        asistencia.status?.slug === "confirmado"
                                            ? "bg-green-100 text-green-800"
                                            : asistencia.status?.slug ===
                                              "cancelado"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-yellow-100 text-yellow-800"
                                    }`}
                                >
                                    {asistencia.status?.name || "Pendiente"}
                                </span>
                            </p>
                        </div>

                        {/* Botón de cancelar (solo muestra si no está cancelada) */}
                        {asistencia.status?.slug !== "cancelado" && (
                            <form
                                method="POST"
                                action={`/asistencia/${asistencia.id}/cancelar`}
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
        </div>
    );
}
