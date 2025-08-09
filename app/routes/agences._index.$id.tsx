import type { LoaderFunctionArgs, ActionFunctionArgs  } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/services/auth.server";
import { fetchAgenceDetails, deleteAgence  } from "~/utils/api";


export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params;
  const { token } = await requireAuth(request);

  if (!id) {
    throw new Response("ID d'agence manquant", { status: 400 });
  }

  const agence = await fetchAgenceDetails(id, token);
  return json({ agence });
}



export default function AgenceDetails() {
  const { agence } = useLoaderData<typeof loader>();

  // Fonction pour formater la durée en heures et minutes
  const formatTempsAttente = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}min` : `${mins}min`;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white rounded-lg shadow">
      {/* En-tête avec boutons d'action */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{agence.name}</h1>
          <div className="flex items-center mt-2 space-x-4">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
            <p className="text-sm text-gray-500">
              Créée le {new Date(agence.created_at).toLocaleDateString('fr-FR')}
            </p>
          </div>
        </div>
        <div className="flex space-x-3">
          <Link
            to="/dashboard/agences"
            className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
          >
            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Retour
          </Link>
          <Link
            to={`/agences/${agence.id}/edit`}
            className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm leading-4 font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            <svg className="-ml-0.5 mr-1.5 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </Link>
        </div>
      </div>

      {/* Section principale */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Colonne de gauche - Informations principales */}
        <div className="lg:col-span-2 space-y-6">
          {/* Carte d'informations */}
          <div className="bg-gray-50 rounded-lg p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Informations de l'agence</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                <p className="mt-1 text-sm text-gray-900">{agence.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Adresse</h3>
                <p className="mt-1 text-sm text-gray-900">{agence.adresse}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">Contact</h3>
                <p className="mt-1 text-sm text-gray-900">{agence.contact}</p>
              </div>
              <div>
               
              </div>
            </div>
          </div>

          {/* Carte des services */}
          <div className="bg-gray-50 rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Services proposés</h2>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {agence.services?.length || 0} services
              </span>
            </div>

            {agence.services?.length ? (
              <ul className="space-y-3">
                {agence.services.map((service: any, index: number) => (
                  <li key={index} className="bg-white p-4 rounded-md shadow-sm">
                    <div className="flex justify-between">
                      <h3 className="text-sm font-medium text-gray-900">{service.name}</h3>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                        Actif
                      </span>
                    </div>
                    {service.description && (
                      <p className="mt-1 text-sm text-gray-600">{service.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun service</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Cette agence n'a pas encore de services enregistrés.
                </p>
              </div>
            )}
          </div>
        </div>

        
      </div>
    </div>
  );
}