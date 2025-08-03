import {
  json,
  redirect,
  type ActionFunctionArgs,
  type LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { requireAuth } from "~/services/auth.server";
import {
  createEmploye,
  fetchAgencesForAgent,
  fetchServicesByAgence,
} from "~/utils/api";

// ✅ Loader : agences seulement
export async function loader({ request }: LoaderFunctionArgs) {
  const { token } = await requireAuth(request);
  const agences = await fetchAgencesForAgent(token);
  return json({ agences, token });
}

// ✅ Action : ajoute service_ids[]
export async function action({ request }: ActionFunctionArgs) {
  const { token } = await requireAuth(request);
  const formData = await request.formData();
  const service_ids = formData.getAll("service_ids") as string[];

  const payload = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    agence_id: formData.get("agence_id") as string,
    service_ids,
  };

  try {
    await createEmploye(payload, token);
    return redirect("/dashboard/users");
  } catch (error: any) {
    return json({ error: error.message }, { status: 400 });
  }
}

export default function Users() {
  const { agences, token } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [selectedAgenceId, setSelectedAgenceId] = useState("");
  const [services, setServices] = useState<any[]>([]);

  // ✅ Charge les services quand agence sélectionnée
  useEffect(() => {
    if (!selectedAgenceId) return;

    fetchServicesByAgence(selectedAgenceId, token).then((data) => {
      setServices(data);
    });
  }, [selectedAgenceId]);

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-900">Paramètres</h1>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-blue-600 mb-6">
          Ajouter un employé
        </h2>

        {actionData?.error && (
          <div className="mb-4 text-sm text-red-600">❌ {actionData.error}</div>
        )}

        <Form method="post" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              />
            </div>

            <div>
              <label htmlFor="agence_id" className="block text-sm font-medium text-gray-700 mb-2">
                Agence
              </label>
              <select
                id="agence_id"
                name="agence_id"
                required
                value={selectedAgenceId}
                onChange={(e) => setSelectedAgenceId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
              >
                <option value="">Sélectionnez une agence</option>
                {agences.map((agence: any) => (
                  <option key={agence.id} value={agence.id}>
                    {agence.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {services.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Services à affecter
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {services.map((service: any) => (
                  <label key={service.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="service_ids"
                      value={service.id}
                      className="accent-blue-500"
                    />
                    {service.name}
                  </label>
                ))}
              </div>
            </div>
          )}

          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-6 py-2 rounded-md font-medium"
            >
              Ajouter l&apos;employé
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
