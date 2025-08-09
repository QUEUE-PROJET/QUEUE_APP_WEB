import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { requireAuth } from "~/services/auth.server";
import { fetchAgenceDetails, updateAgence } from "~/utils/api";

export async function loader({ params, request }: LoaderFunctionArgs) {
  const { id } = params;
  const { token } = await requireAuth(request);
  if (!id) throw new Response("ID d'agence manquant", { status: 400 });
  const agence = await fetchAgenceDetails(id, token);
  return json({ agence });
}

export async function action({ params, request }: ActionFunctionArgs) {
  const { id } = params;
  const { token } = await requireAuth(request);
  const formData = await request.formData();

  if (!id) {
    return json({ error: "ID d'agence manquant" }, { status: 400 });
  }

  // Charger l'agence pour comparaison
  const agence = await fetchAgenceDetails(id, token);

  const updatedPayload: any = {};

  const name = formData.get("name") as string;
  const adresse = formData.get("adresse") as string;
  const contact = formData.get("contact") as string;
  const tempsAttenteStr = formData.get("temps_attente_moyen");
  const services = JSON.parse(formData.get("services") as string);

  if (name && name !== agence.name) updatedPayload.name = name;
  if (adresse && adresse !== agence.adresse) updatedPayload.adresse = adresse;
  if (contact && contact !== agence.contact) updatedPayload.contact = contact;

  const tempsAttente = tempsAttenteStr ? Number(tempsAttenteStr) : null;
  if (
    tempsAttente !== null &&
    !isNaN(tempsAttente) &&
    tempsAttente !== agence.temps_attente_moyen
  ) {
    updatedPayload.temps_attente_moyen = tempsAttente;
  }

  const stringify = (obj: any) => JSON.stringify(obj, Object.keys(obj).sort());
  const areServicesDifferent =
    services.length !== agence.services.length ||
    services.some((s: any, i: number) => stringify(s) !== stringify(agence.services[i]));

  if (areServicesDifferent) {
    updatedPayload.services = services;
  }

  if (Object.keys(updatedPayload).length === 0) {
    return json({ message: "Aucun champ modifié." });
  }

  try {
    await updateAgence(id, updatedPayload, token);
    return redirect(`/dashboard/agences/`);
  } catch (error) {
    console.error("[UPDATE AGENCE ERROR]", error);
    return json(
      {
        error: "Erreur lors de la mise à jour de l'agence",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

export default function EditAgence() {
  const { agence } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const [services, setServices] = useState(agence.services || []);
  const [newService, setNewService] = useState({ name: "", description: "" });

  const handleAddService = () => {
    if (newService.name.trim()) {
      setServices([...services, newService]);
      setNewService({ name: "", description: "" });
    }
  };

  const removeService = (index: number) => {
    setServices(services.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Modifier l'agence {agence.name}</h1>
          <p className="mt-2 text-sm text-gray-600">Mettez à jour les informations de votre agence</p>
        </div>

        <Form method="post" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Nom de l'agence *
              </label>
              <input
                type="text"
                id="name"
                name="name"
                defaultValue={agence.name}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-200"
              />
            </div>

            <div>
              <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
                Contact *
              </label>
              <input
                type="text"
                id="contact"
                name="contact"
                defaultValue={agence.contact}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-200"
              />
            </div>

            <div className="md:col-span-2">
              <label htmlFor="adresse" className="block text-sm font-medium text-gray-700 mb-1">
                Adresse complète *
              </label>
              <input
                type="text"
                id="adresse"
                name="adresse"
                defaultValue={agence.adresse}
                required
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-200"
              />
            </div>

            <div>
              <label htmlFor="temps_attente_moyen" className="block text-sm font-medium text-gray-700 mb-1">
                Temps d'attente moyen (minutes)
              </label>
              <input
                type="number"
                id="temps_attente_moyen"
                name="temps_attente_moyen"
                min="0"
                defaultValue={agence.temps_attente_moyen || 0}
                className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-200"
              />
            </div>
          </div>

          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Services proposés</h3>

            {services.length > 0 && (
              <div className="mb-4 space-y-3">
                {services.map((service: any, index: number) => (
                  <div key={index} className="flex items-center justify-between bg-gray-50 p-3 rounded">
                    <div>
                      <p className="font-medium">{service.name}</p>
                      {service.description && (
                        <p className="text-sm text-gray-600">{service.description}</p>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => removeService(index)}
                      className="text-red-600 hover:text-red-800 text-sm"
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                <div>
                  <label htmlFor="service-name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nom du service *
                  </label>
                  <input
                    type="text"
                    id="service-name"
                    value={newService.name}
                    onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-200"
                  />
                </div>
                <div className="md:col-span-2">
                  <label htmlFor="service-description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <input
                    type="text"
                    id="service-description"
                    value={newService.description}
                    onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                    className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-200"
                  />
                </div>
              </div>
              <button
                type="button"
                onClick={handleAddService}
                disabled={!newService.name.trim()}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-1 rounded text-sm disabled:opacity-50"
              >
                Ajouter ce service
              </button>
            </div>

            <input type="hidden" name="services" value={JSON.stringify(services)} />
          </div>

          <div className="flex justify-center space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate(`/dashboard/agences/`)}
              className="px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-500 hover:bg-yellow-600"
              disabled={services.length === 0}
            >
              Enregistrer les modifications
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}
