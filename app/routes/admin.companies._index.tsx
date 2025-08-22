import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useRevalidator } from "@remix-run/react";
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Building2, Calendar, CheckCircle, Clock, Eye, RefreshCw, Tag, XCircle } from "lucide-react";
import { useEffect, useState } from 'react';
import { Sidebar } from "~/components/SidebarAdmin";
import { requireAuth } from "~/services/auth.server";
import { fetchCompanies } from "~/utils/api";

interface Company {
  id: string;
  name: string;
  type: string;
  date: string;
  status: string;
  users?: number;
  ticketsPerDay?: number;
  originalStatus: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  await requireAuth(request, "ADMINISTRATEUR");
  const companies = await fetchCompanies();

  const allCompanies = companies.map((c: any) => ({
    id: c.id,
    name: c.name,
    type: c.categorie || "—",
    date: new Date(c.created_at).toLocaleDateString("fr-FR"),
    status: c.statutEntreprise === "EN_ATTENTE"
      ? "En attente"
      : c.statutEntreprise === "ACCEPTEE"
        ? "Actif"
        : "Rejeté",
    users: c.user_count || 0,
    ticketsPerDay: c.daily_tickets || 0,
    originalStatus: c.statutEntreprise
  }));

  return json({ companies: allCompanies });
}

export default function CompaniesPage() {
  const { companies } = useLoaderData<typeof loader>();
  const revalidator = useRevalidator();
  const [activeFilter, setActiveFilter] = useState("Tous");
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Initialiser AOS au montage du composant
  useEffect(() => {
    AOS.init({
      duration: 1000,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
    });
  }, []);

  // Filtres possibles
  const statusFilters = ["Tous", "En attente", "Actif", "Rejeté"];

  // Filtrer les entreprises en fonction du filtre actif
  const filteredCompanies = activeFilter === "Tous"
    ? companies
    : companies.filter((company: Company) => company.status === activeFilter);

  // Fonction de rafraîchissement
  const handleRefresh = async () => {
    setIsRefreshing(true);
    revalidator.revalidate();
    setTimeout(() => {
      setIsRefreshing(false);
      AOS.refresh();
    }, 1500);
  };

  const getFilterIcon = (filter: string) => {
    switch (filter) {
      case "En attente": return <Clock className="w-4 h-4" />;
      case "Actif": return <CheckCircle className="w-4 h-4" />;
      case "Rejeté": return <XCircle className="w-4 h-4" />;
      default: return <Building2 className="w-4 h-4" />;
    }
  };

  const getFilterCount = (filter: string) => {
    if (filter === "Tous") return companies.length;
    return companies.filter((company: Company) => company.status === filter).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <Sidebar />

      <div className="ml-64 p-8">
        {/* Header simple et élégant */}
        <div className="mb-8" data-aos="fade-down">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00296b] to-[#003f88] bg-clip-text text-transparent mb-2">
                Gestion des Entreprises
              </h1>
              <p className="text-lg text-gray-600">
                Gérez et supervisez toutes les entreprises de la plateforme
              </p>
            </div>

            {/* Bouton de rafraîchissement */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center space-x-2 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl px-4 py-3 shadow-lg hover:shadow-xl transform transition-all duration-300 ${isRefreshing ? 'opacity-70 cursor-not-allowed' : 'hover:scale-105'
                }`}
            >
              <RefreshCw className={`w-5 h-5 text-gray-600 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="text-gray-700 font-medium">
                {isRefreshing ? 'Actualisation...' : 'Actualiser'}
              </span>
            </button>
          </div>
        </div>

        {/* Filtres */}
        <div className="mb-8" data-aos="fade-right">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-xl border border-white/50 inline-flex space-x-1">
            {statusFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 flex items-center space-x-2 ${activeFilter === filter
                    ? 'bg-gradient-to-r from-[#00296b] to-[#003f88] text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
                  }`}
              >
                {getFilterIcon(filter)}
                <span>{filter}</span>
                <span className={`px-2 py-1 rounded-full text-xs font-bold ${activeFilter === filter
                    ? 'bg-[#fdc500] text-white'
                    : 'bg-gray-200 text-gray-600'
                  }`}>
                  {getFilterCount(filter)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tableau des entreprises */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden" data-aos="fade-up">
          <div className="bg-gradient-to-r from-[#00296b] to-[#003f88] px-8 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Building2 className="h-6 w-6 text-white" />
                <h3 className="text-xl font-bold text-white">
                  Liste des Entreprises ({filteredCompanies.length})
                </h3>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-gray-50 to-blue-50/50 border-b border-gray-200">
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>Entreprise</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>Type</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date de création</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-gray-100">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company: Company, index: number) => (
                    <tr
                      key={company.id}
                      className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300"
                      data-aos="fade-left"
                      data-aos-delay={index * 100}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#00296b] to-[#003f88] flex items-center justify-center mr-4 shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                            <Building2 className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-900 group-hover:text-[#00296b] transition-colors duration-300">
                              {company.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-gray-100 to-gray-200 text-gray-700 shadow-sm">
                          {company.type}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-gray-600 font-medium">
                        {company.date}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <StatusBadge status={company.status} />
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <Link
                          to={`/admin/companies/${company.id}`}
                          className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-[#00296b] to-[#003f88] text-white hover:from-[#003f88] hover:to-[#00509d] transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          Voir les détails
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center" data-aos="zoom-in">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center mb-6 shadow-lg">
                          <Building2 className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-600 mb-2">
                          Aucune entreprise {activeFilter !== "Tous" ? `avec le statut "${activeFilter}"` : ""}
                        </h3>
                        <p className="text-gray-500 max-w-md">
                          {activeFilter === "Tous"
                            ? "Aucune entreprise n'est encore enregistrée sur la plateforme"
                            : "Modifiez vos filtres pour voir plus de résultats"}
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variants: Record<string, { bg: string; text: string; iconComponent: React.ComponentType<{ className?: string }> }> = {
    'En attente': {
      bg: 'bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200',
      text: 'text-amber-800',
      iconComponent: Clock
    },
    'Actif': {
      bg: 'bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200',
      text: 'text-emerald-800',
      iconComponent: CheckCircle
    },
    'Rejeté': {
      bg: 'bg-gradient-to-r from-red-100 to-rose-100 border border-red-200',
      text: 'text-red-800',
      iconComponent: XCircle
    }
  };

  const variant = variants[status];
  const IconComponent = variant.iconComponent;

  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${variant.bg} ${variant.text}`}>
      <IconComponent className="w-3 h-3" />
      <span>{status}</span>
    </span>
  );
}