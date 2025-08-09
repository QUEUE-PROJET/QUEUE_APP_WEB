import { Form, NavLink, useLocation } from "@remix-run/react";

interface User {
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface LayoutProps {
  children: React.ReactNode;
  user?: User;
  entrepriseId?: string;
  notificationCount?: number; // Nombre de notifications non lues
}

// Petite fonction utilitaire pour vérifier les rôles autorisés
function hasAccess(role: string | undefined, allowed: string[]) {
  return role ? allowed.includes(role) : false;
}

export function Layout({ children, user, entrepriseId, notificationCount = 0 }: LayoutProps) {
  const location = useLocation();

  // Helper pour générer les liens dashboard avec le bon paramètre entreprise
  const dashLink = (path: string) => {
    if (user?.role === "EMPLOYE" && typeof entrepriseId === "string" && entrepriseId.length > 0) {
      const sep = path.includes("?") ? "&" : "?";
      return `${path}${sep}entreprise=${entrepriseId}`;
    }
    return path;
  };

  // Helper pour vérifier si un lien est actif
  const isActiveLink = (path: string) => {
    const linkPath = dashLink(path);
    return location.pathname === linkPath || location.pathname + location.search === linkPath;
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-72 bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white flex flex-col shadow-2xl">
        {/* Header avec logo */}
        <div className="p-6 border-b border-blue-700/30">
          <div className="flex items-center space-x-3">
            {/* Logo avec animation et styling */}
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-xl shadow-lg flex items-center justify-center transform rotate-3 hover:rotate-6 transition-transform duration-300 overflow-hidden">
                <img
                  src="/assets/images/logo_Qapp.jpg"
                  alt="Logo QueueManager"
                  className="w-8 h-8 object-contain rounded-lg"
                />
              </div>
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"></div>
            </div>

            <div>
              <span className="font-bold text-xl tracking-wide">
                Q-App
              </span>
              <div className="text-blue-300 text-xs font-medium">
                Gestion De Files D'attente
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-6 px-4 space-y-2">
          {/* Tableau de bord */}
          <NavLink
            to={dashLink("/dashboard")}
            className={() =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActiveLink("/dashboard")
                ? "bg-yellow-400 text-blue-900 shadow-lg transform scale-105"
                : "hover:bg-blue-800/50 hover:translate-x-1"
              }`
            }
          >
            <div
              className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-colors ${isActiveLink("/dashboard")
                ? "bg-blue-900/20"
                : "bg-blue-700 group-hover:bg-blue-600"
                }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
              </svg>
            </div>
            Tableau de bord
          </NavLink>

          {/* Tickets */}
          <NavLink
            to={dashLink("/dashboard/ticket")}
            className={() =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActiveLink("/dashboard/ticket")
                ? "bg-yellow-400 text-blue-900 shadow-lg transform scale-105"
                : "hover:bg-blue-800/50 hover:translate-x-1"
              }`
            }
          >
            <div
              className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-colors ${isActiveLink("/dashboard/ticket")
                ? "bg-blue-900/20"
                : "bg-blue-700 group-hover:bg-blue-600"
                }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            Tickets
          </NavLink>

          {/* Séparateur */}
          <div className="border-t border-blue-700/30 my-4"></div>

          {/* Utilisateurs - Visible uniquement pour ENTREPRISE_AGENT */}
          {hasAccess(user?.role, ["ENTREPRISE_AGENT"]) && (
            <NavLink
              to={dashLink("/dashboard/users")}
              className={() =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActiveLink("/dashboard/users")
                  ? "bg-yellow-400 text-blue-900 shadow-lg transform scale-105"
                  : "hover:bg-blue-800/50 hover:translate-x-1"
                }`
              }
            >
              <div
                className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-colors ${isActiveLink("/dashboard/users")
                  ? "bg-blue-900/20"
                  : "bg-blue-700 group-hover:bg-blue-600"
                  }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
              </div>
              Utilisateurs
            </NavLink>
          )}

          {/* Agences - Visible uniquement pour ENTREPRISE_AGENT */}
          {hasAccess(user?.role, ["ENTREPRISE_AGENT"]) && (
            <NavLink
              to={dashLink("/dashboard/agences")}
              className={() =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActiveLink("/dashboard/agences")
                  ? "bg-yellow-400 text-blue-900 shadow-lg transform scale-105"
                  : "hover:bg-blue-800/50 hover:translate-x-1"
                }`
              }
            >
              <div
                className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-colors ${isActiveLink("/dashboard/agences")
                  ? "bg-blue-900/20"
                  : "bg-blue-700 group-hover:bg-blue-600"
                  }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Agences
            </NavLink>
          )}

