import { Bookmark } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/Card";
import { CardContent } from "@/Components/Card";
import { Button } from "@/Components/Button";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/Components/Tabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import MainLayout from "@/Layouts/MainLayout";

// Importa las imágenes para las noticias principales
import img2 from "@/assets/img2.png";
import img4 from "@/assets/img4.jpg";
import img5 from "@/assets/img5.jpg";
import img6 from "@/assets/img6.png";
import img7 from "@/assets/img7.png";
import sedeq from "@/assets/SEDEQ.jpg";

// Importa las imágenes para "Lo más nuevo"
import img16 from "@/assets/img16.jpg";
import img17 from "@/assets/img17.jpg";
import img18 from "@/assets/img18.jpg";
import img19 from "@/assets/img19.jpg";
import img20 from "@/assets/img20.jpg";
import img21 from "@/assets/img21.jpg";

// Importa las imágenes para "Tendencia"
import img10 from "@/assets/img10.jpg";
import img11 from "@/assets/img11.jpg";
import img12 from "@/assets/img12.jpg";
import img13 from "@/assets/img13.jpg";
import img14 from "@/assets/img14.jpg";
import img15 from "@/assets/img15.jpg";

export default function Welcome() {
    // Noticias para la sección "Presentando"
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

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    <Tabs defaultValue="featured" className="space-y-6">
                        <TabsList>
                            <TabsTrigger value="featured">
                                Presentando
                            </TabsTrigger>
                            <TabsTrigger value="latest">
                                Lo más nuevo
                            </TabsTrigger>
                            <TabsTrigger value="trending">
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
                                                        {article.description}
                                                    </p>
                                                    <Button>Leer Más</Button>
                                                </CardContent>
                                            </div>
                                        </Card>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </TabsContent>

                        {/* Contenido para "Lo más nuevo" - CONTENIDO INTEGRADO */}
                        <TabsContent value="latest">
                            <div className="grid md:grid-cols-2 gap-6">
                                {latestArticles.map((article) => (
                                    <Card
                                        key={article.id}
                                        className="overflow-hidden"
                                    >
                                        <div className="relative h-48">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="object-cover h-full w-full"
                                            />
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <span>{article.category}</span>
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
                                                <Button>Leer Más</Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <Bookmark className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Contenido para "Tendencia" - CONTENIDO INTEGRADO */}
                        <TabsContent value="trending">
                            <div className="grid md:grid-cols-2 gap-6">
                                {trendArticles.map((article) => (
                                    <Card
                                        key={article.id}
                                        className="overflow-hidden"
                                    >
                                        <div className="relative h-48">
                                            <img
                                                src={article.image}
                                                alt={article.title}
                                                className="object-cover h-full w-full"
                                            />
                                        </div>
                                        <CardContent className="p-6">
                                            <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                                                <span>{article.category}</span>
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
                                                <Button>Leer Más</Button>
                                                <Button
                                                    variant="outline"
                                                    size="icon"
                                                >
                                                    <Bookmark className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </TabsContent>

                        {/* Sección de eventos que se mantiene fija */}
                        <section className="mt-12">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold">
                                    Próximos Eventos
                                </h2>
                                <Link href="/eventos">
                                    <Button variant="outline">Ver Todos</Button>
                                </Link>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Aquí podrías mostrar 2 eventos destacados */}
                                <Card className="overflow-hidden">
                                    <div className="relative h-48">
                                        <img
                                            src={img6}
                                            alt="Imagen del evento"
                                            className="object-cover h-full w-full"
                                        />
                                    </div>
                                    <CardContent className="p-6">
                                        <h3 className="text-xl font-bold mb-2">
                                            Conferencia de Tecnología
                                        </h3>
                                        <p className="text-muted-foreground mb-3">
                                            Únete a nosotros para explorar las
                                            últimas tendencias en tecnología.
                                        </p>
                                        <Link href="/eventos/1">
                                            <Button>Ver Detalles</Button>
                                        </Link>
                                    </CardContent>
                                </Card>

                                <Card className="overflow-hidden">
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
                                            Aprende las mejores prácticas para
                                            el desarrollo web moderno.
                                        </p>
                                        <Link href="/eventos/2">
                                            <Button>Ver Detalles</Button>
                                        </Link>
                                    </CardContent>
                                </Card>
                            </div>
                        </section>
                    </Tabs>
                </main>
            </div>
        </MainLayout>
    );
}
