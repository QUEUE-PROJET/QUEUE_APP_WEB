import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { Sidebar } from "~/components/SidebarAdmin";
import { fetchCompanies } from "~/utils/api";

import { BarChart3, Building2, Clock, PieChart, } from "lucide-react";
import {
    Bar,
    BarChart,
    CartesianGrid,
    Cell,
    Pie,
    PieChart as RechartsPieChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from "recharts";
import { requireAuth } from "~/services/auth.server";

interface Company {
    id: string;
    name: string;
    categorie?: string;
    created_at: string;
    statutEntreprise: string;
    user_count?: number;
    daily_tickets?: number;
}

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
        rejectcompanies: number;
        processedTickets: number;
    };
    pendingCompanies: PendingCompany[];
    activeCompanies: ActiveCompany[];
}

export async function loader({ request }: LoaderFunctionArgs) {
    await requireAuth(request, "ADMINISTRATEUR");

    const companies = await fetchCompanies();

    const pendingCompanies = companies
        .filter((c: Company) => c.statutEntreprise === "EN_ATTENTE")
        .map((c: Company) => ({
            id: c.id,
            name: c.name,
            type: c.categorie || "—",
            date: new Date(c.created_at).toLocaleDateString("fr-FR"),
            status: "En attente",
        }));

    const activeCompanies = companies
        .filter((c: Company) => c.statutEntreprise === "ACCEPTEE")
        .map((c: Company) => ({
            id: c.id,
            name: c.name,
            type: c.categorie || "—",
            users: c.user_count || 0,
            ticketsPerDay: c.daily_tickets || 0,
            status: "Actif",
        }));

    const rejectedCompanies = companies.filter(
        (c: Company) => c.statutEntreprise === "REJETEE"
    );

    const data: DashboardData = {
        stats: {
            activeCompanies: activeCompanies.length,
            totalUsers: activeCompanies.reduce(
                (sum: number, c: ActiveCompany) => sum + (c.users || 0),
                0
            ),
            rejectcompanies: rejectedCompanies.length,
            pendingRequests: pendingCompanies.length,
            processedTickets: activeCompanies.reduce(
                (sum: number, c: ActiveCompany) => sum + (c.ticketsPerDay || 0),
                0
            ),
        },
        pendingCompanies,
        activeCompanies,
    };

    return json(data);
}

