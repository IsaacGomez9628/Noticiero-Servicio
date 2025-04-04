import React, { useState, useEffect, useRef } from "react";
import { Link, usePage } from "@inertiajs/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/Avatar";
import { Button } from "@/Components/ui/ButtonDashboard";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { Input } from "@/Components/ui/Input";
import { Badge } from "@/Components/ui/Badge";
import {
    LayoutDashboard,
    Ticket,
    Heart,
    Users,
    Compass,
    Settings,
    LogOut,
    Bell,
    Sun,
    Moon,
    Search,
    Menu,
    ChevronDown,
    User,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/Sheet";

export default function DashboardLayout({
    children,
    setCurrentView,
    currentView,
}) {
    const { auth } = usePage().props;
    const [userName, setUserName] = useState(auth?.user?.name || "Usuario");
    const [userEmail, setUserEmail] = useState(
        auth?.user?.email || "usuario@ejemplo.com"
    );
    const [mounted, setMounted] = useState(false);
    const [theme, setTheme] = useState("light");
    const [notifications, setNotifications] = useState(3);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const userMenuRef = useRef(null);

    // Ensure the component is mounted to avoid hydration issues
    useEffect(() => {
        setMounted(true);

        // Set user name and email if available
        if (auth && auth.user) {
            setUserName(auth.user.name || "Usuario");
            setUserEmail(auth.user.email || "usuario@ejemplo.com");
        }

        // Add event listener for clicks outside the user menu
        function handleClickOutside(event) {
            if (
                userMenuRef.current &&
                !userMenuRef.current.contains(event.target)
            ) {
                setIsUserMenuOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [auth]);

    if (!mounted) {
        return null;
    }

    const toggleTheme = () => {
        const newTheme = theme === "dark" ? "light" : "dark";
        setTheme(newTheme);
        document.documentElement.classList.toggle("dark", newTheme === "dark");
    };

    const NavItem = ({ icon: Icon, label, isActive, onClick }) => (
        <Button
            variant={isActive ? "secondary" : "ghost"}
            className={cn(
                "w-full justify-start gap-3 my-1 py-6",
                isActive
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:opacity-90 dark:text-white"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800/80"
            )}
            onClick={onClick}
        >
            <Icon
                className={cn(
                    "h-5 w-5",
                    isActive
                        ? "text-white dark:text-white"
                        : "text-gray-500 dark:text-gray-400"
                )}
            />
            <span>{label}</span>
        </Button>
    );

    return (
        <div className="flex min-h-screen flex-col bg-gray-50 dark:bg-gray-900">
            {/* Header - Eventbrite style navbar */}
            <header className="sticky top-0 z-40 flex h-16 items-center bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="container mx-auto px-4 flex items-center justify-between">
                    {/* Left section: Logo and mobile menu */}
                    <div className="flex items-center gap-4">
                        {/* Mobile menu button */}
                        <Sheet
                            open={isMobileMenuOpen}
                            onOpenChange={setIsMobileMenuOpen}
                        >
                            <SheetTrigger asChild>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="md:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">Toggle menu</span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent
                                side="left"
                                className="w-[280px] bg-white dark:bg-gray-900"
                            >
                                <div className="flex flex-col h-full">
                                    <div className="py-6 px-4 border-b">
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-10 w-10 border-2 border-blue-600">
                                                <AvatarImage
                                                    src="/placeholder.svg"
                                                    alt={userName}
                                                />
                                                <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white">
                                                    {userName.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <div className="flex flex-col">
                                                <span className="font-medium">
                                                    {userName}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {userEmail}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex-1 overflow-auto py-6 px-4">
                                        <div className="space-y-1">
                                            <div className="mb-4">
                                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                    Main Menu
                                                </h3>
                                                <NavItem
                                                    icon={LayoutDashboard}
                                                    label="Dashboard"
                                                    isActive={
                                                        currentView ===
                                                        "dashboard"
                                                    }
                                                    onClick={() => {
                                                        setCurrentView(
                                                            "dashboard"
                                                        );
                                                        setIsMobileMenuOpen(
                                                            false
                                                        );
                                                    }}
                                                />
                                                <NavItem
                                                    icon={Ticket}
                                                    label="Mis Asistencias"
                                                    isActive={
                                                        currentView ===
                                                        "mis-asistencias"
                                                    }
                                                    onClick={() => {
                                                        setCurrentView(
                                                            "mis-asistencias"
                                                        );
                                                        setIsMobileMenuOpen(
                                                            false
                                                        );
                                                    }}
                                                />
                                                <NavItem
                                                    icon={Heart}
                                                    label="Me gustaron"
                                                    isActive={
                                                        currentView ===
                                                        "me-gustaron"
                                                    }
                                                    onClick={() => {
                                                        setCurrentView(
                                                            "me-gustaron"
                                                        );
                                                        setIsMobileMenuOpen(
                                                            false
                                                        );
                                                    }}
                                                />
                                                <NavItem
                                                    icon={Users}
                                                    label="Siguiendo"
                                                    isActive={
                                                        currentView ===
                                                        "siguiendo"
                                                    }
                                                    onClick={() => {
                                                        setCurrentView(
                                                            "siguiendo"
                                                        );
                                                        setIsMobileMenuOpen(
                                                            false
                                                        );
                                                    }}
                                                />
                                                <NavItem
                                                    icon={Compass}
                                                    label="Intereses"
                                                    isActive={
                                                        currentView ===
                                                        "intereses"
                                                    }
                                                    onClick={() => {
                                                        setCurrentView(
                                                            "intereses"
                                                        );
                                                        setIsMobileMenuOpen(
                                                            false
                                                        );
                                                    }}
                                                />
                                            </div>
                                            <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                                                    Account
                                                </h3>
                                                <NavItem
                                                    icon={Settings}
                                                    label="Ajustes de la cuenta"
                                                    onClick={() => {
                                                        window.location.href =
                                                            route(
                                                                "perfil.edit"
                                                            );
                                                    }}
                                                />
                                                <NavItem
                                                    icon={LogOut}
                                                    label="Cerrar sesión"
                                                    onClick={() => {
                                                        const form =
                                                            document.createElement(
                                                                "form"
                                                            );
                                                        form.method = "POST";
                                                        form.action =
                                                            route("logout");

                                                        const csrfToken =
                                                            document
                                                                .querySelector(
                                                                    'meta[name="csrf-token"]'
                                                                )
                                                                ?.getAttribute(
                                                                    "content"
                                                                );
                                                        if (csrfToken) {
                                                            const csrfInput =
                                                                document.createElement(
                                                                    "input"
                                                                );
                                                            csrfInput.type =
                                                                "hidden";
                                                            csrfInput.name =
                                                                "_token";
                                                            csrfInput.value =
                                                                csrfToken;
                                                            form.appendChild(
                                                                csrfInput
                                                            );
                                                        }

                                                        document.body.appendChild(
                                                            form
                                                        );
                                                        form.submit();
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>

                        {/* Branding / Logo */}
                        <Link href="/" className="flex items-center gap-2">
                            <h1 className="hidden sm:block text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                                Eventos
                            </h1>
                        </Link>
                    </div>

                    {/* Center section: Navigation links (only on larger screens) */}
                    <nav className="hidden md:flex items-center space-x-6">
                        <Link
                            href={route("dashboard")}
                            className={`text-base font-medium ${
                                currentView === "dashboard"
                                    ? "text-blue-600"
                                    : "text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            } transition-colors`}
                            onClick={() => setCurrentView("dashboard")}
                        >
                            Dashboard
                        </Link>
                        <Link
                            href={route("eventos.mis-asistencias")}
                            className={`text-base font-medium ${
                                currentView === "mis-asistencias"
                                    ? "text-blue-600"
                                    : "text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400"
                            } transition-colors`}
                            onClick={() => setCurrentView("mis-asistencias")}
                        >
                            Mis Asistencias
                        </Link>
                        <Link
                            href="#"
                            className="text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors"
                        >
                            Siguiendo
                        </Link>
                        <Link
                            href="#"
                            className="text-base font-medium text-gray-700 hover:text-blue-600 dark:text-gray-200 dark:hover:text-blue-400 transition-colors"
                        >
                            Intereses
                        </Link>
                    </nav>

                    {/* Right section: Search, Theme toggle, Notifications, User menu */}
                    <div className="flex items-center gap-3">
                        {/* Search */}
                        <div className="relative hidden md:block w-64">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                            <Input
                                placeholder="Buscar..."
                                className="pl-10 h-9 bg-gray-100 dark:bg-gray-800 border-none w-full rounded-full"
                            />
                        </div>

                        {/* Theme Toggle */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full"
                            onClick={toggleTheme}
                        >
                            {theme === "dark" ? (
                                <Sun className="h-5 w-5 text-yellow-500" />
                            ) : (
                                <Moon className="h-5 w-5 text-blue-600" />
                            )}
                            <span className="sr-only">Cambiar tema</span>
                        </Button>

                        {/* Notifications */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-full relative"
                        >
                            <Bell className="h-5 w-5 text-gray-700 dark:text-gray-300" />
                            {notifications > 0 && (
                                <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-blue-600 text-white">
                                    {notifications}
                                </Badge>
                            )}
                            <span className="sr-only">Notificaciones</span>
                        </Button>

                        {/* User Menu - Eventbrite style */}
                        <div className="relative" ref={userMenuRef}>
                            <Button
                                variant="ghost"
                                className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400"
                                onClick={() =>
                                    setIsUserMenuOpen(!isUserMenuOpen)
                                }
                            >
                                <Avatar className="h-8 w-8 border border-gray-200 dark:border-gray-700">
                                    <AvatarImage
                                        src="/placeholder.svg"
                                        alt={userName}
                                    />
                                    <AvatarFallback className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
                                        {userName.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                                <span className="hidden sm:inline">
                                    {userName}
                                </span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>

                            {isUserMenuOpen && (
                                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 rounded-lg shadow-lg py-1 z-10 border border-gray-200 dark:border-gray-700">
                                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {userName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-1">
                                            {userEmail}
                                        </p>
                                    </div>
                                    <div className="py-2">
                                        <Link
                                            href={route("dashboard")}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onClick={() => {
                                                setCurrentView("dashboard");
                                                setIsUserMenuOpen(false);
                                            }}
                                        >
                                            <Ticket className="w-4 h-4 mr-2" />
                                            Tickets (0)
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onClick={() => {
                                                setCurrentView("me-gustaron");
                                                setIsUserMenuOpen(false);
                                            }}
                                        >
                                            <Heart className="w-4 h-4 mr-2" />
                                            Liked
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onClick={() => {
                                                setCurrentView("siguiendo");
                                                setIsUserMenuOpen(false);
                                            }}
                                        >
                                            <Users className="w-4 h-4 mr-2" />
                                            Following
                                        </Link>
                                        <Link
                                            href="#"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                            onClick={() => {
                                                setCurrentView("intereses");
                                                setIsUserMenuOpen(false);
                                            }}
                                        >
                                            <Compass className="w-4 h-4 mr-2" />
                                            Interests
                                        </Link>
                                    </div>
                                    <div className="border-t border-gray-200 dark:border-gray-700 py-2">
                                        <Link
                                            href={route("perfil.edit")}
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                                        >
                                            <Settings className="w-4 h-4 mr-2" />
                                            Account settings
                                        </Link>
                                        <button
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left"
                                            onClick={() => {
                                                const form =
                                                    document.createElement(
                                                        "form"
                                                    );
                                                form.method = "POST";
                                                form.action = route("logout");

                                                const csrfToken = document
                                                    .querySelector(
                                                        'meta[name="csrf-token"]'
                                                    )
                                                    ?.getAttribute("content");
                                                if (csrfToken) {
                                                    const csrfInput =
                                                        document.createElement(
                                                            "input"
                                                        );
                                                    csrfInput.type = "hidden";
                                                    csrfInput.name = "_token";
                                                    csrfInput.value = csrfToken;
                                                    form.appendChild(csrfInput);
                                                }

                                                document.body.appendChild(form);
                                                form.submit();
                                            }}
                                        >
                                            <LogOut className="w-4 h-4 mr-2" />
                                            Log out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="flex flex-1">
                {/* Sidebar (desktop only) */}
                <aside className="hidden w-64 flex-col border-r bg-white dark:bg-gray-900 md:flex">
                    <div className="flex-1 overflow-auto py-6 px-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-2">
                            MAIN MENU
                        </h3>
                        <div className="space-y-1">
                            <NavItem
                                icon={LayoutDashboard}
                                label="Dashboard"
                                isActive={currentView === "dashboard"}
                                onClick={() => setCurrentView("dashboard")}
                            />
                            <NavItem
                                icon={Ticket}
                                label="Mis Asistencias"
                                isActive={currentView === "mis-asistencias"}
                                onClick={() =>
                                    setCurrentView("mis-asistencias")
                                }
                            />
                            <NavItem
                                icon={Heart}
                                label="Me gustaron"
                                isActive={currentView === "me-gustaron"}
                                onClick={() => setCurrentView("me-gustaron")}
                            />
                            <NavItem
                                icon={Users}
                                label="Siguiendo"
                                isActive={currentView === "siguiendo"}
                                onClick={() => setCurrentView("siguiendo")}
                            />
                            <NavItem
                                icon={Compass}
                                label="Intereses"
                                isActive={currentView === "intereses"}
                                onClick={() => setCurrentView("intereses")}
                            />
                        </div>
                    </div>
                    <div className="border-t p-4">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 px-2">
                            ACCOUNT
                        </h3>
                        <div className="space-y-1">
                            <NavItem
                                icon={Settings}
                                label="Ajustes de la cuenta"
                                onClick={() =>
                                    (window.location.href =
                                        route("perfil.edit"))
                                }
                            />
                            <NavItem
                                icon={LogOut}
                                label="Cerrar sesión"
                                onClick={() => {
                                    const form = document.createElement("form");
                                    form.method = "POST";
                                    form.action = route("logout");

                                    const csrfToken = document
                                        .querySelector(
                                            'meta[name="csrf-token"]'
                                        )
                                        ?.getAttribute("content");
                                    if (csrfToken) {
                                        const csrfInput =
                                            document.createElement("input");
                                        csrfInput.type = "hidden";
                                        csrfInput.name = "_token";
                                        csrfInput.value = csrfToken;
                                        form.appendChild(csrfInput);
                                    }

                                    document.body.appendChild(form);
                                    form.submit();
                                }}
                            />
                        </div>
                    </div>
                </aside>

                {/* Main content area */}
                <main className="flex-1 overflow-auto">
                    <div className="container mx-auto p-6 md:p-8 max-w-7xl">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
