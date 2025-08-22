import { json, LoaderFunctionArgs } from "@remix-run/node";
import { useLoaderData, useNavigation } from "@remix-run/react";
import { useState } from "react";
import { Button } from "~/components/Button";
import { ExportOptions, exportToExcel, exportToPDF, printReport } from "~/components/ExportOptions";
import { FormField } from "~/components/FormField";
import {
  BuildingIcon,
  ChartIcon,
  CheckCircleIcon,
  QueueIcon,
  TrendingUpIcon,
  UsersIcon
} from "~/components/Icons";
import { Sidebar } from "~/components/SidebarAdmin";
import { StatusMessage } from "~/components/StatusMessage";
import { getSession } from "~/services/session.server";
import {
  CroissanceParPeriode,
  EntreprisePerformance,
  RapportAdministrateur,
  RepartitionParCategorie,
  StatistiquesGlobales,
  StatistiquesParPays
} from "~/types/rapports";
import { fetchCompanies, fetchRapportAdministrateur } from "~/utils/api";

interface LoaderData {
  rapport: RapportAdministrateur | null;
  entreprises: Array<{ id: string; name: string }>;
  error?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("access_token");
  const userRole = session.get("user_role");

  if (!token) {
    throw new Response("Non autorisé", { status: 401 });
  }

  if (userRole !== "ADMINISTRATEUR") {
    throw new Response("Accès refusé", { status: 403 });
  }

  try {
    // Récupérer les entreprises pour le filtre
    const entreprises = await fetchCompanies();

    // Dates par défaut (30 derniers jours)
    const dateFin = new Date().toISOString().split('T')[0];
    const dateDebut = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    // Récupérer le rapport par défaut
    const rapport = await fetchRapportAdministrateur(dateDebut, dateFin, token);

    return json<LoaderData>({
      rapport,
      entreprises,
    });
  } catch (error) {
    console.error("Erreur lors du chargement du rapport:", error);
    return json<LoaderData>({
      rapport: null,
      entreprises: [],
      error: error instanceof Error ? error.message : "Erreur lors du chargement du rapport",
    });
  }
}

