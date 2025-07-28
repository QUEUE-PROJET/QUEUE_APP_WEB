// components/Sidebar.tsx
import { Link } from "@remix-run/react";
import {
  Building2,
  Home,
  LogOut,
  Settings,
  Users
} from "lucide-react";

export function Sidebar() {
  return (
    <div className="hidden md:flex md:flex-shrink-0">
      <div className="flex flex-col w-64 h-screen border-r border-gray-200 bg-white">
        <div className="flex items-center justify-center h-16 px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
        <div className="flex flex-col flex-grow p-4 overflow-y-auto">
          <nav className="flex-1 space-y-2">
            <Link
              to="/admin"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <Home className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-900" />
              Tableau de bord
            </Link>
            <Link
              
              to="/admin/companies"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <Building2 className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-900" />
              Entreprises
            </Link>
            <Link
              to="/admin/users"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <Users className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-900" />
              Utilisateurs
            </Link>
         
          </nav>
          <div className="mt-auto space-y-2">
            <Link
              to="/admin/settings"
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-900 rounded-lg hover:bg-gray-100 group"
            >
              <Settings className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-900" />
              Paramètres
            </Link>
            <form method="post" action="/logout" className="w-full">
              <button
                type="submit"
                className="flex items-center w-full px-4 py-2 text-sm font-medium text-left text-gray-900 rounded-lg hover:bg-gray-100 group"
              >
                <LogOut className="w-5 h-5 mr-3 text-gray-500 group-hover:text-gray-900" />
                Déconnexion
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}