import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { DashboardContent } from "@/Pages/DashboardContent";
import { EventsAttendance } from "@/Pages/Events/EventAttendance";
import { Toaster } from "@/Components/ui/toaster";

// Exportación nombrada y por defecto para mayor compatibilidad
export function DashboardPage() {
    const [currentView, setCurrentView] = useState("dashboard");

    return (
        <div className="min-h-screen bg-background">
            <DashboardLayout
                setCurrentView={setCurrentView}
                currentView={currentView}
            >
                {currentView === "dashboard" && <DashboardContent />}
                {currentView === "mis-asistencias" && <EventsAttendance />}
            </DashboardLayout>
            <Toaster />
        </div>
    );
}

// Exportación por defecto para mantener compatibilidad
export default DashboardPage;
