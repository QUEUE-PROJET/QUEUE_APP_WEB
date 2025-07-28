import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Sidebar } from "~/components/SidebarAdmin";
import {
  fetchCompanies
} from "~/utils/api";

import {
  Building2,
  Clock,
  Ticket,
  Users
} from "lucide-react";
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

// Fichier actuel (simplifié)
export default function AdminDashboard() {
  const { stats } = useLoaderData<typeof loader>();

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 overflow-y-auto">
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
            title="Entreprises rejetées"
            value={stats.rejectcompanies}
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

        {/* Vous pouvez garder d'autres éléments si nécessaire */}
      </div>
    </div>
  );
}