export default function AdminRapports() {
  const { rapport, error } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  // États pour les filtres
  const [dateDebut, setDateDebut] = useState(() => {
    const date = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    return date.toISOString().split('T')[0];
  });
  const [dateFin, setDateFin] = useState(() => {
    const date = new Date();
    return date.toISOString().split('T')[0];
  });

  // Fonction pour recharger le rapport avec de nouvelles dates
  const handleDateChange = async () => {
    try {
      console.log("Rechargement du rapport pour la période:", dateDebut, "à", dateFin);
    } catch (error) {
      console.error("Erreur lors du rechargement:", error);
    }
  };

  // Fonctions d'export
  const handleExportPDF = () => {
    if (rapport) {
      exportToPDF(rapport, `rapport_administrateur_${dateDebut}_${dateFin}.pdf`);
    }
  };

  const handleExportExcel = () => {
    if (rapport) {
      exportToExcel(rapport, `rapport_administrateur_${dateDebut}_${dateFin}.xlsx`);
    }
  };

  if (error) {
    return (
      <div className="flex min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        <Sidebar />
        <div className="flex-1 p-6">
          <StatusMessage type="error" message={error} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="max-w-5xl mx-auto">
              {/* En-tête avec animation */}
              <div className="relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00296b] via-[#003f88] to-[#00509d] rounded-3xl transform -skew-y-1 shadow-2xl"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00296b] to-[#003f88] bg-clip-text text-transparent mb-2">
                        Rapports Administrateur
                      </h1>
                      <p className="text-lg text-gray-600">Analyse complète des performances de la plateforme</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-2xl flex items-center justify-center shadow-lg animate-pulse">
                        <TrendingUpIcon className="h-6 w-6 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Filtres de période modernisés */}
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"></div>
                <div className="relative">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Période d&apos;analyse
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
                    <FormField
                      label="Date de début"
                      name="date_debut"
                      type="date"
                      value={dateDebut}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateDebut(e.target.value)}
                      required
                    />
                    <FormField
                      label="Date de fin"
                      name="date_fin"
                      type="date"
                      value={dateFin}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDateFin(e.target.value)}
                      required
                    />
                    <Button
                      onClick={handleDateChange}
                      disabled={isLoading}
                      className="bg-gradient-to-r from-[#00296b] to-[#003f88] hover:from-[#003f88] hover:to-[#00509d] text-white shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      {isLoading ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                          Chargement...
                        </>
                      ) : (
                        <>
                          <ChartIcon className="mr-2 h-4 w-4" />
                          Générer le rapport
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {rapport && (
                <>
                  {/* Options d'export modernisées */}
                  <div className="mb-8">
                    <ExportOptions
                      onExportPDF={handleExportPDF}
                      onExportExcel={handleExportExcel}
                      onPrint={printReport}
                      loading={isLoading}
                    />
                  </div>

                  {/* Contenu principal avec espacement moderne */}
                  <div className="space-y-8">
                    {/* Statistiques globales */}
                    <StatistiquesGlobalesCard statistiques={rapport.statistiques_globales} />

                    {/* Graphiques en grille */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      <CroissanceMensuelleChart data={rapport.croissance_mensuelle} />
                      <RepartitionCategoriesChart data={rapport.repartition_categories} />
                    </div>

                    {/* Tableaux */}
                    <div className="space-y-8">
                      <TopEntreprisesTable entreprises={rapport.top_entreprises} />
                      <StatistiquesParPaysTable pays={rapport.statistiques_par_pays} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Composant pour les statistiques globales
function StatistiquesGlobalesCard({ statistiques }: { statistiques: StatistiquesGlobales }) {
  const stats = [
    {
      label: "Total Entreprises",
      value: statistiques.total_entreprises,
      icon: BuildingIcon,
      gradient: "from-blue-500 to-blue-600",
      bgGradient: "from-blue-50 to-blue-100",
      iconColor: "text-blue-600",
    },
    {
      label: "Entreprises Actives",
      value: statistiques.entreprises_actives,
      icon: CheckCircleIcon,
      gradient: "from-emerald-500 to-green-600",
      bgGradient: "from-emerald-50 to-green-100",
      iconColor: "text-emerald-600",
    },
    {
      label: "En Attente",
      value: statistiques.entreprises_en_attente,
      icon: BuildingIcon,
      gradient: "from-amber-500 to-orange-600",
      bgGradient: "from-amber-50 to-orange-100",
      iconColor: "text-amber-600",
    },
    {
      label: "Total Utilisateurs",
      value: statistiques.total_utilisateurs,
      icon: UsersIcon,
      gradient: "from-purple-500 to-violet-600",
      bgGradient: "from-purple-50 to-violet-100",
      iconColor: "text-purple-600",
    },
    {
      label: "Total Tickets",
      value: statistiques.total_tickets,
      icon: QueueIcon,
      gradient: "from-indigo-500 to-blue-600",
      bgGradient: "from-indigo-50 to-blue-100",
      iconColor: "text-indigo-600",
    },
    {
      label: "Total Services",
      value: statistiques.total_services,
      icon: TrendingUpIcon,
      gradient: "from-rose-500 to-pink-600",
      bgGradient: "from-rose-50 to-pink-100",
      iconColor: "text-rose-600",
    },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-gray-50/50"></div>
      <div className="relative">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
          <h2 className="text-2xl font-bold text-gray-900">
            Statistiques Globales
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {stats.map((stat, index) => (
            <div 
              key={index} 
              className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100/50"
            >
              <div className="flex items-center space-x-4">
                <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgGradient} group-hover:scale-110 transition-transform duration-300`}>
                  <stat.icon className={`h-8 w-8 ${stat.iconColor}`} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-600 mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {stat.value.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour le graphique de croissance mensuelle
function CroissanceMensuelleChart({ data }: { data: CroissanceParPeriode[] }) {
  const maxValue = data.length > 0 ? Math.max(...data.map(d => d.nouveaux_tickets)) : 1;

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/30 to-indigo-50/30"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-3 h-3 bg-gradient-to-r from-[#00296b] to-[#003f88] rounded-full"></div>
            <h3 className="text-xl font-bold text-gray-900">
              Croissance Mensuelle
            </h3>
          </div>
          <div className="text-sm text-gray-500">Nouveaux tickets</div>
        </div>
        <div className="h-80 flex items-end justify-between space-x-3">
          {data.map((item, index) => {
            const height = maxValue > 0 ? (item.nouveaux_tickets / maxValue) * 100 : 0;
            
            return (
              <div key={index} className="group flex flex-col items-center flex-1 relative">
                <div className="relative w-full">
                  <div
                    className="bg-gradient-to-t from-[#00296b] via-[#003f88] to-[#00509d] rounded-t-xl w-full min-h-[30px] flex items-end justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-105 relative overflow-hidden"
                    style={{ height: `${Math.max(height, 15)}%` }}
                  >
                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-t from-transparent via-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <span className="text-white text-sm font-bold pb-2 relative z-10">
                      {item.nouveaux_tickets}
                    </span>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-xs font-medium text-gray-600 group-hover:text-gray-900 transition-colors duration-300">
                    {item.periode}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// Composant pour le graphique de répartition par catégories amélioré
function RepartitionCategoriesChart({ data }: { data: RepartitionParCategorie[] }) {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-emerald-500 to-green-600',
    'from-amber-500 to-orange-600',
    'from-purple-500 to-violet-600',
    'from-rose-500 to-pink-600',
    'from-cyan-500 to-teal-600',
  ];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-slate-50/30 to-gray-50/30"></div>
      <div className="relative">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
          <h3 className="text-xl font-bold text-gray-900">
            Répartition par Catégorie
          </h3>
        </div>
        <div className="space-y-4">
          {data.map((item, index) => (
            <div key={index} className="group relative">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-white to-gray-50/50 hover:from-gray-50 hover:to-white transition-all duration-300 border border-gray-100/50 hover:shadow-lg">
                <div className="flex items-center space-x-4">
                  <div
                    className={`w-4 h-4 rounded-full bg-gradient-to-r ${colors[index % colors.length]} shadow-md`}
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-gray-900 transition-colors duration-300">
                    {item.categorie}
                  </span>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors duration-300">
                    {item.nombre_entreprises} entreprises
                  </span>
                  <span className="text-lg font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    {item.pourcentage.toFixed(1)}%
                  </span>
                </div>
              </div>
              {/* Barre de progression */}
              <div className="mt-2 w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${colors[index % colors.length]} transition-all duration-1000 ease-out`}
                  style={{ width: `${item.pourcentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Composant pour le tableau des top entreprises modernisé
function TopEntreprisesTable({ entreprises }: { entreprises: EntreprisePerformance[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
      <div className="bg-gradient-to-r from-[#00296b] to-[#003f88] px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
          <h3 className="text-xl font-bold text-white">
            Top Entreprises par Performance
          </h3>
        </div>
      </div>
      
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Entreprise
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Catégorie
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Tickets
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Taux Résolution
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Temps Moyen
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Employés
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {entreprises.slice(0, 10).map((entreprise) => (
                <tr key={entreprise.entreprise_id} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00296b] to-[#003f88] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                          <span className="text-white text-lg font-bold">
                            {entreprise.nom_entreprise.charAt(0)}
                          </span>
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                          {entreprise.nom_entreprise}
                        </div>
                        <div className="text-sm text-gray-500">
                          {entreprise.nombre_agences} agence(s)
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800 border border-blue-200">
                      {entreprise.categorie}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-gray-900">
                      {entreprise.total_tickets} total
                    </div>
                    <div className="text-sm text-gray-500">
                      {entreprise.tickets_traites} traités
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-20 bg-gray-200 rounded-full h-3 mr-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-500 to-green-600 h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${Math.min(entreprise.taux_resolution, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-bold text-gray-900">
                        {entreprise.taux_resolution.toFixed(1)}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {entreprise.temps_moyen_formate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {entreprise.nombre_employes}
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

// Composant pour le tableau des statistiques par pays modernisé
function StatistiquesParPaysTable({ pays }: { pays: StatistiquesParPays[] }) {
  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-8 py-6">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
          <h3 className="text-xl font-bold text-white">
            Statistiques par Pays
          </h3>
        </div>
      </div>
      
      <div className="p-8">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Pays
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Entreprises
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Utilisateurs
                </th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                  Tickets
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {pays.map((stat, index) => (
                <tr key={index} className="group hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 transition-all duration-300">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full mr-3"></div>
                      <span className="text-sm font-bold text-gray-900 group-hover:text-emerald-900 transition-colors duration-300">
                        {stat.pays}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {stat.nombre_entreprises}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {stat.nombre_utilisateurs}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                    {stat.nombre_tickets}
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