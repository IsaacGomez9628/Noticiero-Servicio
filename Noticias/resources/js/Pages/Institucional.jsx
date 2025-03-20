import React from "react";
import { Link } from "@inertiajs/inertia-react";
import MainLayout from "@/Layouts/MainLayout";
import EventoCard from "@/Components/EventoCard";
import AsistenteRow from "@/Components/AsistenteRow";

export default function Institucional({
    usuario,
    empresa,
    proximosEventos,
    eventosRegistrados,
    asistentesEmpresa,
}) {
    return (
        <MainLayout title="Dashboard Institucional">
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    {/* Bienvenida e información institucional */}
                    <div className="bg-white overflow-hidden shadow-xl sm:rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="md:col-span-2">
                                <h2 className="text-2xl font-semibold text-gray-900">
                                    Bienvenido, {usuario.persona.nombres}
                                </h2>
                                <p className="mt-1 text-sm text-gray-500">
                                    Panel de administración institucional
                                </p>

                                <div className="mt-4">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Institución
                                    </h3>
                                    <p className="text-xl font-bold">
                                        {empresa?.nombre || "No especificada"}
                                    </p>
                                    {empresa?.descripcion && (
                                        <p className="mt-1 text-sm text-gray-600">
                                            {empresa.descripcion}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <div className="bg-gray-50 p-4 rounded-lg">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Resumen
                                </h3>
                                <dl className="mt-2 space-y-3">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            Eventos registrados
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-blue-600">
                                            {eventosRegistrados?.length || 0}
                                        </dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">
                                            Total asistentes registrados
                                        </dt>
                                        <dd className="mt-1 text-3xl font-semibold text-blue-600">
                                            {asistentesEmpresa?.length || 0}
                                        </dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>

                    {/* Próximos eventos */}
                    <div className="mt-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Próximos eventos
                            </h2>
                            <Link
                                href={route("eventos.index")}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Ver todos los eventos
                            </Link>
                        </div>

                        {proximosEventos && proximosEventos.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {proximosEventos.map((evento) => (
                                    <EventoCard
                                        key={evento.id}
                                        evento={evento}
                                    />
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                                No hay eventos próximos programados.
                            </div>
                        )}
                    </div>

                    {/* Asistentes registrados recientemente */}
                    <div className="mt-8">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">
                                Asistentes registrados recientemente
                            </h2>
                            <Link
                                href={route("dashboard.asistentes")}
                                className="text-sm text-blue-600 hover:text-blue-500"
                            >
                                Ver todos los asistentes
                            </Link>
                        </div>

                        {asistentesEmpresa && asistentesEmpresa.length > 0 ? (
                            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                                <ul className="divide-y divide-gray-200">
                                    {asistentesEmpresa
                                        .slice(0, 5)
                                        .map((asistente) => (
                                            <AsistenteRow
                                                key={asistente.id}
                                                asistente={asistente}
                                            />
                                        ))}
                                </ul>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow p-6 text-center text-gray-500">
                                No hay asistentes registrados todavía.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
