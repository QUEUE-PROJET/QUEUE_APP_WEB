import { NavLink, useNavigation } from "@remix-run/react";
import {
    Bell,
    Building2,
    FileText,
    Home,
    Loader2,
    LogOut,
    Settings,
    Users,
} from "lucide-react";
import { usePrefetchData } from "~/hooks/useApiQueries";

interface SidebarProps {
    notificationCount?: number;
}

export function OptimizedSidebar({ notificationCount = 0 }: SidebarProps) {
    const navigation = useNavigation();
    const isNavigating = navigation.state === "loading";
    const { prefetchCompanies, prefetchUsers } = usePrefetchData();

    const NavLinkWithPrefetch = ({
        to,
        children,
        icon: Icon,
        onHover
    }: {
        to: string;
        children: React.ReactNode;
        icon: React.ComponentType<{ className?: string }>;
        onHover?: () => void;
    }) => {
        const isCurrentRoute = navigation.location?.pathname === to;
        const isLoadingThisRoute = isNavigating && isCurrentRoute;

        return (
            <NavLink
                to={to}
                onMouseEnter={onHover} // Prefetch au survol
                className={({ isActive }) =>
                    `group relative flex items-center px-5 py-4 text-sm font-bold rounded-2xl transition-all duration-500 transform ${isActive
                        ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-blue-900 shadow-2xl scale-110 translate-x-2"
                        : "text-blue-100 hover:bg-white/20 hover:text-white hover:scale-105 hover:translate-x-1"
                    } overflow-hidden ${isLoadingThisRoute ? 'pointer-events-none opacity-75' : ''}`
                }
            >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                {isLoadingThisRoute ? (
                    <Loader2 className="w-6 h-6 mr-4 animate-spin relative z-10" />
                ) : (
                    <Icon className="w-6 h-6 mr-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 relative z-10" />
                )}
                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                    {children}
                </span>
            </NavLink>
        );
    };

    return (
        <div className="hidden md:flex md:flex-shrink-0 fixed left-0 top-0 z-30">
            <div className="flex flex-col w-64 h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-700 text-white relative overflow-hidden shadow-2xl">
                {/* Background Effects */}
                <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full blur-3xl animate-pulse"></div>
                    <div className="absolute top-1/3 left-0 w-32 h-32 bg-gradient-to-br from-yellow-300 to-yellow-400 rounded-full blur-2xl animate-pulse delay-1000"></div>
                    <div className="absolute bottom-1/4 right-0 w-48 h-48 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full blur-3xl animate-pulse delay-2000"></div>
                    <div className="absolute bottom-0 left-0 w-36 h-36 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full blur-2xl animate-pulse delay-500"></div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/20 via-transparent to-yellow-500/20 opacity-50"></div>

                {/* Header */}
                <div className="relative flex items-center justify-center h-20 px-6 border-b border-white/30 bg-white/10 backdrop-blur-sm">
                    <div className="flex items-center space-x-4 group">
                        <div className="relative">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                                <img
                                    src="/assets/images/logo_Qapp.jpg"
                                    alt="Q-App Logo"
                                    className="w-8 h-8 object-contain rounded-lg"
                                />
                            </div>
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white group-hover:text-yellow-300 transition-colors duration-300">
                                Q-Admin
                            </h1>
                            <p className="text-xs text-blue-200 font-medium">
                                Control Center
                            </p>
                        </div>
                    </div>
                </div>

                {/* Navigation avec prefetch */}
                <div className="relative flex flex-col flex-grow p-6 overflow-y-auto">
                    <nav className="flex-1 space-y-2">
                        <NavLinkWithPrefetch
                            to="/admin"
                            icon={Home}
                            onHover={() => {
                                // Prefetch des données du dashboard
                                prefetchCompanies();
                            }}
                        >
                            Tableau de bord
                        </NavLinkWithPrefetch>

                        <NavLinkWithPrefetch
                            to="/admin/companies"
                            icon={Building2}
                            onHover={prefetchCompanies}
                        >
                            Entreprises
                        </NavLinkWithPrefetch>

                        <NavLinkWithPrefetch
                            to="/admin/users"
                            icon={Users}
                            onHover={prefetchUsers}
                        >
                            Utilisateurs
                        </NavLinkWithPrefetch>

                        <NavLinkWithPrefetch
                            to="/admin/rapports"
                            icon={FileText}
                            onHover={prefetchCompanies}
                        >
                            Rapports
                        </NavLinkWithPrefetch>

                        <NavLink
                            to="/admin/notifications"
                            className={({ isActive }) => {
                                const isCurrentRoute = navigation.location?.pathname === "/admin/notifications";
                                const isLoadingThisRoute = isNavigating && isCurrentRoute;

                                return `group relative flex items-center px-5 py-4 text-sm font-bold rounded-2xl transition-all duration-500 transform ${isActive
                                        ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-blue-900 shadow-2xl scale-110 translate-x-2"
                                        : "text-blue-100 hover:bg-white/20 hover:text-white hover:scale-105 hover:translate-x-1"
                                    } overflow-hidden ${isLoadingThisRoute ? 'pointer-events-none opacity-75' : ''}`;
                            }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                            <div className="relative mr-4">
                                {navigation.location?.pathname === "/admin/notifications" && isNavigating ? (
                                    <Loader2 className="w-6 h-6 animate-spin relative z-10" />
                                ) : (
                                    <Bell className="w-6 h-6 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 relative z-10" />
                                )}
                                {notificationCount > 0 && (
                                    <span className="pointer-events-none absolute -top-1 -right-1" aria-hidden="true">
                                        <span className="block h-2.5 w-2.5 rounded-full bg-gradient-to-br from-red-500 to-red-600 ring-2 ring-white/80 ring-offset-1 ring-offset-blue-900/60 shadow"></span>
                                    </span>
                                )}
                            </div>
                            <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                                Notifications
                            </span>
                        </NavLink>
                    </nav>

                    {/* Bottom Section */}
                    <div className="mt-8 space-y-2 pt-6 border-t border-white/30">
                        <NavLinkWithPrefetch
                            to="/admin/settings"
                            icon={Settings}
                        >
                            Paramètres
                        </NavLinkWithPrefetch>

                        <form method="post" action="/logout" className="w-full">
                            <button
                                type="submit"
                                className="group relative flex items-center w-full px-5 py-4 text-sm font-bold text-left rounded-2xl transition-all duration-500 transform text-blue-100 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white hover:scale-105 hover:translate-x-1 overflow-hidden"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-all duration-1000"></div>
                                <LogOut className="w-6 h-6 mr-4 group-hover:translate-x-2 group-hover:scale-110 transition-all duration-300 relative z-10" />
                                <span className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                                    Déconnexion
                                </span>
                            </button>
                        </form>
                    </div>

                    {/* Status Indicator */}
                    <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
                        <div className="flex items-center space-x-3">
                            <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                            <div>
                                <p className="text-xs font-bold text-white">
                                    Système Opérationnel
                                </p>
                                <p className="text-xs text-blue-200">
                                    Toutes les fonctions actives
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