export default function AdminDashboard() {
    const { stats, pendingCompanies, activeCompanies } =
        useLoaderData<typeof loader>();

    // Préparer les données pour le graphique en secteurs (statuts des entreprises)
    const pieData = [
        { name: "Actives", value: stats.activeCompanies, color: "#10B981" },
        { name: "En attente", value: stats.pendingRequests, color: "#F59E0B" },
        { name: "Rejetées", value: stats.rejectcompanies, color: "#EF4444" },
    ];

    // Préparer les données pour le graphique en barres (entreprises par catégorie)
    const categoryCounts = activeCompanies.reduce((acc, company) => {
        const type = company.type || "Non défini";
        acc[type] = (acc[type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(categoryCounts).map(([category, count]) => ({
        category: category,
        count: count,
        users: activeCompanies
            .filter((c) => c.type === category)
            .reduce((sum, c) => sum + c.users, 0),
    }));

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
            <Sidebar notificationCount={5} />

            <div className="ml-64 overflow-y-auto">

                {/* Main Content - 3 Column Layout */}
                <div className="p-8">
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-full">
                        {/* Left Column - Statistics Cards (Vertical Stack) */}
                        <div className="xl:col-span-1 space-y-6">
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center mr-3 shadow-lg">
                                        <PieChart className="w-5 h-5 text-white" />
                                    </span>
                                    Métriques Clés
                                </h3>
                                <div className="space-y-4">
                                    {/* Vertical Stack of Mini Stats */}
                                    <div className="group relative overflow-hidden flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-emerald-100/50 border border-emerald-200/60 hover:from-emerald-100 hover:to-emerald-200/50 transition-all duration-300">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                <Building2 className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Entreprises actives
                                                </p>
                                                <p className="text-xs text-emerald-600 font-medium">
                                                    +3 ce mois-ci ↗
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-black text-emerald-700">
                                            {stats.activeCompanies}
                                        </div>
                                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-emerald-400/10 rounded-full" />
                                    </div>

                                    <div className="group relative overflow-hidden flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-red-50 to-red-100/50 border border-red-200/60 hover:from-red-100 hover:to-red-200/50 transition-all duration-300">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                <Building2 className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    Entreprises rejetées
                                                </p>
                                                <p className="text-xs text-red-600 font-medium">
                                                    Ce mois-ci
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-black text-red-700">
                                            {stats.rejectcompanies}
                                        </div>
                                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-red-400/10 rounded-full" />
                                    </div>

                                    <div className="group relative overflow-hidden flex items-center justify-between p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100/50 border border-amber-200/60 hover:from-amber-100 hover:to-amber-200/50 transition-all duration-300">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform duration-300">
                                                <Clock className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    En attente
                                                </p>
                                                <p className="text-xs text-amber-600 font-medium">
                                                    À valider
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-3xl font-black text-amber-700">
                                            {stats.pendingRequests}
                                        </div>
                                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-amber-400/10 rounded-full" />
                                    </div>


                                </div>
                            </div>

                            {/* Performance Quick View */}
                            <div className="bg-gradient-to-br from-blue-900 to-blue-800 rounded-2xl p-6 text-white shadow-xl border border-blue-700/50">
                                <h3 className="text-lg font-semibold mb-4 flex items-center">
                                    <BarChart3 className="w-5 h-5 mr-2 text-yellow-400" />
                                    Performance
                                </h3>
                                <div className="grid grid-cols-1 gap-3">
                                    <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="text-2xl font-bold text-yellow-400 mb-1">
                                            {stats.pendingRequests}
                                        </div>
                                        <div className="text-xs text-blue-200">
                                            En attente
                                        </div>
                                    </div>
                                    <div className="text-center bg-white/10 rounded-lg p-3 backdrop-blur-sm">
                                        <div className="text-2xl font-bold text-yellow-400 mb-1">
                                            {(
                                                (stats.activeCompanies /
                                                    (stats.activeCompanies +
                                                        stats.pendingRequests +
                                                        stats.rejectcompanies)) *
                                                100
                                            ).toFixed(0)}
                                            %
                                        </div>
                                        <div className="text-xs text-blue-200">
                                            Taux d&apos;acceptation
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Center and Right Columns - Charts Side by Side */}
                        <div className="xl:col-span-2 grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Pie Chart */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center mr-3 shadow-lg">
                                            <PieChart className="w-5 h-5 text-white" />
                                        </span>
                                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            Répartition des entreprises
                                        </span>
                                    </h3>
                                </div>

                                <div className="h-64 mb-6">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <RechartsPieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={50}
                                                outerRadius={80}
                                                paddingAngle={2}
                                                dataKey="value"
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell
                                                        key={`cell-${index}`}
                                                        fill={entry.color}
                                                    />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor:
                                                        "rgba(255,255,255,0.95)",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    boxShadow:
                                                        "0 20px 25px -5px rgba(0,0,0,0.1)",
                                                }}
                                            />
                                        </RechartsPieChart>
                                    </ResponsiveContainer>
                                </div>

                                <div className="space-y-3">
                                    {pieData.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between p-3 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200/50 hover:from-gray-100 hover:to-gray-200/50 transition-all duration-300"
                                        >
                                            <div className="flex items-center space-x-2">
                                                <div
                                                    className={`w-4 h-4 rounded-full shadow-sm ${item.color === "#10B981"
                                                        ? "bg-emerald-500"
                                                        : item.color ===
                                                            "#F59E0B"
                                                            ? "bg-amber-500"
                                                            : "bg-red-500"
                                                        }`}
                                                ></div>
                                                <span className="text-sm font-semibold text-gray-800">
                                                    {item.name}
                                                </span>
                                            </div>
                                            <span className="text-sm font-black text-gray-900 px-2 py-1 bg-white/50 rounded-lg">
                                                {item.value}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Bar Chart */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-xl font-bold text-gray-900 flex items-center">
                                        <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center mr-3 shadow-lg">
                                            <BarChart3 className="w-5 h-5 text-white" />
                                        </span>
                                        <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                            Entreprises par catégorie
                                        </span>
                                    </h3>
                                </div>

                                <div className="h-64">
                                    <ResponsiveContainer
                                        width="100%"
                                        height="100%"
                                    >
                                        <BarChart data={barData}>
                                            <CartesianGrid
                                                strokeDasharray="3 3"
                                                stroke="#e2e8f0"
                                            />
                                            <XAxis
                                                dataKey="category"
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 12,
                                                    fill: "#64748b",
                                                    fontWeight: 600,
                                                }}
                                            />
                                            <YAxis
                                                axisLine={false}
                                                tickLine={false}
                                                tick={{
                                                    fontSize: 12,
                                                    fill: "#64748b",
                                                    fontWeight: 600,
                                                }}
                                            />
                                            <Tooltip
                                                contentStyle={{
                                                    backgroundColor:
                                                        "rgba(255,255,255,0.95)",
                                                    border: "none",
                                                    borderRadius: "12px",
                                                    boxShadow:
                                                        "0 20px 25px -5px rgba(0,0,0,0.1)",
                                                }}
                                            />
                                            <Bar
                                                dataKey="count"
                                                fill="#8b5cf6"
                                                radius={[6, 6, 0, 0]}
                                                name="Entreprises"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enterprises Quick View */}
                {pendingCompanies.length > 0 && (
                    <div className="px-8 pb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
                            <div className="mb-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center">
                                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center mr-3 shadow-lg">
                                        <Clock className="w-5 h-5 text-white" />
                                    </span>
                                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                        Entreprises en attente de validation
                                    </span>
                                </h3>
                                <p className="text-sm text-gray-600 font-medium">
                                    Actions requises pour{" "}
                                    <span className="text-yellow-600 font-bold">
                                        {pendingCompanies.length}
                                    </span>{" "}
                                    demandes
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {pendingCompanies.slice(0, 6).map((company) => (
                                    <div
                                        key={company.id}
                                        className="group relative overflow-hidden p-5 border-2 border-yellow-200/60 rounded-2xl bg-gradient-to-br from-yellow-50 to-orange-50/50 hover:border-yellow-400 hover:from-yellow-100 hover:to-orange-100/60 transition-all duration-300"
                                    >
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-bold text-gray-900 truncate text-lg">
                                                {company.name}
                                            </h4>
                                            <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-xs font-bold rounded-full shadow">
                                                En attente
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-700 mb-2 font-medium">
                                            {company.type}
                                        </p>
                                        <p className="text-xs text-gray-500 font-medium">
                                            Demande du {company.date}
                                        </p>
                                        <div className="absolute -top-8 -right-8 w-24 h-24 bg-yellow-400/10 rounded-full" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}