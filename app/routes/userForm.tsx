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
    <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 text-center">
        Paramètres
      </h1>

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-[#005DA0] py-6 px-8">
          <h2 className="text-2xl font-bold text-white">
            Ajouter un employé
          </h2>
        </div>

        {actionData?.error && (
          <div className="mx-8 mt-6 p-4 bg-red-50 rounded-lg border border-red-200">
            <p className="flex items-center text-red-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {actionData.error}
            </p>
          </div>
        )}

        <Form method="post" className="p-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Nom complet
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#005DA0] focus:border-[#005DA0] transition-all"
                placeholder="Jean Dupont"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#005DA0] focus:border-[#005DA0] transition-all"
                placeholder="jean.dupont@example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#005DA0] focus:border-[#005DA0] transition-all"
                placeholder="••••••••••"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="agence_id" className="block text-sm font-medium text-gray-700">
                Agence
              </label>
              <select
                id="agence_id"
                name="agence_id"
                required
                value={selectedAgenceId}
                onChange={(e) => setSelectedAgenceId(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#005DA0] focus:border-[#005DA0] transition-all"
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
            <div className="mt-8">
              <h3 className="text-md font-medium text-gray-700 mb-3">
                Services à affecter
              </h3>
              <div className="bg-gray-50 p-5 rounded-lg border border-gray-200">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {services.map((service: any) => (
                    <label key={service.id} className="flex items-center space-x-3 py-2 px-3 rounded-md hover:bg-gray-100 transition-colors">
                      <input
                        type="checkbox"
                        name="service_ids"
                        value={service.id}
                        className="h-5 w-5 rounded border-gray-300 text-[#005DA0] focus:ring-[#005DA0]"
                      />
                      <span className="text-gray-700">{service.name}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="mt-10 flex justify-center space-x-4">
            <a
              href="/dashboard/users"
              className="px-8 py-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Annuler
            </a>
            <button
              type="submit"
              className="px-8 py-3 bg-[#005DA0] hover:bg-[#004d87] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all"
            >
              Ajouter l&apos;employé
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}