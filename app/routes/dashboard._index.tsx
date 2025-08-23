/* eslint-disable react/prop-types */
/* eslint-disable react/no-unescaped-entities */

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { useEffect } from "react";
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

  // Initialiser AOS
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: false,
      mirror: true,
    });
  }, []);

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
    color: item.couleur || ['#00296b', '#003f88', '#00509d', '#fdc500', '#ffd500'][index % 5],
    fullName: item.nom_service
  }));

  // Vérifier si on a des données de services
  const hasServiceData = serviceData.length > 0 && serviceData.some(item => item.value > 0);

  // Calcul du pourcentage de tickets traités
  const traitementPercentage = dashboard.nombre_tickets > 0
    ? Math.round((dashboard.tickets_par_jour[dashboard.tickets_par_jour.length - 1]?.traites / dashboard.nombre_tickets) * 100)
    : 0;

  return (
    <div className="space-y-8 p-6 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center" data-aos="fade-down">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00296b] to-[#003f88] bg-clip-text text-transparent">
            {dashboard.nom_entreprise} - Tableau de bord
          </h1>
          <p className="text-gray-600 mt-2" data-aos="fade-up" data-aos-delay="200">
            Vue d'ensemble de votre système de gestion de files
          </p>
        </div>
        <div className="flex space-x-3" data-aos="fade-left" data-aos-delay="100">
          <button className="px-6 py-3 bg-gradient-to-r from-[#00296b] to-[#003f88] text-white rounded-xl hover:from-[#003f88] hover:to-[#00509d] transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
            Exporter
          </button>

        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card Tickets */}
        <div
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00296b]/10 to-[#003f88]/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Tickets aujourd'hui
                </p>
                <p className="text-4xl font-bold text-[#00296b] mb-2">
                  {dashboard.nombre_tickets}
                </p>
                <p className="text-sm text-gray-500">
                  {dashboard.nombre_tickets_annules} annulés
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#00296b] to-[#003f88] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Card Temps moyen */}
        <div
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="200"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#fdc500]/20 to-[#ffd500]/10 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Temps moyen
                </p>
                <p className="text-4xl font-bold text-[#00296b] mb-2">
                  {dashboard.temps_moyen_formate || `${dashboard.temps_moyen_traitement} min`}
                </p>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${dashboard.temps_moyen_traitement > 0 ? 'bg-gradient-to-r from-[#00509d] to-[#003f88]' : 'bg-gray-300'} shadow-sm`}></div>
                  <p className={`text-sm font-medium ${dashboard.temps_moyen_traitement > 0 ? 'text-[#00509d]' : 'text-gray-500'}`}>
                    {dashboard.temps_moyen_traitement > 0 ? 'Données disponibles' : 'Aucune donnée'}
                  </p>
                </div>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#fdc500] to-[#ffd500] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-[#00296b]" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Card Employés */}
        <div
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="300"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#003f88]/10 to-[#00509d]/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Employés actifs
                </p>
                <p className="text-4xl font-bold text-[#00296b] mb-2">
                  {dashboard.nombre_employes}
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#003f88] to-[#00509d] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Card Services */}
        <div
          className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
          data-aos="fade-up"
          data-aos-delay="400"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#00509d]/10 to-[#003f88]/5 rounded-full -translate-y-16 translate-x-16"></div>
          <div className="relative">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-2">
                  Services disponibles
                </p>
                <p className="text-4xl font-bold text-[#00296b] mb-2">
                  {dashboard.nombre_services}
                </p>
                <p className="text-sm text-gray-500">
                  {traitementPercentage}% traités aujourd'hui
                </p>
              </div>
              <div className="w-16 h-16 bg-gradient-to-br from-[#00509d] to-[#003f88] rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Graphiques */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Évolution des tickets */}
        <div
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
          data-aos="fade-right"
          data-aos-delay="500"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#00296b] to-[#003f88] bg-clip-text text-transparent">
              Évolution des tickets (7 derniers jours)
            </h3>
            <div className="w-3 h-3 bg-gradient-to-r from-[#00296b] to-[#003f88] rounded-full shadow-lg"></div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ticketTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
                <YAxis stroke="#6b7280" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#00296b"
                  strokeWidth={4}
                  dot={{ fill: "#00296b", strokeWidth: 2, r: 6 }}
                  name="Tickets créés"
                />
                <Line
                  type="monotone"
                  dataKey="processed"
                  stroke="#fdc500"
                  strokeWidth={4}
                  dot={{ fill: "#fdc500", strokeWidth: 2, r: 6 }}
                  name="Tickets traités"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Répartition par service */}
        <div
          className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 hover:shadow-2xl transition-all duration-500"
          data-aos="fade-left"
          data-aos-delay="600"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-[#00296b] to-[#003f88] bg-clip-text text-transparent">
              Répartition par service
            </h3>
            <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full shadow-lg"></div>
          </div>
          <div className="h-72">
            {hasServiceData ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={serviceData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    innerRadius={45}
                    paddingAngle={3}
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
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "12px",
                      boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    height={50}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color, fontWeight: '500' }}>
                        {shortenLabel(value)}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div
                className="flex flex-col items-center justify-center h-full text-gray-500"
                data-aos="zoom-in"
                data-aos-delay="700"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-lg font-semibold mb-2 text-[#00296b]">Aucune donnée disponible</p>
                <p className="text-sm text-center leading-relaxed">
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