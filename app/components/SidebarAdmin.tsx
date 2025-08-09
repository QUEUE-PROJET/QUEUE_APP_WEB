import { NavLink } from "@remix-run/react";
import { Bell, Building2, Home, LogOut, Settings, Users } from "lucide-react";

interface SidebarProps {
  notificationCount?: number;
}

export function Sidebar({ notificationCount = 0 }: SidebarProps) {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-screen border-r border-gray-200 bg-white">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-lg group ${
                  isActive
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Home className="w-5 h-5 mr-3" />
              Tableau de bord
            </NavLink>

            <NavLink
              to="/admin/companies"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-lg group ${
                  isActive
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Building2 className="w-5 h-5 mr-3" />
              Entreprises
            </NavLink>

            <NavLink
              to="/admin/users"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-lg group ${
                  isActive
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Users className="w-5 h-5 mr-3" />
              Utilisateurs
            </NavLink>

            <NavLink
              to="/admin/notifications"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-lg group relative ${
                  isActive
                    ? "bg-yellow-100 text-yellow-900"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Bell className="w-5 h-5 mr-3" />
              Notifications
              {notificationCount > 0 && (
                <span className="absolute right-4 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
                  {notificationCount > 9 ? "9+" : notificationCount}
                </span>
              )}
            </NavLink>
          </nav>

          <div className="mt-auto space-y-2">
            <NavLink
              to="/admin/settings"
              className={({ isActive }) =>
                `flex items-center px-4 py-2 text-sm font-medium rounded-lg group ${
                  isActive
                    ? "bg-blue-100 text-blue-900"
                    : "text-gray-900 hover:bg-gray-100"
                }`
              }
            >
              <Settings className="w-5 h-5 mr-3" />
              Paramètres
            </NavLink>

            <form method="post" action="/logout" className="w-full">
              <button
                type="submit"
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-left text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <LogOut className="w-5 h-5 mr-3" />
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}