          {/* Services */}
          {hasAccess(user?.role, ["ENTREPRISE_AGENT"]) && (
            <NavLink
              to={dashLink("/dashboard/services")}
              className={() =>
                `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActiveLink("/dashboard/services")
                  ? "bg-yellow-400 text-blue-900 shadow-lg transform scale-105"
                  : "hover:bg-blue-800/50 hover:translate-x-1"
                }`
              }
            >
              <div
                className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-colors ${isActiveLink("/dashboard/services")
                  ? "bg-blue-900/20"
                  : "bg-blue-700 group-hover:bg-blue-600"
                  }`}
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path
                    fillRule="evenodd"
                    d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              Services
            </NavLink>

          )
          }


          {/* Rapports */}
          {/* <NavLink
            to={dashLink("/dashboard/reports")}
            className={() =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActiveLink("/dashboard/reports")
                ? "bg-yellow-400 text-blue-900 shadow-lg transform scale-105"
                : "hover:bg-blue-800/50 hover:translate-x-1"
              }`
            }
          >
            <div
              className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-colors ${isActiveLink("/dashboard/reports")
                ? "bg-blue-900/20"
                : "bg-blue-700 group-hover:bg-blue-600"
                }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            Rapports
          </NavLink> */}

          {/* Paramètres */}
          <NavLink
            to={dashLink("/dashboard/settings")}
            className={() =>
              `group flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActiveLink("/dashboard/settings")
                ? "bg-yellow-400 text-blue-900 shadow-lg transform scale-105"
                : "hover:bg-blue-800/50 hover:translate-x-1"
              }`
            }
          >
            <div
              className={`w-6 h-6 mr-4 rounded-lg flex items-center justify-center transition-colors ${isActiveLink("/dashboard/settings")
                ? "bg-blue-900/20"
                : "bg-blue-700 group-hover:bg-blue-600"
                }`}
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            Paramètres
          </NavLink>
        </nav>

        {/* Bouton de déconnexion */}
        <div className="p-4 border-t border-blue-700/30">
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-3 
                         px-4 py-3 text-sm font-medium 
                         text-white bg-gradient-to-r from-red-600 to-red-700 
                         hover:from-red-700 hover:to-red-800 
                         rounded-xl transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 focus:ring-offset-blue-900
                         active:scale-95 shadow-lg hover:shadow-xl"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Déconnexion</span>
            </button>
          </Form>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col">
        {/* Header amélioré */}
        <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
          <div className="flex justify-between items-center px-8 py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gray-900">Q-App</h1>
              <div className="hidden sm:block">
                <span className="px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                  {user?.role?.replace("_", " ").toLowerCase()}
                </span>
              </div>
            </div>

            {/* Profil utilisateur amélioré */}
            <div className="flex items-center space-x-4">
              {/* Indicateur de notifications dans le header */}
              {notificationCount > 0 && (
                <div className="relative">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-red-600"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                    </svg>
                  </div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {notificationCount > 9 ? "9+" : notificationCount}
                    </span>
                  </div>
                </div>
              )}

              {/* Info utilisateur */}
              <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-yellow-50 rounded-xl px-4 py-2 border border-blue-100">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-sm">
                    {user?.initials || "??"}
                  </span>
                </div>
                <div className="hidden sm:block">
                  <div className="font-semibold text-gray-900 text-sm">
                    {user?.name}
                  </div>
                  <div className="text-xs text-gray-500">{user?.email}</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Contenu principal */}
        <main className="flex-1 p-8 bg-gray-50">{children}</main>
      </div>
    </div>
  );
}