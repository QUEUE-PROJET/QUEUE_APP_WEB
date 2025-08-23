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
    ComparaisonPeriode,
    EntreprisePerformance,
    FluxAffluenteHeure,
    FluxAffluenteJour,
    PerformanceEmploye,
    PerformanceService,
    RapportEntreprise
} from "~/types/rapports";
import { fetchRapportEntreprise, fetchUserProfile } from "~/utils/api";

interface LoaderData {
    rapport: RapportEntreprise | null;
    entrepriseId: string | null;
    error?: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
    const session = await getSession(request.headers.get("Cookie"));
    const token = session.get("access_token");
    const userRole = session.get("user_role");

    if (!token) {
        throw new Response("Non autorisé", { status: 401 });
    }

    if (userRole !== "ENTREPRISE_AGENT") {
        throw new Response("Accès refusé - Réservé aux agents d'entreprise", { status: 403 });
    }

    try {
        // Récupérer les informations de l'utilisateur pour obtenir son entreprise_id
        const userProfile = await fetchUserProfile(token);
        const entrepriseId = userProfile.entreprise_id;

        if (!entrepriseId) {
            return json<LoaderData>({
                rapport: null,
                entrepriseId: null,
                error: "Aucune entreprise associée à votre compte",
            });
        }

        // Dates par défaut (30 derniers jours)
        const dateFin = new Date().toISOString().split('T')[0];
        const dateDebut = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

        // Récupérer le rapport par défaut
        const rapport = await fetchRapportEntreprise(entrepriseId, dateDebut, dateFin, token);

        return json<LoaderData>({
            rapport,
            entrepriseId,
        });
    } catch (error) {
        console.error("Erreur lors du chargement du rapport:", error);
        return json<LoaderData>({
            rapport: null,
            entrepriseId: null,
            error: error instanceof Error ? error.message : "Erreur lors du chargement du rapport",
        });
    }
}

