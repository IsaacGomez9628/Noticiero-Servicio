import { AlertCircle, Bell, Bookmark, Search, User } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/Card";
import { CardContent } from "@/Components/Card";
import { Input } from "@/Components/Input";
import { Button } from "@/Components/Button";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/Components/Tabs";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { Bookmark as BookmarkIcon } from "lucide-react";
import MainLayout from "@/Layouts/MainLayout";
//import {NewsCard} from "@/components/NewsCard";
//import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dropdown-menu"
import img1 from "@/assets/img1.jpeg";
import img2 from "@/assets/img2.png";
import img4 from "@/assets/img4.jpg";
import img5 from "@/assets/img5.jpg";
import img6 from "@/assets/img6.png";
import img7 from "@/assets/img7.png";
import sedeq from "@/assets/SEDEQ.jpg";

export default function Welcome() {
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

                        <TabsContent value="featured" className="space-y-8">
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
                                                    <div className="space-y-4">
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-sm font-medium text-primary">
                                                                {
                                                                    article.category
                                                                }
                                                            </span>
                                                            <span className="text-sm text-muted-foreground">
                                                                •{" "}
                                                                {
                                                                    article.readTime
                                                                }
                                                            </span>
                                                        </div>
                                                        <h2 className="text-2xl font-bold">
                                                            {article.title}
                                                        </h2>
                                                        <p className="text-muted-foreground">
                                                            {
                                                                article.description
                                                            }
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
                                                    </div>
                                                </CardContent>
                                            </div>
                                        </Card>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </TabsContent>

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
