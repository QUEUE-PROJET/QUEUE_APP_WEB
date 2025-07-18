import { Layout } from "~/components/Layout";
import { Link, useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

// Simuler des données d'agences (à remplacer par un appel à votre API)
const mockAgences = [
  {
    id: "1",
    name: "Agence Principale",
    adresse: "123 Rue Principale, Lomé",
    contact: "+228 12 34 56 78",
    created_at: "2025-07-10T09:44:32.640Z",
    entreprise_id: "ent1",
    services: [
      {
        id: "srv1",
        name: "Service Client",
        description: "Service dédié aux clients",
        created_at: "2025-07-10T09:44:32.640Z",
        agence_id: "1"
      }
    ]
  },
  // Ajoutez d'autres agences si nécessaire
];

export const loader: LoaderFunction = async () => {
  // Ici vous feriez un appel à votre API pour récupérer les agences
  // const response = await fetch('http://votre-api/agences');
  // const agences = await response.json();
  
  return json({ agences: mockAgences });
};

export default function AgencesList() {
  const { agences } = useLoaderData<typeof loader>();

  return (
    <Layout>
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Liste des agences</h1>
          <Link 
            to="/agenceForm"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm"
          >
            Ajouter une agence
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agences.map((agence: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; adresse: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; contact: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; services: any[]; }) => (
                <tr key={agence.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{agence.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agence.adresse}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{agence.contact}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agence.services.map(service => service.name).join(', ')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <Link 
                      to={`/agences/${agence.id}/edit`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Modifier
                    </Link>
                    <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}