import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Building2, Calendar, CheckCircle, Clock, Eye, Tag, XCircle } from "lucide-react";
import { useState } from 'react';
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
  const { user } = await requireAuth(request, "ADMINISTRATEUR");
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
  const [activeFilter, setActiveFilter] = useState("Tous");

  // Filtres possibles
  const statusFilters = ["Tous", "En attente", "Actif", "Rejeté"];

  // Filtrer les entreprises en fonction du filtre actif
  const filteredCompanies = activeFilter === "Tous"
    ? companies
    : companies.filter(company => company.status === activeFilter);

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
    return companies.filter(company => company.status === filter).length;
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-50 to-blue-50/30">
      <Sidebar />

      <div className="flex-1 p-8 overflow-y-auto">
        {/* Header avec gradient subtil */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                Gestion des entreprises
              </h1>
              <p className="text-slate-600 mt-2">
                Gérez et supervisez toutes les entreprises de la plateforme
              </p>
            </div>

            {/* Badge du nombre total */}
            <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl px-4 py-2 shadow-sm">
              <div className="flex items-center space-x-2">
                <Building2 className="w-5 h-5 text-blue-600" />
                <span className="text-slate-700 font-medium">{companies.length} entreprises</span>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres modernes */}
        <div className="mb-8">
          <div className="bg-white/80 backdrop-blur-sm border border-slate-200/60 rounded-2xl p-2 shadow-sm inline-flex space-x-1">
            {statusFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`group relative px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center space-x-2 ${activeFilter === filter
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/80'
                  }`}
              >
                {getFilterIcon(filter)}
                <span>{filter}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs ${activeFilter === filter
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-200/80 text-slate-600'
                  }`}>
                  {getFilterCount(filter)}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tableau avec design amélioré */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-slate-50 to-blue-50/50 border-b border-slate-200/60">
                  <th className="px-8 py-5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4" />
                      <span>Nom</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4" />
                      <span>Type</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4" />
                      <span>Date</span>
                    </div>
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-8 py-5 text-left text-xs font-semibold text-slate-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white/50 backdrop-blur-sm divide-y divide-slate-200/60">
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company, index) => (
                    <tr
                      key={company.id}
                      className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-indigo-50/50 transition-all duration-200 hover:shadow-sm"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <td className="px-8 py-6 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center mr-4 group-hover:scale-110 transition-transform duration-200">
                            <Building2 className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <div className="text-sm font-semibold text-slate-900">{company.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700">
                          {company.type}
                        </span>
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-600">
                        {company.date}
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap">
                        <StatusBadge status={company.status} />
                      </td>
                      <td className="px-8 py-6 whitespace-nowrap text-sm">
                        <Link
                          to={`/admin/companies/${company.id}`}
                          className="group/btn inline-flex items-center px-4 py-2.5 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 hover:scale-105"
                        >
                          <Eye className="w-4 h-4 mr-2 group-hover/btn:scale-110 transition-transform duration-200" />
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-8 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mb-6">
                          <Building2 className="w-8 h-8 text-slate-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-slate-900 mb-2">
                          Aucune entreprise {activeFilter !== "Tous" ? `avec le statut "${activeFilter}"` : ""}
                        </h3>
                        <p className="text-slate-600 max-w-md">
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
  const variants: Record<string, { bg: string; text: string; icon: any }> = {
    'En attente': {
      bg: 'bg-gradient-to-r from-amber-100 to-yellow-100 border border-amber-200',
      text: 'text-amber-800',
      icon: <Clock className="w-3 h-3" />
    },
    'Actif': {
      bg: 'bg-gradient-to-r from-emerald-100 to-green-100 border border-emerald-200',
      text: 'text-emerald-800',
      icon: <CheckCircle className="w-3 h-3" />
    },
    'Rejeté': {
      bg: 'bg-gradient-to-r from-red-100 to-rose-100 border border-red-200',
      text: 'text-red-800',
      icon: <XCircle className="w-3 h-3" />
    }
  };

  const variant = variants[status];

  return (
    <span className={`inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${variant.bg} ${variant.text}`}>
      {variant.icon}
      <span>{status}</span>
    </span>
  );
}