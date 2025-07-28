import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { Eye } from "lucide-react";
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

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Gestion des entreprises</h1>
          
          {/* Filtres par statut */}
          <div className="flex space-x-2">
            {statusFilters.map(filter => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                  activeFilter === filter
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Tableau des entreprises */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
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
                    Date
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
                {filteredCompanies.length > 0 ? (
                  filteredCompanies.map((company) => (
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
                        <Link
                          to={`/admin/companies/${company.id}`}
                          className="inline-flex items-center px-3 py-1 rounded text-sm font-medium bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Voir
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <Eye className="w-12 h-12 text-gray-300 mb-4" />
                        <p className="text-lg font-medium">
                          Aucune entreprise {activeFilter !== "Tous" ? `avec le statut "${activeFilter}"` : ""}
                        </p>
                        <p className="text-sm">
                          {activeFilter === "Tous" 
                            ? "Aucune entreprise disponible" 
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
  const variants: Record<string, string> = {
    'En attente': 'bg-yellow-100 text-yellow-800',
    'Actif': 'bg-green-100 text-green-800',
    'Rejeté': 'bg-red-100 text-red-800'
  };

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${variants[status]}`}>
      {status}
    </span>
  );
}