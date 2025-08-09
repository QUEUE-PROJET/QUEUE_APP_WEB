/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { requireAuth } from "~/services/auth.server";
import { fetchEntrepriseDashboard } from "~/utils/api";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user, token } = await requireAuth(request);

  if (user.role === "EMPLOYE" && user.entreprise_id) {
    const url = new URL(request.url);
    const currentEntreprise = url.searchParams.get("entreprise");
    if (currentEntreprise !== user.entreprise_id) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/api/dashboard?entreprise=${user.entreprise_id}`,
        },
      });
    }
  }

  let entrepriseDashboard = null;
  if (user.role === "ENTREPRISE_AGENT" || user.role === "EMPLOYE") {
    try {
      entrepriseDashboard = await fetchEntrepriseDashboard(token);
    } catch (e) {
      entrepriseDashboard = null;
    }
  }
  return json({
    user,
    entrepriseDashboard,
  });
}

// Fonction pour raccourcir les noms longs pour la légende
const shortenLabel = (name: string) => {
  if (name.length <= 15) return name;
  return `${name.substring(0, 13)}...`;
};

// Fonction pour formater les labels du pie chart
const renderLabel = (entry: any) => {
  const percent = entry.percent * 100;
  if (percent < 5) return ''; // N'affiche pas les labels pour les petites parts
  return `${percent.toFixed(0)}%`;
};

export default function DashboardPage() {
  const { entrepriseDashboard } = useLoaderData<typeof loader>();

  // Données par défaut si non disponibles
  const dashboard = entrepriseDashboard || {
    nombre_tickets: 0,
    nombre_employes: 0,
    nombre_services: 0,
    nom_entreprise: "Entreprise",
    tickets_par_jour: [],
    repartition_services: [],
    temps_moyen_traitement: 0,
    nombre_tickets_annules: 0
  };

  // Formatage des données pour les graphiques
  const ticketTrendData = dashboard.tickets_par_jour.map((item: any) => ({
    name: new Date(item.jour).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' }),
    tickets: item.tickets,
    processed: item.traites,
  }));

  const serviceData = dashboard.repartition_services.map((item: any, index: number) => ({
    name: item.nom_service,
    value: item.total,
    color: item.couleur || `hsl(${index * 137.5 % 360}, 70%, 60%)`, // Couleur par défaut si manquante
    fullName: item.nom_service // Conserve le nom complet pour le tooltip
  }));

  // Vérifier si on a des données de services
  const hasServiceData = serviceData.length > 0 && serviceData.some(item => item.value > 0);

  // Calcul du pourcentage de tickets traités
  const traitementPercentage = dashboard.nombre_tickets > 0
    ? Math.round((dashboard.tickets_par_jour[dashboard.tickets_par_jour.length - 1]?.traites / dashboard.nombre_tickets) * 100)
    : 0;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">
            {dashboard.nom_entreprise} - Tableau de bord
          </h1>
          <p className="text-gray-600 mt-2">
            Vue d'ensemble de votre système de gestion de files
          </p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Exporter
          </button>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            Paramètres
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Tickets */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Tickets aujourd'hui
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboard.nombre_tickets}
              </p>
              <p className="text-sm text-gray-500">
                {dashboard.nombre_tickets_annules} annulés
              </p>
            </div>
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card Temps moyen */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Temps moyen
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboard.temps_moyen_traitement} min
              </p>
              <div className="flex items-center space-x-1">
                <div className={`w-2 h-2 rounded-full ${dashboard.temps_moyen_traitement > 0 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                <p className={`text-sm font-medium ${dashboard.temps_moyen_traitement > 0 ? 'text-green-600' : 'text-gray-500'}`}>
                  {dashboard.temps_moyen_traitement > 0 ? 'Données disponibles' : 'Aucune donnée'}
                </p>
              </div>
            </div>
            <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card Employés */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Employés actifs
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboard.nombre_employes}
              </p>
            </div>
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>

        {/* Card Services */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-1">
                Services disponibles
              </p>
              <p className="text-3xl font-bold text-gray-900 mb-2">
                {dashboard.nombre_services}
              </p>
              <p className="text-sm text-gray-500">
                {traitementPercentage}% traités aujourd'hui
              </p>
            </div>
            <div className="w-14 h-14 bg-purple-100 rounded-xl flex items-center justify-center">
              <svg className="w-7 h-7 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Évolution des tickets */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Évolution des tickets (7 derniers jours)
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                  name="Tickets créés"
                />
                <Line
                  type="monotone"
                  dataKey="processed"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                  name="Tickets traités"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par service */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">
            Répartition par service
          </h3>
          <div className="h-64">
            {hasServiceData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    innerRadius={40}
                    paddingAngle={2}
                    dataKey="value"
                    label={renderLabel}
                    labelLine={false}
                  >
                    {serviceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name, props) => [
                      `${value} tickets (${((props.percent || 0) * 100).toFixed(1)}%)`,
                      // eslint-disable-next-line react/prop-types
                      props.payload.fullName || name
                    ]}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }}>
                        {shortenLabel(value)}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p className="text-lg font-medium mb-2">Aucune donnée disponible</p>
                <p className="text-sm text-center">
                  Les données de répartition par service<br />
                  apparaîtront ici une fois que des tickets<br />
                  auront été créés pour vos services.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}