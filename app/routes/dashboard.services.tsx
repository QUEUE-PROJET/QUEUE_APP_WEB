import { Link, useLoaderData } from "@remix-run/react";

import type { LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal } from "react";

// Mock data - à remplacer par un appel API réel
const mockServices = [
  {
    id: "srv1",
    name: "Service Client",
    description: "Gestion des relations clients",
    created_at: "2025-07-10T09:45:53.202Z",
    agence_id: "ag1"
  },
  {
    id: "srv2",
    name: "Service Technique",
    description: "Support technique",
    created_at: "2025-07-10T10:30:00.000Z",
    agence_id: "ag1"
  },
];

export const loader: LoaderFunction = async () => {
  return json({ services: mockServices });
};

export default function ServicesList() {
  const { services } = useLoaderData<typeof loader>();

  return (
    
      <div className="space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Liste des Services</h1>
          <Link 
            to="/serviceForm"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm"
          >
            Créer un Service
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID Agence</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; description: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; created_at: string | number | Date; agence_id: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
                <tr key={service.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{service.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(service.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{service.agence_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    
  );
}
