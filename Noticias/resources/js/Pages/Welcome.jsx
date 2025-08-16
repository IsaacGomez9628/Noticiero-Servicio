import { useState, useEffect } from "react";
import {
    AlertCircle,
    Bell,
    Bookmark,
    Search,
    User,
    Flag,
    Cloud,
    Award,
    ChevronRight,
} from "lucide-react";
import { Link, usePage } from "@inertiajs/react";
import { Button } from "@/Components/ui/Button";
import { Card } from "@/Components/ui/Card";
import { CardContent } from "@/Components/ui/Card";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/Components/ui/Tabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { Bookmark as BookmarkIcon } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
import ObjectivesSection from "@/Components/Home/ObjectivesSection";
// Importa el componente FadeInSection
import FadeInSection from "@/Components/Home/FadeInSection";

import Logo_CEATyCC from "@/assets/Logo_CEATyCC.png";
import Fondo_CEATyCC from "@/assets/fondo3.jpg";
import Fondo_CEATyCC2 from "@/assets/Fondo_electronica2.jpg";

// Importaciones de imágenes 
import img1 from "@/assets/img1.jpeg";
import img2 from "@/assets/img2.png";
import img4 from "@/assets/img4.jpg";
import img5 from "@/assets/img5.jpg";
import img6 from "@/assets/img6.png";
import img7 from "@/assets/img7.png";
import sedeq from "@/assets/SEDEQ.jpg";
import logo from "@/assets/logo.png";

// Imágenes para "Lo más nuevo"
import img16 from "@/assets/img16.jpg";
import img17 from "@/assets/img17.jpg";
import img18 from "@/assets/img18.jpg";
import img19 from "@/assets/img19.jpg";
import img20 from "@/assets/img20.jpg";
import img21 from "@/assets/img21.jpg";

// Imágenes para "Tendencia"
import img10 from "@/assets/img10.jpg";
import img11 from "@/assets/img11.jpg";
import img12 from "@/assets/img12.jpg";
import img13 from "@/assets/img13.jpg";
import img14 from "@/assets/img14.jpg";
import img15 from "@/assets/img15.jpg";

// Imágenes del equipo
import miembroImg2 from "@/assets/lira.png";
import miembroImg5 from "@/assets/hugo.png";
import miembroImg4 from "@/assets/mlg.png";
import miembroImg6 from "@/assets/olmo.png";
import miembroImg7 from "@/assets/manuel.png";
import miembroImg8 from "@/assets/victor.png";
import Jacinto from "@/assets/Jacinto.png";
import Jorge from "@/assets/Jorge.png";
import Jose from "@/assets/Jose.png";
import Orfelinda from "@/assets/Orfelinda.jpg";
import Dora from "@/assets/Dora.jpg";

