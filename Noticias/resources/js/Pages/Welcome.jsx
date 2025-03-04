import { AlertCircle, Bell, Bookmark, Search, User } from "lucide-react";
import { Link } from "@inertiajs/react";
import { Card } from "@/Components/Card";
import { CardContent } from "@/Components/Card";
import { Input } from "@/Components/Input";
import { Button } from "@/Components/Button";
import { TabsList, TabsTrigger, TabsContent, Tabs } from "@/Components/Tabs";
//import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/dropdown-menu"
import img1 from "@/assets/img1.jpeg";
import img2 from "@/assets/img2.png";
import sedeq from "@/assets/SEDEQ.jpg";

export default function Welcome() {
    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b">
                <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <Link
                        href="/"
                        className="text-2xl font-bold text-primary flex items-center space-x-2"
                    >
                        <img src={sedeq} alt="Logo" className="h-8 w-8" />
                        <span>Secretaria de Educación</span>
                    </Link>
                    <div className="hidden md:flex items-center space-x-6">
                        <Link
                            href="/eventos"
                            className="text-sm font-medium hover:text-primary"
                        >
                            Eventos
                        </Link>
                        <Link
                            href="/miembros"
                            className="text-sm font-medium hover:text-primary"
                        >
                            Equipo
                        </Link>
                        <Link
                            href="/quienes-somos"
                            className="text-sm font-medium hover:text-primary"
                        >
                            ¿Quiénes Somos?
                        </Link>

                        <div className="relative w-64">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Buscar noticias..."
                                className="pl-8"
                            />
                        </div>
                    </div>
                    <div className="md:hidden flex items-center space-x-2">
                        <Button variant="ghost" size="icon">
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button variant="ghost" size="icon">
                            <User className="h-5 w-5" />
                        </Button>
                    </div>
                </nav>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Tabs defaultValue="featured" className="space-y-6">
                    <TabsList>
                        <TabsTrigger value="featured">Presentando</TabsTrigger>
                        <TabsTrigger value="latest">Lo más nuevo</TabsTrigger>
                        <TabsTrigger value="trending">Tendencia</TabsTrigger>
                    </TabsList>

                    <TabsContent value="featured" className="space-y-8">
                        <Card className="overflow-hidden">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="relative h-64 md:h-full">
                                    <img
                                        src={img1}
                                        alt="Featured article image"
                                        className="object-cover"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <div className="space-y-4">
                                        <div className="flex items-center space-x-2">
                                            <span className="text-sm font-medium text-primary">
                                                Technology
                                            </span>
                                            <span className="text-sm text-muted-foreground">
                                                • 5 min read
                                            </span>
                                        </div>
                                        <h2 className="text-2xl font-bold">
                                            El futuro de la inteligencia
                                            artificial en el desarrollo web
                                        </h2>
                                        <p className="text-muted-foreground">
                                            Explora como es que la inteligencia
                                            artificial esta revolucionando la
                                            forma en la que desarrollamos y
                                            mantenemos un sitio web. Desde
                                            testeo automatico hasta llenado
                                            automatico de código.
                                        </p>
                                        <div className="flex items-center space-x-4">
                                            <Button>Acerca de</Button>
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

                        <div className="grid md:grid-cols-3 gap-6">
                            {[1, 2, 3].map((i) => (
                                <Card key={i}>
                                    <div className="relative h-48">
                                        <img
                                            src={img2}
                                            alt="Featured article image"
                                            className="object-cover"
                                        />
                                    </div>
                                    <CardContent className="p-4">
                                        <div className="space-y-3">
                                            <div className="flex items-center space-x-2">
                                                <span className="text-sm font-medium text-primary">
                                                    Tech News
                                                </span>
                                                <span className="text-sm text-muted-foreground">
                                                    • 3 min read
                                                </span>
                                            </div>
                                            <h3 className="font-semibold">
                                                Latest Developments in Tech
                                                Industry
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                Stay updated with the most
                                                recent developments and
                                                innovations in the technology
                                                sector.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="latest" className="space-y-6">
                        <div className="grid gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i}>
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="relative h-48 md:h-full">
                                            <img
                                                src={`/placeholder.svg?height=200&width=300`}
                                                alt={`Latest article ${i} image`}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                        <CardContent className="md:col-span-2 p-6">
                                            <div className="space-y-4">
                                                <div className="flex items-center space-x-2">
                                                    <span className="text-sm font-medium text-primary">
                                                        Latest News
                                                    </span>
                                                    <span className="text-sm text-muted-foreground">
                                                        • 4 min read
                                                    </span>
                                                </div>
                                                <h3 className="text-xl font-bold">
                                                    Breaking Tech News and
                                                    Updates
                                                </h3>
                                                <p className="text-muted-foreground">
                                                    Get the latest updates on
                                                    technology trends, company
                                                    announcements, and industry
                                                    developments.
                                                </p>
                                                <div className="flex items-center space-x-4">
                                                    <Button variant="outline">
                                                        Read More
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                    >
                                                        <Bookmark className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="trending" className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {[1, 2, 3, 4].map((i) => (
                                <Card key={i} className="flex gap-4 p-4">
                                    <div className="relative h-24 w-24 flex-shrink-0">
                                        <img
                                            src={`/placeholder.svg?height=100&width=100`}
                                            alt={`Trending article ${i} image`}
                                            fill
                                            className="object-cover rounded-lg"
                                        />
                                    </div>
                                    <CardContent className="p-0">
                                        <div className="space-y-2">
                                            <div className="flex items-center space-x-2">
                                                <AlertCircle className="h-4 w-4 text-primary" />
                                                <span className="text-sm font-medium text-primary">
                                                    Trending
                                                </span>
                                            </div>
                                            <h3 className="font-semibold line-clamp-2">
                                                Hot Topics in Technology Today
                                            </h3>
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                                Discover what's trending in the
                                                tech world right now.
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
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
                                        src={
                                            "/placeholder.svg?height=200&width=400"
                                        }
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
                                        src={
                                            "/placeholder.svg?height=200&width=400"
                                        }
                                        alt="Imagen del evento"
                                        className="object-cover h-full w-full"
                                    />
                                </div>
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2">
                                        Workshop de Desarrollo Web
                                    </h3>
                                    <p className="text-muted-foreground mb-3">
                                        Aprende las mejores prácticas para el
                                        desarrollo web moderno.
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
    );
}
