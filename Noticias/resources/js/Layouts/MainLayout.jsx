import React from "react";
import { Head, usePage } from "@inertiajs/react";
import Header from "@/Components/Home/Header";
import Footer from "@/Components/Home/Footer";

export default function MainLayout({
    children,
    title = "Portal de Noticias y Eventos",
}) {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Head title={title} />
            <Header auth={auth} />
            <main className="flex-grow">{children}</main>
            <Footer />
        </div>
    );
}
