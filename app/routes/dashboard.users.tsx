import { ActionFunctionArgs, json, LoaderFunctionArgs, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { requireAuth, requireRole } from "~/services/auth.server";
import { deleteEmploye, fetchEmployes, toggleEmploye } from "~/utils/api";

export async function loader({ request }: LoaderFunctionArgs) {
  await requireRole(request, "ENTREPRISE_AGENT");
  const { token } = await requireAuth(request);
  const employes = await fetchEmployes(token);
  return json({ employes });
}


export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const { token } = await requireAuth(request);

  const intent = formData.get("intent");
  const employeId = formData.get("id") as string;

  if (intent === "delete") {
    await deleteEmploye(employeId, token);
    return redirect(request.url);
  }

  if (intent === "toggle") {
    const isActive = formData.get("is_active") === "true";
    await toggleEmploye(employeId, !isActive, token);
    return redirect(request.url);
  }

  return json({ error: "Invalid action" }, { status: 400 });
}

export default function UsersList() {
  const { employes } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Gestion des utilisateurs</h1>
        <Link
          to="/userForm"
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm"
        >
          Ajouter un employé
        </Link>
      </div>

      {employes.length === 0 ? (
        <div className="flex flex-col items-center justify-center bg-white p-10 rounded-lg shadow text-gray-700 text-center space-y-4">
          {/* Icône utilisateur */}
          <svg
            className="w-16 h-16 text-blue-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0"
            />
          </svg>
          <h2 className="text-lg font-semibold">Aucun employé créé</h2>
          <p className="text-sm text-gray-500">
            Vous n’avez encore ajouté aucun employé à votre entreprise.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nom</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Agence</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Services</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {employes.map((user: any) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.agence_name}</td>
                  {/* ✅ Services */}
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.services && user.services.length > 0 ? (
                      <ul className="space-y-0.5">
                        {user.services.map((service: any) => (
                          <li key={service.id} className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded text-xs inline-block mr-1">
                            {service.name}
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <span className="text-gray-400 italic text-xs">Aucun</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                    >
                      {user.is_active ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-2">
                    {/* Toggle actif/inactif */}
                    <Form method="post" className="inline">
                      <input type="hidden" name="id" value={user.id} />
                      <input type="hidden" name="is_active" value={user.is_active} />
                      <button
                        type="submit"
                        name="intent"
                        value="toggle"
                        className="text-yellow-600 hover:text-yellow-900"
                      >
                        {user.is_active ? "Désactiver" : "Activer"}
                      </button>
                    </Form>

                    {/* Supprimer */}
                    <Form method="post" className="inline" onSubmit={(e) => {
                      if (!confirm("Es-tu sûr de vouloir supprimer cet employé ?")) {
                        e.preventDefault();
                      }
                    }}>
                      <input type="hidden" name="id" value={user.id} />
                      <button
                        type="submit"
                        name="intent"
                        value="delete"
                        className="text-red-600 hover:text-red-900"
                      >
                        Supprimer
                      </button>
                    </Form>
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
