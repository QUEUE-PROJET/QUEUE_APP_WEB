import type { ActionFunctionArgs } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { requireAuth } from "~/services/auth.server";
import { createAgence } from "~/utils/api";

export async function action({ request }: ActionFunctionArgs) {
  const { token } = await requireAuth(request);
  const formData = await request.formData();
  
  // Construction de l'objet selon le schéma attendu
  const payload = {
    name: formData.get("name") as string,
    adresse: formData.get("adresse") as string,
    contact: formData.get("contact") as string,
    temps_attente_moyen: Number(formData.get("temps_attente_moyen")),
    services: JSON.parse(formData.get("services") as string)
  };

  try {
    await createAgence(payload, token);
    return redirect("/dashboard/agences");
  } catch (error) {
    return json({ 
      error: "Erreur lors de la création de l'agence",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
}

export default function NewAgence() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();
  const [services, setServices] = useState<Array<{name: string, description: string}>>([]);
  const [newService, setNewService] = useState({
    name: "",
    description: ""
  });

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
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Créer une nouvelle agence</h1>
      
      {actionData?.error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          <p className="font-medium">{actionData.error}</p>
          {actionData.details && (
            <p className="text-sm mt-1">{actionData.details}</p>
          )}
        </div>
      )}

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
              defaultValue="0"
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-yellow-400 focus:ring focus:ring-yellow-200"
            />
          </div>
        </div>

        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Services proposés</h3>
          
          {/* Liste des services ajoutés */}
          {services.length > 0 && (
            <div className="mb-4 space-y-3">
              {services.map((service, index) => (
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

          {/* Formulaire d'ajout de service */}
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
                  onChange={(e) => setNewService({...newService, name: e.target.value})}
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
                  onChange={(e) => setNewService({...newService, description: e.target.value})}
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

          {/* Champ caché pour envoyer les services */}
          <input
            type="hidden"
            name="services"
            value={JSON.stringify(services)}
          />
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => navigate("/dashboard/agences")}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
          >
            Annuler
          </button>
          <button
            type="submit"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded"
            disabled={services.length === 0}
          >
            Créer l'agence
          </button>
        </div>
      </Form>
    </div>
  );
}