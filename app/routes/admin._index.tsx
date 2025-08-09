import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Sidebar } from "~/components/SidebarAdmin";
import {
  fetchCompanies
} from "~/utils/api";

import {
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  Building2,
  Calendar,
  Clock,
  PieChart,
  Ticket
} from "lucide-react";
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart as RechartsPieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { requireAuth } from "~/services/auth.server";

interface PendingCompany {
  id: string;
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
  const { user } = await requireAuth(request, "ADMINISTRATEUR");

  const companies = await fetchCompanies();

  const pendingCompanies = companies
    .filter((c: any) => c.statutEntreprise === "EN_ATTENTE")
    .map((c: any) => ({
      id: c.id,
      name: c.name,
      type: c.categorie || "—",
      date: new Date(c.created_at).toLocaleDateString("fr-FR"),
      status: "En attente",
    }));

  const activeCompanies = companies
    .filter((c: any) => c.statutEntreprise === "ACCEPTEE")
    .map((c: any) => ({
      id: c.id,
      name: c.name,
      type: c.categorie || "—",
      users: c.user_count || 0,
      ticketsPerDay: c.daily_tickets || 0,
      status: "Actif",
    }));

  const rejectedCompanies = companies
    .filter((c: any) => c.statutEntreprise === "REJETEE");

  const data: DashboardData = {
    stats: {
      activeCompanies: activeCompanies.length,
      rejectcompanies: rejectedCompanies.length,
      pendingRequests: pendingCompanies.length,
      processedTickets: activeCompanies.reduce(
        (sum, c) => sum + (c.ticketsPerDay || 0),
        0
      ),
    },
    pendingCompanies,
    activeCompanies,
  };

  return json(data);
}

function StatCard({ title, value, subtitle, icon: Icon, color, trend }: {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ComponentType<any>;
  color: string;
  trend?: 'up' | 'down';
}) {
  const TrendIcon = trend === 'up' ? ArrowUpRight : trend === 'down' ? ArrowDownRight : null;

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {TrendIcon && (
          <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            <TrendIcon className="w-3 h-3" />
          </div>
        )}
      </div>

      <div>
        <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
        <p className="text-sm text-gray-500">{subtitle}</p>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { stats, pendingCompanies, activeCompanies } = useLoaderData<typeof loader>();

  // Préparer les données pour le graphique en secteurs (statuts des entreprises)
  const pieData = [
    { name: 'Actives', value: stats.activeCompanies, color: '#10B981' },
    { name: 'En attente', value: stats.pendingRequests, color: '#F59E0B' },
    { name: 'Rejetées', value: stats.rejectcompanies, color: '#EF4444' }
  ];

  // Préparer les données pour le graphique en barres (entreprises par catégorie)
  const categoryCounts = activeCompanies.reduce((acc, company) => {
    const type = company.type || 'Non défini';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const barData = Object.entries(categoryCounts).map(([category, count]) => ({
    category: category,
    count: count,
    users: activeCompanies
      .filter(c => c.type === category)
      .reduce((sum, c) => sum + c.users, 0)
  }));

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Dashboard Administrateur</h1>
              <p className="text-gray-600">Vue d'ensemble des entreprises et performances</p>
            </div>
            <div className="flex items-center space-x-3">
              <button className="px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
                <Calendar className="w-4 h-4" />
                <span>Cette semaine</span>
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Entreprises actives"
            value={stats.activeCompanies}
            subtitle="+3 ce mois-ci"
            icon={Building2}
            color="bg-gradient-to-r from-emerald-500 to-emerald-600"
            trend="up"
          />
          <StatCard
            title="Entreprises rejetées"
            value={stats.rejectcompanies}
            subtitle="Ce mois-ci"
            icon={Building2}
            color="bg-gradient-to-r from-red-500 to-red-600"
          />
          <StatCard
            title="Demandes en attente"
            value={stats.pendingRequests}
            subtitle="À valider"
            icon={Clock}
            color="bg-gradient-to-r from-amber-500 to-amber-600"
          />
          <StatCard
            title="Tickets traités"
            value={stats.processedTickets.toLocaleString()}
            subtitle="Cette semaine"
            icon={Ticket}
            color="bg-gradient-to-r from-blue-500 to-blue-600"
            trend="up"
          />
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pie Chart - Répartition des entreprises */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <PieChart className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Répartition des entreprises</h2>
                <p className="text-sm text-gray-500">Par statut de validation</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>

            {/* Légende personnalisée */}
            <div className="flex justify-center space-x-6 mt-4">
              {pieData.map((item, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600">{item.name} ({item.value})</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart - Entreprises par catégorie */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Entreprises par catégorie</h2>
                <p className="text-sm text-gray-500">Répartition des entreprises actives</p>
              </div>
            </div>

            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis
                    dataKey="category"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: 12, fill: '#64748b' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                    }}
                  />
                  <Bar
                    dataKey="count"
                    fill="#8b5cf6"
                    radius={[4, 4, 0, 0]}
                    name="Entreprises"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}