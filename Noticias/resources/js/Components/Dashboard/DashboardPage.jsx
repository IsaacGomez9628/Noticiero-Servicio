import React, { useState } from "react";
import DashboardLayout from "@/Layouts/DashboardLayout";
import { DashboardContent } from "@/Pages/DashboardContent";
import { EventsAttendance } from "@/Pages/Events/EventAttendance";
import { ThemeProvider } from "@/Components/Theme/ThemeProvider";
import { Toaster } from "@/Components/ui/toaster";

export function DashboardPage() {
    const [currentView, setCurrentView] = useState("dashboard");

    return (
        <ThemeProvider defaultTheme="light" storageKey="dashboard-theme">
            <div className="min-h-screen bg-background">
                <DashboardLayout
                    setCurrentView={setCurrentView}
                    currentView={currentView}
                >
                    {currentView === "dashboard" && <DashboardContent />}
                    {currentView === "mis-asistencias" && <EventsAttendance />}
                </DashboardLayout>
            </div>
            <Toaster />
        </ThemeProvider>
    );
}
