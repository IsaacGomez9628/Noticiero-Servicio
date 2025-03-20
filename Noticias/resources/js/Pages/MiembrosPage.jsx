import { Search, User } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Input } from "@/Components/Input";
import { Button } from "@/Components/Button";
import MainLayout from "@/Layouts/MainLayout";
import sedeq from "@/assets/SEDEQ.jpg";
import img2 from "@/assets/lira.png";
import img5 from "@/assets/hugo.png";
import img4 from "@/assets/mlg.png";
import img6 from "@/assets/olmo.png";
import img7 from "@/assets/manuel.png";
import img8 from "@/assets/victor.png";
import { useState } from "react";

const teamMembers = [
    {
        id: 1,
        image: img2,
        name: "Ana Laura Lira Cortes",
        title: "Investigadora",
        location: "Querétaro, México",
        description:
            "La Dra. Ana Laura Lira Cortes es una destacada académica mexicana. Estudió en la Universidad Autónoma de Querétaro, obteniendo su doctorado en Innovación, Tecnología y Hábitat. Su investigación se enfoca en problemas complejos que afectan la calidad de vida, utilizando tecnología para su abordaje. Actualmente es profesora investigadora en la Universidad Politécnica de Querétaro.",
    },
    {
        id: 2,
        image: img5,
        name: "Hugo Rodríguez Reséndiz",
        title: "Profesor-Investigador",
        location: "Querétaro, México",
        description:
            "Hugo Rodríguez-Reséndiz, originario de Querétaro, México, tiene estudios en humanidades con enfoque en educación, filosofía de la ciencia, ética y bioética. Ha trabajado en innovación tecnológica, gestión del conocimiento y proyectos comunitarios. Es profesor-investigador en la Universidad Autónoma de Querétaro y Coordinador de Educación Colaborativa.",
    },
    {
        id: 3,
        image: img4,
        name: "Maribel Leyva Gaxiola",
        title: "Investigadora",
        location: "Hidalgo, México",
        description:
            "La licenciada en Sistemas Computacionales por la UAEH (2004-2008) continuó su formación con una maestría y doctorado en Gestión Tecnológica e Innovación en la UAQ. Su investigación se enfoca en Prospectiva y Difusión de Tecnologías. Ha participado activamente en congresos y proyectos innovadores, además de gestionar patentes y planes de negocio.",
    },
    {
        id: 4,
        image: img6,
        name: "Carlos Alberto Olmos Trejo",
        title: "Director General de Bibliotecas",
        location: "Querétaro, México",
        description:
            "Carlos Alberto Olmos Trejo es profesor de tiempo completo en la Facultad de Informática de la Universidad Autónoma de Querétaro. Actualmente, es Director General de Bibliotecas y Servicios Digitales de Información desde enero de 2024. Anteriormente, fue Coordinador de la Maestría en Sistemas Computacionales y Secretario Académico de la Facultad de Informática.",
    },
    {
        id: 5,
        image: img7,
        name: "Juan Manuel Peña Aguilar",
        title: "Coordinador de Posgrado",
        location: "Querétaro, México",
        description:
            "Juan Manuel Peña Aguilar cuenta con un Doctorado en Gestión Tecnológica e Innovación y varias maestrías en ingeniería y finanzas. Ha sido reconocido con el 1er Lugar del Premio Nacional de ADIAT a la Innovación Tecnológica 2017 y el Premio Nacional de ANUIES de Innovación para la Competitividad 2012.",
    },
    {
        id: 6,
        image: img8,
        name: "Victor Alegandro Gonzáles Huitrón",
        title: "Profesor-Investigador",
        location: "Querétaro, México",
        description:
            "El doctor Victor Alejandro obtuvo su licenciatura en Ingeniería en Comunicaciones y Electrónica en 2009, seguida de una maestría en Microelectrónica en 2013 y un doctorado en Comunicaciones y Electrónica en 2017. Ha sido docente en ingenierías electrónica, eléctrica, biomédica, mecatrónica y computación desde 2017.",
    },
];

export default function Welcome() {
    return (
        <MainLayout>
            <div className="min-h-96 bg-gray-800 text-white">
                <section className="w-full h-full px-4 py-16">
                    <h1 className="text-5xl font-bold mb-6">Nuestro equipo</h1>
                    <p className="text-xl max-w-3xl">
                        Somos un grupo dinámico de individuos apasionados por lo
                        que hacemos y dedicados a entregar los mejores
                        resultados para nuestros clientes.
                    </p>
                </section>
                <section className="w-full px-4 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {teamMembers.map((member) => (
                            <div
                                key={member.id}
                                className="relative overflow-hidden rounded-lg bg-gray-800 h-96 group cursor-pointer"
                            >
                                <img
                                    src={member.image}
                                    alt={member.name}
                                    className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110 brightness-75"
                                />

                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-6 z-10 transition-all duration-500 group-hover:opacity-0 group-hover:translate-y-12">
                                    <h3 className="text-xl font-bold">
                                        {member.name}
                                    </h3>
                                    <p className="text-gray-300">
                                        {member.title}
                                    </p>
                                    <p className="text-gray-400 text-sm">
                                        {member.location}
                                    </p>
                                </div>

                                <div className="absolute inset-0 bg-black bg-opacity-70 p-6 flex flex-col justify-end transform translate-y-full transition-transform duration-500 ease-in-out group-hover:translate-y-0">
                                    <h3 className="text-xl font-bold mb-2">
                                        {member.name}
                                    </h3>
                                    <p className="text-gray-300 mb-1">
                                        {member.title}
                                    </p>
                                    <p className="text-gray-400 text-sm mb-4">
                                        {member.location}
                                    </p>
                                    <p className="text-gray-200 text-sm">
                                        {member.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </MainLayout>
    );
}
