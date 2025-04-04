import { Bookmark } from "lucide-react";
import { Link } from "@inertiajs/react";
import MainLayout from "@/Layouts/MainLayout";
import { Card, CardContent } from "@/Components/ui/Card";
import { Button } from "@/Components/ui/Button";

import img1 from "@/assets/img16.jpg";
import img2 from "@/assets/img17.jpg";
import img3 from "@/assets/img18.jpg";
import img4 from "@/assets/img19.jpg";
import img5 from "@/assets/img20.jpg";
import img6 from "@/assets/img21.jpg";

export default function LoMasNuevo() {
    const latestArticles = [
        {
            id: 1,
            image: img1,
            category: "Últimos Avances",
            readTime: "5 min de lectura",
            title: "Nanotecnología en la Medicina",
            description:
                "Explora cómo la nanotecnología está revolucionando los tratamientos médicos y la detección de enfermedades.",
        },
        {
            id: 2,
            image: img2,
            category: "Ciencia y Tecnología",
            readTime: "6 min de lectura",
            title: "El avance de los materiales inteligentes",
            description:
                "Descubre cómo los materiales inteligentes están transformando la industria con sus propiedades adaptativas.",
        },
        {
            id: 3,
            image: img3,
            category: "Espacio y Exploración",
            readTime: "4 min de lectura",
            title: "Misión a Marte: ¿Qué sigue?",
            description:
                "Un vistazo a los próximos planes y tecnologías clave para la exploración del planeta rojo.",
        },
        {
            id: 4,
            image: img4,
            category: "Tecnología de Consumo",
            readTime: "5 min de lectura",
            title: "El futuro de los smartphones plegables",
            description:
                "Analiza cómo los dispositivos plegables están evolucionando y qué esperar en los próximos años.",
        },
        {
            id: 5,
            image: img5,
            category: "Energía y Medio Ambiente",
            readTime: "4 min de lectura",
            title: "Baterías de estado sólido: La revolución energética",
            description:
                "Explora cómo esta tecnología promete mejorar la eficiencia y seguridad de las baterías en el futuro.",
        },
        {
            id: 6,
            image: img6,
            category: "Automoción",
            readTime: "5 min de lectura",
            title: "Autos eléctricos con mayor autonomía",
            description:
                "Conoce las innovaciones en baterías y motores eléctricos que están redefiniendo la movilidad sostenible.",
        },
    ];

    return (
        <MainLayout>
            <div className="min-h-screen bg-gray-50">
                <main className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-6">Lo Más Nuevo</h1>
                    <div className="grid md:grid-cols-2 gap-6">
                        {latestArticles.map((article) => (
                            <Card key={article.id} className="overflow-hidden">
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
                                        <span>• {article.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-muted-foreground mb-3">
                                        {article.description}
                                    </p>
                                    <div className="flex items-center space-x-4">
                                        <Button>Leer Más</Button>
                                        <Button variant="outline" size="icon">
                                            <Bookmark className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </main>
            </div>
        </MainLayout>
    );
}
