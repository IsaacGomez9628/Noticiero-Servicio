import React from "react";
import Header from "@/Components/Home/Header";
import Footer from "@/Components/Home/Footer";

export default function LoginLayout({ children, selectedTab = null }) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="container mx-auto px-4 py-8 flex-grow">
                {children}
            </main>
            <Footer />
        </div>
    );
}
