import { Layout } from "~/components/Layout";
import { Form, useNavigation } from "@remix-run/react";
import { redirect, json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  
  // Récupération des données du formulaire
  const ticketData = {
    service: formData.get("service"),
    waitTime: formData.get("waitTime"),
    status: formData.get("status"),
  };

  // Ici vous devriez valider les données et les enregistrer en base de données
  // Pour l'exemple, nous allons simplement afficher les données et rediriger
  console.log("Nouveau ticket créé:", ticketData);
  
  return redirect("/dashboard");
};

export default function NewTicketForm() {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Layout>
      <div className="bg-white rounded-lg shadow p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Créer un nouveau ticket</h2>
        
        <Form method="post" className="space-y-6">
          {/* Numéro de ticket (généré automatiquement) */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Numéro de ticket
            </label>
            <div className="mt-1 p-2 border border-gray-300 rounded-md bg-gray-50">
              <p className="text-gray-900">Généré automatiquement</p>
            </div>
          </div>

          {/* Service */}
          <div>
            <label htmlFor="service" className="block text-sm font-medium text-gray-700">
              Service *
            </label>
            <select
              id="service"
              name="service"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Sélectionnez un service</option>
              <option value="Service client">Service client</option>
              <option value="Comptabilité">Comptabilité</option>
              <option value="Service technique">Service technique</option>
              <option value="Ressources humaines">Ressources humaines</option>
            </select>
          </div>

          {/* Temps d'attente */}
          <div>
            <label htmlFor="waitTime" className="block text-sm font-medium text-gray-700">
              Temps d'attente estimé (minutes) *
            </label>
            <input
              type="number"
              id="waitTime"
              name="waitTime"
              min="1"
              max="120"
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>

          {/* Statut */}
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
              Statut *
            </label>
            <select
              id="status"
              name="status"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              required
            >
              <option value="">Sélectionnez un statut</option>
              <option value="waiting">En attente</option>
              <option value="in-progress">En cours</option>
              <option value="priority">Prioritaire</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => window.history.back()}
              className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-black ${isSubmitting ? 'bg-yellow-400' : 'bg-yellow-400 hover:bg-yellow-500'} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500`}
            >
              {isSubmitting ? 'Création en cours...' : 'Créer le ticket'}
            </button>
          </div>
        </Form>
      </div>
    </Layout>
  );
}