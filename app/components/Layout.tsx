import { NavLink } from "@remix-run/react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-blue-900 text-white">
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-yellow-400 rounded flex items-center justify-center">
              <span className="text-blue-900 font-bold text-sm">Q</span>
            </div>
            <span className="font-semibold text-lg">QueueManager</span>
          </div>
        </div>
        
        <nav className="mt-8">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
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
            to="/ticket"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
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
          
          <NavLink
            to="/users"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
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
            to="/agences"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
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
          
          <NavLink
            to="/services"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
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
            to="/settings"
            className={({ isActive }) =>
              `flex items-center px-6 py-3 text-sm font-medium transition-colors ${
                isActive
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
      </div>
      
      {/* Main content */}
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="flex justify-end items-center px-8 py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-semibold text-sm">JD</span>
              </div>
              <div>
                <div className="font-semibold text-gray-900">Jean Dupont</div>
                <div className="text-sm text-gray-500">Administrateur</div>
              </div>
            </div>
          </div>
        </header>
        
        {/* Page content */}
        <main className="p-8">
          {children}
        </main>
      </div>
    </div>
  );
}