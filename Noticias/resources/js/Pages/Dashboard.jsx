import React from "react";
import { Head } from "@inertiajs/react";
import { DashboardPage } from "@/Components/Dashboard/DashboardPage";

// Componente principal Dashboard que se usará en la ruta
export default function Dashboard({ eventAttendances = [], stats = {}, user }) {
    return (
        <>
            <Head title="Dashboard" />
            <DashboardPage />
        </>
    );
}
