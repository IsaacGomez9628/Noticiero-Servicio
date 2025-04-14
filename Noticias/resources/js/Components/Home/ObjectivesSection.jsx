import React from "react";
import {
    GraduationCap,
    Network,
    Microscope,
    ArrowRightCircle,
    Users,
    CheckCircle2,
    Lightbulb,
} from "lucide-react";

export default function ObjectivesSection() {
    const objectives = [
        {
            title: "Desarrollar programas de formación especializados",
            icon: <GraduationCap className="w-8 h-8 text-white" />,
        },
        {
            title: "Fomentar la colaboración con la industria",
            icon: <Network className="w-8 h-8 text-white" />,
        },
        {
            title: "Impulsar la Investigación y el Desarrollo",
            icon: <Microscope className="w-8 h-8 text-white" />,
        },
        {
            title: "Facilitar el acceso a recursos y tecnologías",
            icon: <ArrowRightCircle className="w-8 h-8 text-white" />,
        },
        {
            title: "Fomentar la inclusión y diversidad en la Tecnología",
            icon: <Users className="w-8 h-8 text-white" />,
        },
        {
            title: "Establecer estándares de calidad y mejora continua",
            icon: <CheckCircle2 className="w-8 h-8 text-white" />,
        },
        {
            title: "Difundir conocimientos y buenas prácticas",
            icon: <Lightbulb className="w-8 h-8 text-white" />,
        },
        {
            title: "Crear una red de expertos y comunidad de aprendizaje",
            icon: <Lightbulb className="w-8 h-8 text-white" />,
        },
    ];

    return (
        <section className="py-16 relative overflow-hidden">
            {/* Fondo con patrón sutil */}
            <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-white opacity-70 z-0"></div>
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTItMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 z-0"></div>

            <div className="container mx-auto px-4 relative z-10">
                <div className="mb-16">
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-8 py-3 text-4xl font-bold text-gray-900 rounded-full shadow-md">
                                Nuestros objetivos
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {objectives.map((objective, index) => (
                        <div key={index} className="group transition-all duration-300 hover:scale-[1.015]">
                        <div className="bg-white rounded-xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] flex flex-col h-full hover:ring-[2.5px] hover:ring-cyan-300/50 transition duration-500">
                            <div className="bg-gradient-to-r from-[#2563eb] to-[#06b6d4] p-4 flex items-center">
                            <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center shadow-inner">
                                {objective.icon}
                            </div>
                            </div>
                            <div className="p-6 flex-grow">
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {objective.title}
                            </h3>
                            <div className="w-12 h-1 bg-gradient-to-r from-[#2563eb] to-[#06b6d4] rounded-full mb-4 transition-all duration-300 group-hover:w-20"></div>
                            </div>
                        </div>
                        </div>
                    ))}
                </div>



            </div>
        </section>
    );
}
