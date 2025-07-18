import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/LayoutAdmin";


import { 
  Building2, 
  Users, 
  Clock, 
  Ticket, 
  Eye,
  Check,
  X,
  Play,
  Pause
} from "lucide-react";

interface PendingCompany {
  id: number;
  name: string;
  type: string;
  date: string;
  status: string;
}

interface ActiveCompany {
  id: number;
  name: string;
  type: string;
  users: number;
  ticketsPerDay: number;
  status: string;
}

interface DashboardData {
  stats: {
    activeCompanies: number;
    totalUsers: number;
    pendingRequests: number;
    processedTickets: number;
  };
  pendingCompanies: PendingCompany[];
  activeCompanies: ActiveCompany[];
}

export async function loader({ request }: LoaderFunctionArgs) {
  // Simuler les données (remplacer par des appels API réels)
  const data: DashboardData = {
    stats: {
      activeCompanies: 24,
      totalUsers: 156,
      pendingRequests: 5,
      processedTickets: 1248
    },
    pendingCompanies: [
      {
        id: 1,
        name: 'Banque Centrale',
        type: 'Finance',
        date: '05/07/2025',
        status: 'En attente'
      },
      {
        id: 2,
        name: 'Hôpital Régional',
        type: 'Santé',
        date: '04/07/2025',
        status: 'En attente'
      },
      {
        id: 3,
        name: 'Mairie Centrale',
        type: 'Administration',
        date: '03/07/2025',
        status: 'En attente'
      },
      {
        id: 4,
        name: 'Restaurant Le Gourmet',
        type: 'Restauration',
        date: '02/07/2025',
        status: 'En attente'
      }
    ],
    activeCompanies: [
      {
        id: 1,
        name: 'Télécom Services',
        type: 'Télécommunication',
        users: 12,
        ticketsPerDay: 85,
        status: 'Actif'
      },
      {
        id: 2,
        name: 'Banque Nationale',
        type: 'Finance',
        users: 24,
        ticketsPerDay: 120,
        status: 'Actif'
      },
      {
        id: 3,
        name: 'Centre Commercial',
        type: 'Commerce',
        users: 8,
        ticketsPerDay: 45,
        status: 'Actif'
      },
      {
        id: 4,
        name: 'Clinique du Parc',
        type: 'Santé',
        users: 15,
        ticketsPerDay: 65,
        status: 'Inactif'
      }
    ]
  };

  return json(data);
}

function StatCard({ title, value, subtitle, icon: Icon, color }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
}) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
          <p className="text-sm text-gray-500">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, string> = {
    'En attente': 'bg-yellow-100 text-yellow-800',
    'Actif': 'bg-green-100 text-green-800',
    'Inactif': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[status]}`}>
      {status}
    </span>
  );
}

export default function AdminDashboard() {
  const { stats, pendingCompanies, activeCompanies } = useLoaderData<typeof loader>();

  return (
    <div className="p-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Entreprises actives"
          value={stats.activeCompanies}
          subtitle="+3 ce mois-ci"
          icon={Building2}
          color="bg-blue-600"
        />
        <StatCard
          title="Utilisateurs totaux"
          value={stats.totalUsers}
          subtitle="+12 ce mois-ci"
          icon={Users}
          color="bg-green-600"
        />
        <StatCard
          title="Demandes en attente"
          value={stats.pendingRequests}
          subtitle="Nécessitent validation"
          icon={Clock}
          color="bg-yellow-600"
        />
        <StatCard
          title="Tickets traités"
          value={stats.processedTickets.toLocaleString()}
          subtitle="Cette semaine"
          icon={Ticket}
          color="bg-blue-600"
        />
      </div>

      {/* Pending Companies Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Entreprises en attente de validation</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date de demande
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pendingCompanies.map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={company.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <form method="post" action={`/admin/companies/${company.id}/approve`} className="inline">
                        <button
                          type="submit"
                          className="px-3 py-1 rounded text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
                        >
                          <Check className="w-4 h-4 mr-1 inline" />
                          Valider
                        </button>
                      </form>
                      <form method="post" action={`/admin/companies/${company.id}/reject`} className="inline">
                        <button
                          type="submit"
                          className="px-3 py-1 rounded text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                        >
                          <X className="w-4 h-4 mr-1 inline" />
                          Rejeter
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Companies Preview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Entreprises actives</h3>
          <a 
            href="/admin/companies"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Voir toutes →
          </a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nom
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Utilisateurs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tickets/jour
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {activeCompanies.slice(0, 3).map((company) => (
                <tr key={company.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {company.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.type}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.users}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {company.ticketsPerDay}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={company.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex space-x-2">
                      <a
                        href={`/admin/companies/${company.id}`}
                        className="px-3 py-1 rounded text-sm font-medium bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
                      >
                        <Eye className="w-4 h-4 mr-1 inline" />
                        Voir
                      </a>
                      <form method="post" action={`/admin/companies/${company.id}/toggle`} className="inline">
                        <button
                          type="submit"
                          className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                            company.status === 'Actif' 
                              ? 'bg-red-600 text-white hover:bg-red-700' 
                              : 'bg-green-600 text-white hover:bg-green-700'
                          }`}
                        >
                          {company.status === 'Actif' ? (
                            <>
                              <Pause className="w-4 h-4 mr-1 inline" />
                              Suspendre
                            </>
                          ) : (
                            <>
                              <Play className="w-4 h-4 mr-1 inline" />
                              Activer
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}