export default function EntrepriseRapports() {
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
            exportToPDF(rapport, `rapport_entreprise_${rapport.nom_entreprise}_${dateDebut}_${dateFin}.pdf`);
        }
    };

    const handleExportExcel = () => {
        if (rapport) {
            exportToExcel(rapport, `rapport_entreprise_${rapport.nom_entreprise}_${dateDebut}_${dateFin}.xlsx`);
        }
    };

    if (error) {
        return (
            <div className="p-6">
                <StatusMessage type="error" message={error} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <Sidebar />
            <div className="max-w-7xl mx-auto">
                {/* En-tête */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Rapport d&apos;Entreprise
                    </h1>
                    <p className="text-gray-600">
                        Analyse détaillée des performances de votre entreprise
                    </p>
                    {rapport && (
                        <p className="text-sm text-gray-500 mt-1">
                            {rapport.nom_entreprise}
                        </p>
                    )}
                </div>

                {/* Filtres de période */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Période d&apos;analyse
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
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
                            className="bg-[#00296b] hover:bg-[#003f88] text-white"
                        >
                            {isLoading ? (
                                <>
                                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                                    Chargement...
                                </>
                            ) : (
                                <>
                                    <ChartIcon className="mr-2 h-4 w-4" />
                                    Actualiser le rapport
                                </>
                            )}
                        </Button>
                    </div>
                </div>

                {rapport && (
                    <>
                        {/* Options d'export */}
                        <ExportOptions
                            onExportPDF={handleExportPDF}
                            onExportExcel={handleExportExcel}
                            onPrint={printReport}
                            loading={isLoading}
                        />

                        {/* Performance globale */}
                        <PerformanceGlobaleCard performance={rapport.performance_globale} />

                        {/* Comparaison avec la période précédente */}
                        {rapport.comparaison_periode && (
                            <ComparaisonPeriodeCard comparaison={rapport.comparaison_periode} />
                        )}

                        {/* Graphiques des flux d'affluence */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                            <FluxAffluenteHeuresChart data={rapport.flux_affluence_heures} />
                            <FluxAffluenteJoursChart data={rapport.flux_affluence_jours} />
                        </div>

                        {/* Performance par service */}
                        <PerformanceServicesTable services={rapport.performance_services} />

                        {/* Performance par employé */}
                        <PerformanceEmployesTable employes={rapport.performance_employes} />
                    </>
                )}
            </div>
        </div>
    );
}

// Composant pour la performance globale
function PerformanceGlobaleCard({ performance }: { performance: EntreprisePerformance }) {
    const stats = [
        {
            label: "Total Tickets",
            value: performance.total_tickets,
            icon: QueueIcon,
            color: "text-blue-600",
            bgColor: "bg-blue-50",
        },
        {
            label: "Tickets Traités",
            value: performance.tickets_traites,
            icon: CheckCircleIcon,
            color: "text-green-600",
            bgColor: "bg-green-50",
        },
        {
            label: "En Attente",
            value: performance.tickets_en_attente,
            icon: BuildingIcon,
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
        },
        {
            label: "Taux Résolution",
            value: `${performance.taux_resolution.toFixed(1)}%`,
            icon: TrendingUpIcon,
            color: "text-purple-600",
            bgColor: "bg-purple-50",
        },
        {
            label: "Temps Moyen",
            value: performance.temps_moyen_formate,
            icon: ChartIcon,
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
        },
        {
            label: "Employés",
            value: performance.nombre_employes,
            icon: UsersIcon,
            color: "text-pink-600",
            bgColor: "bg-pink-50",
        },
    ];

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Performance Globale
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, index) => (
                    <div key={index} className="flex items-center space-x-4">
                        <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                            <stat.icon className={`h-6 w-6 ${stat.color}`} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

// Composant pour la comparaison de période
function ComparaisonPeriodeCard({ comparaison }: { comparaison: ComparaisonPeriode }) {
    const evolutionClass = comparaison.evolution_pourcentage >= 0
        ? "text-green-600"
        : "text-red-600";

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-6">
                Comparaison avec la Période Précédente
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                    <p className="text-sm text-gray-600">Période Actuelle</p>
                    <p className="text-lg font-semibold text-gray-900">{comparaison.periode_actuelle}</p>
                    <p className="text-2xl font-bold text-blue-600">{comparaison.tickets_actuel} tickets</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Période Précédente</p>
                    <p className="text-lg font-semibold text-gray-900">{comparaison.periode_precedente}</p>
                    <p className="text-2xl font-bold text-gray-600">{comparaison.tickets_precedent} tickets</p>
                </div>
                <div className="text-center">
                    <p className="text-sm text-gray-600">Évolution</p>
                    <div className="flex items-center justify-center space-x-2">
                        <TrendingUpIcon className={`h-5 w-5 ${evolutionClass}`} />
                        <p className={`text-2xl font-bold ${evolutionClass}`}>
                            {comparaison.evolution_pourcentage >= 0 ? '+' : ''}{comparaison.evolution_pourcentage.toFixed(1)}%
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Composant pour le graphique des flux par heures
function FluxAffluenteHeuresChart({ data }: { data: FluxAffluenteHeure[] }) {
    const maxValue = data.length > 0 ? Math.max(...data.map(d => d.nombre_tickets)) : 1;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Flux d&apos;Affluence par Heure
            </h3>
            <div className="h-48 flex items-end justify-between space-x-1">
                {data.map((item) => {
                    const height = maxValue > 0 ? (item.nombre_tickets / maxValue) * 100 : 0;

                    return (
                        <div key={item.heure} className="flex flex-col items-center flex-1">
                            <div
                                className="bg-gradient-to-t from-[#00509d] to-[#003f88] rounded-t-sm w-full min-h-[10px] flex items-end justify-center"
                                style={{ height: `${Math.max(height, 5)}%` }}
                                title={`${item.heure}h: ${item.nombre_tickets} tickets`}
                            >
                                {item.nombre_tickets > 0 && (
                                    <span className="text-white text-xs font-medium pb-1">
                                        {item.nombre_tickets}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">
                                {item.heure}h
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Composant pour le graphique des flux par jours
function FluxAffluenteJoursChart({ data }: { data: FluxAffluenteJour[] }) {
    const maxValue = data.length > 0 ? Math.max(...data.map(d => d.nombre_tickets)) : 1;

    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Flux d&apos;Affluence par Jour
            </h3>
            <div className="h-48 flex items-end justify-between space-x-2">
                {data.map((item, index) => {
                    const height = maxValue > 0 ? (item.nombre_tickets / maxValue) * 100 : 0;

                    return (
                        <div key={index} className="flex flex-col items-center flex-1">
                            <div
                                className="bg-gradient-to-t from-[#fdc500] to-[#ffd500] rounded-t-md w-full min-h-[20px] flex items-end justify-center"
                                style={{ height: `${Math.max(height, 10)}%` }}
                            >
                                <span className="text-gray-800 text-xs font-medium pb-1">
                                    {item.nombre_tickets}
                                </span>
                            </div>
                            <p className="text-xs text-gray-600 mt-2 text-center">
                                {item.jour_semaine.substring(0, 3)}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

// Composant pour le tableau des performances par service
function PerformanceServicesTable({ services }: { services: PerformanceService[] }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance par Service
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Service
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Agence
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tickets
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Taux Résolution
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Temps Moyen
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {services.map((service) => (
                            <tr key={service.service_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">
                                        {service.nom_service}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {service.agence_nom}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-900">
                                        {service.total_tickets} total
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {service.tickets_traites} traités
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                            <div
                                                className="bg-green-600 h-2 rounded-full"
                                                style={{ width: `${Math.min(service.taux_resolution, 100)}%` }}
                                            />
                                        </div>
                                        <span className="text-sm text-gray-900">
                                            {service.taux_resolution.toFixed(1)}%
                                        </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {service.temps_moyen_formate}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

// Composant pour le tableau des performances par employé
function PerformanceEmployesTable({ employes }: { employes: PerformanceEmploye[] }) {
    return (
        <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Performance par Employé
            </h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Employé
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Agence
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Tickets Traités
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Temps Moyen
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Dernière Activité
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {employes.map((employe) => (
                            <tr key={employe.employe_id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-8 w-8">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-[#00296b] to-[#003f88] flex items-center justify-center">
                                                <span className="text-white text-sm font-medium">
                                                    {employe.nom_employe.charAt(0)}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="ml-3">
                                            <div className="text-sm font-medium text-gray-900">
                                                {employe.nom_employe}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                {employe.email}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {employe.agence_nom}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {employe.tickets_traites}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    {employe.temps_moyen_formate}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {employe.derniere_activite
                                        ? new Date(employe.derniere_activite).toLocaleDateString('fr-FR')
                                        : 'N/A'
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