export default function Welcome() {
    // Estado para controlar la notificación de inicio de sesión
    const [showLoginSuccess, setShowLoginSuccess] = useState(false);
    // Nuevo estado para controlar la notificación de cierre de sesión
    const [showLogoutSuccess, setShowLogoutSuccess] = useState(false);
    const { flash } = usePage().props;
    const { auth } = usePage().props;
    const user = auth?.user;


    // Efecto para detectar mensajes flash o parámetros de URL (mantenido igual)
    useEffect(() => {
        // Verificar flash messages
        console.log("Flash props:", flash);
        if (flash && flash.success) {
            setShowLoginSuccess(true);
            console.log("Flash message detectado:", flash.success);

            const timer = setTimeout(() => {
                setShowLoginSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }

        // Verificar flash message de cierre de sesión
        if (flash && flash.info) {
            setShowLogoutSuccess(true);
            console.log("Flash message de logout detectado:", flash.info);

            const timer = setTimeout(() => {
                setShowLogoutSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }

        // Verificar parámetros de URL para login
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get("login_success") === "true") {
            setShowLoginSuccess(true);
            console.log("Parámetro de URL de login detectado");

            // Limpiar la URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);

            const timer = setTimeout(() => {
                setShowLoginSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }

        // Verificar parámetros de URL para logout
        if (urlParams.get("logout_success") === "true") {
            setShowLogoutSuccess(true);
            console.log("Parámetro de URL de logout detectado");

            // Limpiar la URL
            const newUrl = window.location.pathname;
            window.history.replaceState({}, document.title, newUrl);

            const timer = setTimeout(() => {
                setShowLogoutSuccess(false);
            }, 5000);

            return () => clearTimeout(timer);
        }
    }, [flash]);

    const newsArticles = [
        {
            id: 1,
            image: img2,
            category: "Tech News",
            readTime: "3 min read",
            title: "IA en la industria",
            description:
                "Descubre como es que la IA esta reformando diferentes industrias tecnologicas.",
        },
        {
            id: 2,
            image: img5,
            category: "Gadget Reviews",
            readTime: "4 min read",
            title: "Mejores Smartphones del 2025",
            description:
                "Descubre cuales estan siendo los mejores smartphones de este año.",
        },
        {
            id: 3,
            image: img4,
            category: "Cybersecurity",
            readTime: "5 min read",
            title: "¿Como estar protegido al navegar en la web?",
            description:
                "Aprende sobre las ultimas formas de protegerte ante amenzas web.",
        },
    ];

    // Artículos para la sección "Lo más nuevo"
    const latestArticles = [
        {
            id: 1,
            image: img16,
            category: "Últimos Avances",
            readTime: "5 min de lectura",
            title: "Nanotecnología en la Medicina",
            description:
                "Explora cómo la nanotecnología está revolucionando los tratamientos médicos y la detección de enfermedades.",
        },
        {
            id: 2,
            image: img17,
            category: "Ciencia y Tecnología",
            readTime: "6 min de lectura",
            title: "El avance de los materiales inteligentes",
            description:
                "Descubre cómo los materiales inteligentes están transformando la industria con sus propiedades adaptativas.",
        },
        {
            id: 3,
            image: img18,
            category: "Espacio y Exploración",
            readTime: "4 min de lectura",
            title: "Misión a Marte: ¿Qué sigue?",
            description:
                "Un vistazo a los próximos planes y tecnologías clave para la exploración del planeta rojo.",
        },
        {
            id: 4,
            image: img19,
            category: "Tecnología de Consumo",
            readTime: "5 min de lectura",
            title: "El futuro de los smartphones plegables",
            description:
                "Analiza cómo los dispositivos plegables están evolucionando y qué esperar en los próximos años.",
        },
        {
            id: 5,
            image: img20,
            category: "Energía y Medio Ambiente",
            readTime: "4 min de lectura",
            title: "Baterías de estado sólido: La revolución energética",
            description:
                "Explora cómo esta tecnología promete mejorar la eficiencia y seguridad de las baterías en el futuro.",
        },
        {
            id: 6,
            image: img21,
            category: "Automoción",
            readTime: "5 min de lectura",
            title: "Autos eléctricos con mayor autonomía",
            description:
                "Conoce las innovaciones en baterías y motores eléctricos que están redefiniendo la movilidad sostenible.",
        },
    ];

    // Artículos para la sección "Tendencia"
    const trendArticles = [
        {
            id: 1,
            image: img10,
            category: "Tendencias Globales",
            readTime: "5 min de lectura",
            title: "La evolución del 5G en 2025",
            description:
                "Descubre cómo el 5G seguirá transformando la conectividad y la industria tecnológica en los próximos años.",
        },
        {
            id: 2,
            image: img11,
            category: "Tendencias Globales",
            readTime: "6 min de lectura",
            title: "El auge de la Web3",
            description:
                "Explora cómo la Web3 está cambiando la forma en que interactuamos con el internet y los servicios descentralizados.",
        },
        {
            id: 3,
            image: img12,
            category: "Inteligencia Artificial",
            readTime: "4 min de lectura",
            title: "El impacto de la IA en el empleo",
            description:
                "Conoce cómo la inteligencia artificial está redefiniendo los roles laborales y creando nuevas oportunidades.",
        },
        {
            id: 4,
            image: img13,
            category: "Tendencias Globales",
            readTime: "5 min de lectura",
            title: "Realidad Virtual en la educación",
            description:
                "Analiza cómo la realidad virtual está revolucionando la enseñanza y el aprendizaje en todo el mundo.",
        },
        {
            id: 5,
            image: img14,
            category: "Engergías",
            readTime: "4 min de lectura",
            title: "El futuro de la energía renovable",
            description:
                "Descubre los últimos avances en energía solar, eólica y otras fuentes sostenibles para un planeta más verde.",
        },
        {
            id: 6,
            image: img15,
            category: "Innovación Tecnológica",
            readTime: "5 min de lectura",
            title: "Computación Cuántica: La próxima revolución",
            description:
                "Explora cómo la computación cuántica está transformando la ciencia y la tecnología con su poder de procesamiento sin precedentes.",
        },
    ];

    // Funciones de formateo (mantenidas igual)
    const formatDate = (dateString) => {
        if (!dateString) return "Fecha por definir";
        const date = new Date(dateString);
        return date.toLocaleDateString("es-MX", {
            day: "numeric",
            month: "long",
            year: "numeric",
        });
    };

    const formatTime = (dateString) => {
        if (!dateString) return "Hora por definir";
        const date = new Date(dateString);
        return date.toLocaleTimeString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    // Datos de miembros de la comisión

    const teamMembers = [
        {
            id: 1,
            image: miembroImg2,
            name: "Ana Laura Lira Cortes",
            title: "Investigadora",
            location: "Querétaro, México",
            description:
                "La Dra. Ana Laura Lira Cortes es una destacada académica mexicana. Estudió en la Universidad Autónoma de Querétaro, obteniendo su doctorado en Innovación, Tecnología y Hábitat. Su investigación se enfoca en problemas complejos que afectan la calidad de vida, utilizando tecnología para su abordaje. Actualmente es profesora investigadora en la Universidad Politécnica de Querétaro.",
        },
        {
            id: 2,
            image: miembroImg5,
            name: "Hugo Rodríguez Reséndiz",
            title: "Profesor-Investigador",
            location: "Querétaro, México",
            description:
                "Hugo Rodríguez-Reséndiz, originario de Querétaro, México, tiene estudios en humanidades con enfoque en educación, filosofía de la ciencia, ética y bioética. Ha trabajado en innovación tecnológica, gestión del conocimiento y proyectos comunitarios. Es profesor-investigador en la Universidad Autónoma de Querétaro y Coordinador de Educación Colaborativa.",
        },
        {
            id: 3,
            image: miembroImg4,
            name: "Maribel Leyva Gaxiola",
            title: "Investigadora",
            location: "Hidalgo, México",
            description:
                "La licenciada en Sistemas Computacionales por la UAEH (2004-2008) continuó su formación con una maestría y doctorado en Gestión Tecnológica e Innovación en la UAQ. Su investigación se enfoca en Prospectiva y Difusión de Tecnologías. Ha participado activamente en congresos y proyectos innovadores, además de gestionar patentes y planes de negocio.",
        },
        {
            id: 4,
            image: miembroImg6,
            name: "Carlos Alberto Olmos Trejo",
            title: "Director General de Bibliotecas",
            location: "Querétaro, México",
            description:
                "Carlos Alberto Olmos Trejo es profesor de tiempo completo en la Facultad de Informática de la Universidad Autónoma de Querétaro. Actualmente, es Director General de Bibliotecas y Servicios Digitales de Información desde enero de 2024. Anteriormente, fue Coordinador de la Maestría en Sistemas Computacionales y Secretario Académico de la Facultad de Informática.",
        },
        {
            id: 5,
            image: miembroImg7,
            name: "Juan Manuel Peña Aguilar",
            title: "Coordinador de Posgrado",
            location: "Querétaro, México",
            description:
                "Juan Manuel Peña Aguilar cuenta con un Doctorado en Gestión Tecnológica e Innovación y varias maestrías en ingeniería y finanzas. Ha sido reconocido con el 1er Lugar del Premio Nacional de ADIAT a la Innovación Tecnológica 2017 y el Premio Nacional de ANUIES de Innovación para la Competitividad 2012.",
        },
        {
            id: 6,
            image: miembroImg8,
            name: "Victor Alegandro González Huitrón",
            title: "Profesor-Investigador",
            location: "Querétaro, México",
            description:
                "El doctor Victor Alejandro obtuvo su licenciatura en Ingeniería en Comunicaciones y Electrónica en 2009, seguida de una maestría en Microelectrónica en 2013 y un doctorado en Comunicaciones y Electrónica en 2017. Ha sido docente en ingenierías electrónica, eléctrica, biomédica, mecatrónica y computación desde 2017.",
        },
        {
            id: 7,
            image: Jose,
            name: "José Gonzalo Lugo Pérez",
            title: "Director de la División de Tecnologías de Automatización e Información",
            location: "Universidad Tecnológica de Querétaro",
            description:
                "Ingeniero en Electrónica y Maestro en Ciencias de la Computación con especialidad en redes de telecomunicaciones. Experto en telecomunicaciones y redes de datos, con experiencia docente en tecnologías de la información y matemáticas. Fundador del Programa Académico de Cisco en la Universidad Tecnológica de Querétaro, logrando su reconocimiento como “Academia Premier” en 2020. Coordinador del Congreso CITIC 2016 y promotor de proyectos tecnológicos en IoT, Inteligencia Artificial y Telecomunicaciones. Ha gestionado recursos para laboratorios de Software Embebido y formación de especialistas para sectores estratégicos.",
        },
        {
            id: 9,
            image: Jacinto,
            name: "Jacinto E. Quintana Landaverde",
            title: "Docente e investigador",
            location: "Universidad Tecnológica de Querétaro",
            description:
                "Doctor en Sistemas Computacionales con más de 24 años de experiencia en docencia e industria. Especialista en desarrollo de aplicaciones computacionales, inteligencia artificial y programación avanzada. Ha impartido cursos en múltiples universidades y asesorado más de 15 proyectos industriales. Fundador del Club de Programación Turing y organizador de torneos de programación y eventos educativos. Coordinador del grupo de Investigación en IA y Programación Avanzada en la UTEQ. Ha desempeñado roles clave en gestión académica y asesoría en TI para instituciones como SEDEQ, USEBEQ y Santander.",
        },
        {
            id: 10,
            image: Jorge,
            name: "Jorge Ramiro Alavarado De La Vega",
            title: "Profesor titular y tutor",
            location: "Universidad Tecnológica de Querétaro",
            description:
                "Ingeniero en electrónica con más de 27 años de experiencia como docente  universitario, especializado en mecatrónica y redes de datos. Experto en la  impartición de clases, revisión de proyectos de estadía profesional, coordinación de  asignaturas y tutorías. Participación activa en cuerpos de investigación en  mecatrónica, Internet de las Cosas e Inteligencia Artificial, con logros destacados en  la actualización y el desarrollo de planes de estudio y procesos de titulación.  Comprometido con el aprendizaje continuo y la actualización tecnológica, con  recientes proyectos en la aplicación de IoT e IA para la agroindustria. Busco seguir  contribuyendo a la formación de nuevas generaciones y enfrentar los retos  tecnológicos de la institución.",
        },
        {
            id: 11,
            image: Dora,
            name: "Dora Lilia López Angeles",
            title: "Profesora",
            location: "Universidad Tecnológica de San Juan Del Río",
            description:
                "Docente con sólida experiencia en la Universidad Tecnológica de San Juan del Río desde 2015, impartiendo clases a nivel Técnico Superior Universitario e Ingeniería en asignaturas como Metodología de la Programación, Sistemas Operativos, Administración de Proyectos de TI, y Desarrollo del Pensamiento Lógico Matemático, entre otras. Cuenta con formación continua a través de cursos como ITIL V3, Scrum Master, Cisco Networking Academy (CCNA R&S), y Linux Essentials, además de certificaciones en Ejecución de Pruebas de Software y SCRUM. Ha contribuido a la divulgación científica mediante publicaciones con ISBN e ISSN sobre tecnologías educativas, optimización de sistemas y gestión bibliográfica digital. Desde 2019, ha apoyado en la Coordinación de las divisiones de Mecatrónica y Desarrollo de Software, participando activamente en procesos de certificación con CACEI, CONAIC y CIEES, así como en la propuesta de una Maestría en Mecatrónica. Entre sus funciones destacan la gestión académica, planeación de horarios, organización de congresos, ferias de proyectos, atención a docentes y alumnos, y liderazgo en procesos administrativos. Se distingue por sus habilidades sociales, cognitivas, emocionales, organizativas, de liderazgo y aprendizaje continuo.",
        },
        
    ];

    return (
        <MainLayout>
            {/* Notificaciones (mantenidas igual) */}
            {showLoginSuccess && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 min-w-96">
                    <div className="bg-white backdrop-blur-sm bg-opacity-95 border-l-4 border-green-500 rounded-lg shadow-xl px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-green-100 rounded-full p-2 mr-4">
                                <svg
                                    className="w-6 h-6 text-green-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    ¡Bienvenido!
                                </h3>
                                <p className="text-gray-600">
                                    Inicio de sesión exitoso
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowLoginSuccess(false)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none transform hover:scale-110 transition-all duration-200"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            {/* Notificación de cierre de sesión (mantenida igual) */}
            {showLogoutSuccess && (
                <div className="fixed top-5 left-1/2 transform -translate-x-1/2 z-50 min-w-96">
                    <div className="bg-white backdrop-blur-sm bg-opacity-95 border-l-4 border-blue-500 rounded-lg shadow-xl px-6 py-4 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-blue-100 rounded-full p-2 mr-4">
                                <svg
                                    className="w-6 h-6 text-blue-600"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M5 13l4 4L19 7"
                                    ></path>
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900">
                                    ¡Hasta pronto!
                                </h3>
                                <p className="text-gray-600">
                                    Sesión cerrada correctamente
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setShowLogoutSuccess(false)}
                            className="text-gray-400 hover:text-gray-600 focus:outline-none transform hover:scale-110 transition-all duration-200"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 18L18 6M6 6l12 12"
                                ></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}

            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    {/* Título principal con animación de entrada */}
                    <FadeInSection className="relative overflow-hidden py-24 sm:py-28 bg-gradient-to-br from-[#e6f0ff] via-[#f9fcff] to-[#d1f4f2] dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
                    {/* Fondos decorativos */}
                        <div className="absolute inset-0 pointer-events-none z-0">
                            <div className="absolute w-[500px] h-[500px] bg-blue-200 dark:bg-blue-900/20 rounded-full blur-3xl top-[-100px] left-[-100px] opacity-30 animate-pulse"></div>
                            <div className="absolute w-[400px] h-[400px] bg-cyan-200 dark:bg-cyan-800/20 rounded-full blur-3xl bottom-[-120px] right-[-80px] opacity-20 animate-pulse delay-300"></div>
                        </div>

                        {/* Contenedor central con logo y eslogan */}
                        <div className="relative z-10 max-w-4xl mx-auto px-6 sm:px-12">
                            <div className="bg-white/80 dark:bg-slate-900/70 backdrop-blur-lg rounded-2xl border border-blue-100 dark:border-slate-700 shadow-xl px-10 py-12 text-center mx-auto max-w-2xl">
                            <img
                                src={Logo_CEATyCC}
                                alt="Logo CEATyCC"
                                className="h-64 w-auto mx-auto drop-shadow-md transition-transform duration-500 hover:scale-105"
                            />
                            </div>

                            {/* Eslogan discreto */}
                            <p className="mt-6 text-base font-medium text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-600 dark:from-cyan-400 dark:via-blue-400 dark:to-cyan-300">
                            Impulsando la Educación en Alta Tecnología y Cloud Computing
                            </p>
                        </div>
                    </FadeInSection>

                    {user && (
                        <>
                            {/* Tabs con animación */}
                            <FadeInSection delay={100}>
                            <Tabs defaultValue="featured" className="space-y-6">
                                <TabsList className="rounded-full flex justify-end bg-transparent">
                                    <TabsTrigger
                                        value="featured"
                                        className="rounded-full p-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                    >
                                        Presentando
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="latest"
                                        className="rounded-full p-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                    >
                                        Lo más nuevo
                                    </TabsTrigger>
                                    <TabsTrigger
                                        value="trending"
                                        className="rounded-full p-2 data-[state=active]:bg-blue-600 data-[state=active]:text-white"
                                    >
                                        Tendencia
                                    </TabsTrigger>
                                </TabsList>

                                {/* Contenido para "Presentando" */}
                                <TabsContent value="featured">
                                    <Swiper
                                        modules={[Navigation, Autoplay]}
                                        navigation
                                        autoplay={{ delay: 3000 }}
                                        spaceBetween={30}
                                        slidesPerView={1}
                                        className="w-full h-80"
                                    >
                                        {newsArticles.map((article) => (
                                            <SwiperSlide key={article.id}>
                                                <Card className="overflow-hidden">
                                                    <div className="grid md:grid-cols-2 gap-6">
                                                        <div className="relative h-64 md:h-full">
                                                            <img
                                                                src={article.image}
                                                                alt={article.title}
                                                                className="object-cover w-full h-full"
                                                            />
                                                        </div>
                                                        <CardContent className="p-6">
                                                            <h2 className="text-2xl font-bold">
                                                                {article.title}
                                                            </h2>
                                                            <p className="text-muted-foreground">
                                                                {
                                                                    article.description
                                                                }
                                                            </p>
                                                            <Button className="mt-4">
                                                                Leer Más
                                                            </Button>
                                                        </CardContent>
                                                    </div>
                                                </Card>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </TabsContent>

                                {/* Contenido para "Lo más nuevo" con animaciones escalonadas */}
                                <TabsContent value="latest">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {latestArticles.map((article, index) => (
                                            <FadeInSection
                                                key={article.id}
                                                delay={index * 100}
                                                direction={
                                                    index % 2 === 0
                                                        ? "left"
                                                        : "right"
                                                }
                                            >
                                                <Card className="overflow-hidden card-hover-effect">
                                                    <div className="relative h-48">
                                                        <img
                                                            src={article.image}
                                                            alt={article.title}
                                                            className="object-cover h-full w-full"
                                                        />
                                                    </div>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                            <span>
                                                                {article.category}
                                                            </span>
                                                            <span>
                                                                • {article.readTime}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-bold mb-2">
                                                            {article.title}
                                                        </h3>
                                                        <p className="text-muted-foreground mb-3">
                                                            {article.description}
                                                        </p>
                                                        <div className="flex items-center space-x-4">
                                                            <Button>
                                                                Leer Más
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                            >
                                                                <Bookmark className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </FadeInSection>
                                        ))}
                                    </div>
                                </TabsContent>

                                {/* Contenido para "Tendencia" con animaciones escalonadas */}
                                <TabsContent value="trending">
                                    <div className="grid md:grid-cols-2 gap-6">
                                        {trendArticles.map((article, index) => (
                                            <FadeInSection
                                                key={article.id}
                                                delay={index * 100}
                                                direction={
                                                    index % 2 === 0
                                                        ? "left"
                                                        : "right"
                                                }
                                            >
                                                <Card className="overflow-hidden card-hover-effect">
                                                    <div className="relative h-48">
                                                        <img
                                                            src={article.image}
                                                            alt={article.title}
                                                            className="object-cover h-full w-full"
                                                        />
                                                    </div>
                                                    <CardContent className="p-6">
                                                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                            <span>
                                                                {article.category}
                                                            </span>
                                                            <span>
                                                                • {article.readTime}
                                                            </span>
                                                        </div>
                                                        <h3 className="text-xl font-bold mb-2">
                                                            {article.title}
                                                        </h3>
                                                        <p className="text-muted-foreground mb-3">
                                                            {article.description}
                                                        </p>
                                                        <div className="flex items-center space-x-4">
                                                            <Button>
                                                                Leer Más
                                                            </Button>
                                                            <Button
                                                                variant="outline"
                                                                size="icon"
                                                            >
                                                                <Bookmark className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            </FadeInSection>
                                        ))}
                                    </div>
                                </TabsContent>
                            </Tabs>
                            </FadeInSection>

                            {/* Sección de eventos con animación */}
                            <FadeInSection delay={200}>
                            <section className="mt-12">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center gap-2">
                                        <div className="icon-wrapper icon-blue">
                                            <Award size={20} />
                                        </div>
                                        <h2 className="text-2xl font-bold">
                                            Próximos Eventos
                                        </h2>
                                    </div>
                                    <Link href="/eventos">
                                        <Button
                                            variant="outline"
                                            className="flex items-center gap-2"
                                        >
                                            <span>Ver Todos</span>
                                            <ChevronRight size={16} />
                                        </Button>
                                    </Link>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* Primer evento con animación desde la izquierda */}
                                    <FadeInSection direction="left" delay={250}>
                                        <Card className="overflow-hidden card-hover-effect">
                                            <div className="relative h-48">
                                                <img
                                                    src={logo}
                                                    alt="Imagen del evento"
                                                    className="object-cover h-full w-full"
                                                />
                                            </div>
                                            <CardContent className="p-6">
                                                <h3 className="text-xl font-bold mb-2">
                                                    Congreso CEATyCC
                                                </h3>
                                                <p className="text-muted-foreground mb-3">
                                                Promover el conocimiento y la adopción de tecnologías
                                                avanzadas y servicios de computación en la nube en el ámbito educativo,
                                                fomentando el intercambio de ideas, experiencias y mejores prácticas entre
                                                profesionales del sector educativo y tecnológico, con el fin de mejorar la calidad de
                                                la educación y prepararse para los desafíos del futuro digital.
                                                </p>
                                                <Link href="/eventos/1">
                                                    <Button>Ver Detalles</Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </FadeInSection>

                                    {/* Segundo evento con animación desde la derecha */}
                                    <FadeInSection direction="right" delay={300}>
                                        <Card className="overflow-hidden card-hover-effect">
                                            <div className="relative h-48">
                                                <img
                                                    src={img7}
                                                    alt="Imagen del evento"
                                                    className="object-cover h-full w-full"
                                                />
                                            </div>
                                            <CardContent className="p-6">
                                                <h3 className="text-xl font-bold mb-2">
                                                    Workshop de Desarrollo Web
                                                </h3>
                                                <p className="text-muted-foreground mb-3">
                                                    Aprende las mejores prácticas
                                                    para el desarrollo web moderno.
                                                </p>
                                                <Link href="/eventos/2">
                                                    <Button>Ver Detalles</Button>
                                                </Link>
                                            </CardContent>
                                        </Card>
                                    </FadeInSection>
                                </div>
                            </section>
                            </FadeInSection>
                        </>
                        )}
                    {/* Sección ¿Quiénes somos? - Misión y Visión con animaciones */}
                    <section className="mt-16 py-16 relative overflow-hidden">
                        {/* Fondo con patrón sutil (mantenido igual) */}
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white opacity-70 z-0"></div>
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMzYjgyZjYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0aDR2MWgtNHYtMXptMC0yaDF2NGgtMXYtNHptMi0yaDF2MWgtMXYtMXptLTIgMmgxdjFoLTF2LTF6bS0yLTJoMXYxaC0xdi0xem0yLTJoMXYxaC0xdi0xem0tMiAyaDF2MWgtMXYtMXptLTItMmgxdjFoLTF2LTF6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-50 z-0"></div>

                        <div className="container mx-auto px-4 relative z-10">
                            <FadeInSection>
                                <div className="text-center mb-16">
                                    <h2 className="text-5xl font-bold text-gray-900 mb-4">
                                        ¿Quiénes somos?
                                    </h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-500 mx-auto rounded-full"></div>
                                </div>
                            </FadeInSection>

                            <div className="grid md:grid-cols-2 gap-10 mb-20">
                                {/* Misión con animación desde la izquierda */}
                                <FadeInSection direction="left" delay={100}>
                                    <div className="rounded-2xl overflow-hidden shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                                        <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-1">
                                            <div className="bg-gradient-to-r from-blue-800 to-blue-600 p-8 text-white">
                                                <div className="flex items-center mb-6">
                                                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                                        <Flag className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-3xl font-bold">
                                                        Misión
                                                    </h3>
                                                </div>
                                                <p className="text-lg leading-relaxed">
                                                    Fomentar la educación y el
                                                    desarrollo de habilidades en
                                                    alta tecnología y Cloud
                                                    Computing, impulsando la
                                                    innovación y el conocimiento
                                                    para preparar a estudiantes
                                                    y profesionales para un
                                                    entorno digital en constante
                                                    evolución.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </FadeInSection>

                                {/* Visión con animación desde la derecha */}
                                <FadeInSection direction="right" delay={200}>
                                    <div className="rounded-2xl overflow-hidden shadow-xl transform hover:-translate-y-2 transition-all duration-300">
                                        <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-1">
                                            <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-8 text-white">
                                                <div className="flex items-center mb-6">
                                                    <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center mr-4">
                                                        <Cloud className="w-8 h-8" />
                                                    </div>
                                                    <h3 className="text-3xl font-bold">
                                                        Visión
                                                    </h3>
                                                </div>
                                                <p className="text-lg leading-relaxed">
                                                    Ser un líder referente en la
                                                    promoción de la educación y
                                                    la adopción de alta
                                                    tecnología y Cloud
                                                    Computing, contribuyendo al
                                                    crecimiento de una sociedad
                                                    preparada para enfrentar los
                                                    desafíos tecnológicos del
                                                    futuro.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </FadeInSection>
                            </div>
                        </div>
                    </section>

                    {/* Sección de objetivos con animación */}
                    <FadeInSection delay={300}>
                        <ObjectivesSection />
                    </FadeInSection>

                    {/* Sección del equipo con animación */}
                    <FadeInSection delay={400}>
                        <section className="mt-1 py-16 bg-gradient-to-b from-gray-50 to-blue-50 rounded-lg">
                            <div className="container mx-auto px-4">
                                <div className="text-center mb-12">
                                    <h2 className="text-4xl font-bold text-gray-900 mb-4">
                                        Miembros de la comisión
                                    </h2>
                                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-500 mx-auto rounded-full mb-6"></div>

                                    <div className="flex justify-center mt-10">
                                        <div className="relative overflow-hidden rounded-lg bg-white shadow-lg transform transition-transform duration-300 hover:shadow-xl hover:scale-105 h-full w-[300px]">
                                            <div className="h-64 relative overflow-hidden">
                                                <img
                                                    src={Orfelinda}
                                                    alt="Maestra Orfelinda"
                                                    className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                                                <div className="absolute bottom-0 left-0 p-4 text-white">
                                                    <h3 className="text-xl font-bold justify-center">
                                                        Orfelinda Torres Rivera
                                                    </h3>
                                                    <p className="text-white/90 justify-center">
                                                        Coordinadora
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <p className="text-gray-700 text-sm line-clamp-3">
                                                    Coordinadora de Educación
                                                    Superior de la Secretaría de
                                                    Educación (SEDEQ).
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <Swiper
                                    modules={[Navigation, Autoplay]}
                                    navigation
                                    autoplay={{ delay: 5000 }}
                                    spaceBetween={30}
                                    slidesPerView={1}
                                    breakpoints={{
                                        640: {
                                            slidesPerView: 2,
                                        },
                                        1024: {
                                            slidesPerView: 4,
                                        },
                                    }}
                                    className="w-full"
                                >
                                    {teamMembers.map((member) => (
                                        <SwiperSlide key={member.id}>
                                            <div className="relative overflow-hidden rounded-lg bg-white shadow-lg transform transition-transform duration-300 hover:shadow-xl hover:scale-105 h-full">
                                                <div className="h-64 relative overflow-hidden">
                                                    <img
                                                        src={member.image}
                                                        alt={member.name}
                                                        className="w-full h-full object-cover object-center transition-transform duration-500 hover:scale-110"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none"></div>
                                                    <div className="absolute bottom-0 left-0 p-4 text-white">
                                                        <h3 className="text-xl font-bold">
                                                            {member.name}
                                                        </h3>
                                                        <p className="text-white/90">
                                                            {member.title}
                                                        </p>
                                                        <p className="text-white/80 text-sm">
                                                            {member.location}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-gray-700 text-sm line-clamp-3">
                                                        {member.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </section>
                    </FadeInSection>
                </main>
            </div>
        </MainLayout>
    );
}
