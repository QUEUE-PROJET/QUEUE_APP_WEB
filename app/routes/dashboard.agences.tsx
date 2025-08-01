import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useFetcher, useLoaderData, useNavigation } from "@remix-run/react";
import { requireAuth } from "~/services/auth.server";
import { fetchAgences } from "~/utils/api";

export async function loader({ request }: LoaderFunctionArgs) {
  const { token } = await requireAuth(request);
  const agences = await fetchAgences(token);
  return json({ agences });
}

export default function AgencesList() {
  const { agences } = useLoaderData<typeof loader>();
  const fetcher = useFetcher();
  const navigation = useNavigation();

  return (
    <div className="space-y-8 p-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Liste des agences</h1>
        <Link
          to="/agences/new"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm"
        >
          Ajouter une agence
        </Link>
      </div>

      {agences.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          Aucune agence disponible pour le moment.
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Adresse</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {agences.map((agence: any) => (
                <tr key={agence.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {agence.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agence.adresse}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {agence.contact}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    <Link
                      to={`/agences/${agence.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Voir
                    </Link>
                    <Link
                      to={`/agences/${agence.id}/edit`}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs"
                    >
                      Modifier
                    </Link>
                    <fetcher.Form
                      method="post"
                      action="/dashboard/agences/delete"
                      onSubmit={(e) => {
                        if (!confirm("Es-tu sûr de vouloir supprimer cette agence ?")) {
                          e.preventDefault();
                        }
                      }}
                      className="inline"
                    >
                      <input type="hidden" name="agenceId" value={agence.id} />
                      <button
                        type="submit"
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                        disabled={fetcher.state === "submitting"}
                      >
                        {fetcher.state === "submitting" ? "Suppression..." : "Supprimer"}
                      </button>
                    </fetcher.Form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
