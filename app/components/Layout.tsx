import { Form, NavLink } from "@remix-run/react";

interface User {
  name: string;
  email: string;
  role: string;
  initials: string;
}

interface LayoutProps {
  children: React.ReactNode;
  user?: User;
  entrepriseId?: string; // Peut être undefined
}

// Petite fonction utilitaire pour vérifier les rôles autorisés
function hasAccess(role: string | undefined, allowed: string[]) {
  return role ? allowed.includes(role) : false;
}

export function Layout({ children, user, entrepriseId }: LayoutProps) {
  // Helper pour générer les liens dashboard avec le bon paramètre entreprise
  const dashLink = (path: string) => {
    if (user?.role === "EMPLOYE" && typeof entrepriseId === "string" && entrepriseId.length > 0) {
      const sep = path.includes("?") ? "&" : "?";
      return `${path}${sep}entreprise=${entrepriseId}`;
    }
    return path;
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white flex flex-col">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-blue-900 font-bold text-sm">Q</span>
            </div>
            <span className="font-semibold text-lg">QueueManager</span>
          </div>
        </div>

        <nav className="mt-8">
          {/* Accessible à tous */}
          <NavLink
            to={dashLink("/dashboard")}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                ? "bg-blue-800 border-r-3 border-yellow-400"
                : "hover:bg-blue-800"
              }`
            }
          >
            <div className="w-5 h-5 mr-3 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-xs">📊</span>
            </div>
            Tableau de bord
          </NavLink>

          <NavLink
            to={dashLink("/dashboard/ticket")}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                ? "bg-blue-800 border-r-3 border-yellow-400"
                : "hover:bg-blue-800"
              }`
            }
          >
            <div className="w-5 h-5 mr-3 bg-blue-400 rounded flex items-center justify-center">
              <span className="text-xs">🎫</span>
            </div>
            Tickets
          </NavLink>

          {/* Visible uniquement pour ENTREPRISE_AGENT ou ADMINISTRATEUR */}
          {hasAccess(user?.role, ["ENTREPRISE_AGENT"]) && (
            <>
              <NavLink
                to={dashLink("/dashboard/users")}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                    ? "bg-blue-800 border-r-3 border-yellow-400"
                    : "hover:bg-blue-800"
                  }`
                }
              >
                <div className="w-5 h-5 mr-3 bg-gray-400 rounded flex items-center justify-center">
                  <span className="text-xs">👥</span>
                </div>
                Utilisateurs
              </NavLink>

              <NavLink
                to={dashLink("/dashboard/agences")}
                className={({ isActive }) =>
                  `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                    ? "bg-blue-800 border-r-3 border-yellow-400"
                    : "hover:bg-blue-800"
                  }`
                }
              >
                <div className="w-5 h-5 mr-3 bg-blue-400 rounded flex items-center justify-center">
                  <span className="text-xs">🏢</span>
                </div>
                Agences
              </NavLink>
            </>
          )}

          {/* Accessible à tous */}
          <NavLink
            to={dashLink("/dashboard/services")}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                ? "bg-blue-800 border-r-3 border-yellow-400"
                : "hover:bg-blue-800"
              }`
            }
          >
            <div className="w-5 h-5 mr-3 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-xs">🔔</span>
            </div>
            Services
          </NavLink>

          <NavLink
            to={dashLink("/dashboard/settings")}
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${isActive
                ? "bg-blue-800 border-r-3 border-yellow-400"
                : "hover:bg-blue-800"
              }`
            }
          >
            <div className="w-5 h-5 mr-3 bg-gray-400 rounded flex items-center justify-center">
              <span className="text-xs">⚙️</span>
            </div>
            Paramètres
          </NavLink>
        </nav>

        {/* Bouton de déconnexion */}
        <div className="mt-auto p-4 border-t border-blue-800">
          <Form method="post" action="/logout">
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-2 
                         px-4 py-3 text-sm font-medium 
                         text-white bg-red-600 hover:bg-red-700 
                         rounded-lg transition-all duration-200
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                         active:bg-red-800 active:scale-[0.98]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
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
      <div className="flex-1">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-end items-center px-8 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">
                  {user?.initials || "??"}
                </span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">{user?.name}</div>
                <div className="text-sm text-gray-500">
                  {user?.role?.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-8">{children}</main>
      </div>
    </div>
  );
}
