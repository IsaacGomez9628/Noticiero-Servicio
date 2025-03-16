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

const newsArticles = [
    {
        id: 1,
        image: img2,
        title: "Ana Laura Lira Cortes",
        description:
            "La Dra. Ana Laura Lira Cortes es una destacada académica mexicana. Estudió en la Universidad Autónoma de Querétaro, obteniendo su doctorado en Innovación, Tecnología y Hábitat. Su investigación se enfoca en problemas complejos que afectan la calidad de vida, utilizando tecnología para su abordaje. Actualmente es profesora investigadora en la Universidad Politécnica de Querétaro. Ha ocupado cargos administrativos y tiene una trayectoria docente de 20 años, impartiendo materias relacionadas con TIC. También ha asesorado proyectos de Estadía Profesional para estudiantes en este campo. Su trabajo incluye el análisis de la percepción de inseguridad con inteligencia artificial.",
    },
    {
        id: 2,
        image: img5,
        title: "Hugo Rodríguez Reséndiz",
        description:
            "Hugo Rodríguez-Reséndiz, originario de Querétaro, México, tiene estudios en humanidades con enfoque en educación, filosofía de la ciencia, ética y bioética. Ha trabajado en innovación tecnológica, gestión del conocimiento y proyectos comunitarios. Es profesor-investigador en la Universidad Autónoma de Querétaro y Coordinador de Educación Colaborativa. Sus líneas de investigación incluyen ética de la inteligencia artificial y educación colaborativa. Ha colaborado con empresas como Continental, Microsoft y UNESCO, y ha recibido premios por su labor en ética y docencia. También ha sido consultor en gobiernos y ha participado en foros internacionales.",
    },
    {
        id: 3,
        image: img4,
        title: "Maribel Leyva Gaxiola",
        description:
            "La licenciada en Sistemas Computacionales por la UAEH (2004-2008) continuó su formación con una maestría y doctorado en Gestión Tecnológica e Innovación en la UAQ. Su investigación se enfoca en Prospectiva y Difusión de Tecnologías. Ha participado activamente en congresos y proyectos innovadores, además de gestionar patentes y planes de negocio. Desde 2013, ha sido profesora y asesora de tesis en diferentes niveles académicos. En 2021, fue reconocida como Candidata a Investigadora Nacional por el CONACYT, destacando su trayectoria en investigación y tecnología.",
    },
    {
        id: 4,
        image: img6,
        title: "Carlos Alberto Olmos Trejo",
        description:
            "Carlos Alberto Olmos Trejo es profesor de tiempo completo en la Facultad de Informática de la Universidad Autónoma de Querétaro. Actualmente, es Director General de Bibliotecas y Servicios Digitales de Información desde enero de 2024. Anteriormente, fue Coordinador de la Maestría en Sistemas Computacionales y Secretario Académico de la Facultad de Informática. Su experiencia incluye docencia, tutoría y generación de conocimiento en tecnología educativa y desarrollo de sistemas. También ha participado en la coordinación de programas educativos en el municipio de Colón, enfocados en tecnologías de la información y ciberseguridad",
    },
    {
        id: 5,
        image: img7,
        title: "Juan Manuel Peña Aguilar",
        description:
            "Juan Manuel Peña Aguilar cuenta con un Doctorado en Gestión Tecnológica e Innovación y varias maestrías en ingeniería y finanzas. Ha sido reconocido con el 1er Lugar del Premio Nacional de ADIAT a la Innovación Tecnológica 2017 y el Premio Nacional de ANUIES de Innovación para la Competitividad 2012. Es miembro del Sistema Nacional de Investigadores y autor de numerosas publicaciones internacionales. Ha dirigido tesis y proyectos tecnológicos, y es conferencista internacional. Actualmente, coordina programas de posgrado en UNIR México y es profesor investigador en la Universidad Politécnica de Santa Rosa Jáuregui",
    },
    {
        id: 6,
        image: img8,
        title: "Victor Alegandro Gonzáles Huitrón",
        description:
            "El doctor Victor Alejandro obtuvo su licenciatura en Ingeniería en Comunicaciones y Electrónica en 2009, seguida de una maestría en Microelectrónica en 2013 y un doctorado en Comunicaciones y Electrónica en 2017. Ha sido docente en ingenierías electrónica, eléctrica, biomédica, mecatrónica y computación desde 2017. Su experiencia incluye roles como ingeniero de capacitación, analista de datos y desarrollador de algoritmos. Actualmente es profesor e investigador en el Instituto Tecnológico de Querétaro, con intereses en procesamiento de imágenes, visión artificial y análisis de datos. Es miembro del Sistema Nacional de Investigadores.",
    },
];

export default function Welcome() {
    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {newsArticles.map((article) => (
                            <div
                                key={article.id}
                                className="bg-white rounded-lg shadow-md p-4"
                            >
                                <div className="flex justify-center">
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="h-60 w-60 object-cover rounded-md"
                                    />
                                </div>
                                <div className="mt-4 text-center">
                                    <p className="text-xs text-gray-500">
                                        {article.category} • {article.readTime}
                                    </p>
                                    <h3 className="text-lg font-semibold mt-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-gray-700 mt-1 text-justify">
                                        {article.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </main>
            </div>
        </MainLayout>
    );
}
