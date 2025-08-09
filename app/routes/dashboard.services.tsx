import type { ActionFunctionArgs, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { requireAuth } from "~/services/auth.server";
import { createService, deleteService, fetchAgences, fetchServices, updateService } from "~/utils/api";

// Types
interface Service {
  id: string;
  name: string;
  description?: string;
  created_at: string;
  agence_id: string;
  agence?: {
    id: string;
    name: string;
  };
  agence_nom?: string;
}

interface Agence {
  id: string;
  name: string;
  adresse: string;
  created_at: string;
}

interface LoaderData {
  services: Service[];
  agences: Agence[];
  accessToken: string;
  error?: string;
}

// LOADER - Une seule déclaration
export const loader: LoaderFunction = async ({ request }) => {
  const { token } = await requireAuth(request);

  try {
    console.log("🔍 Chargement des services et agences...");

    // Récupérer les services et agences en parallèle
    const [servicesData, agencesData] = await Promise.all([
      fetchServices(token),
      fetchAgences(token)
    ]);

    console.log("📊 Services récupérés:", servicesData?.length || 0);
    console.log("🏢 Agences récupérées:", agencesData?.length || 0);

    // Log détaillé des services pour debug
    if (servicesData && servicesData.length > 0) {
      console.log("📋 Détail des services:", servicesData.map(s => ({
        id: s.id,
        name: s.name,
        agence_id: s.agence_id,
        entreprise_id: s.entreprise_id
      })));
    }

    // Enrichir les services avec les noms des agences
    const servicesWithAgenceNames = (servicesData || []).map((service: Service) => {
      let agence_nom = 'Agence inconnue';

      // Essayer d'abord avec la relation agence
      if (service.agence?.name) {
        agence_nom = service.agence.name;
      } else if (service.agence_id) {
        // Sinon chercher dans la liste des agences
        const agence = agencesData?.find((ag: Agence) => ag.id === service.agence_id);
        agence_nom = agence ? agence.name : 'Service d\'entreprise';
      } else {
        // Service lié directement à l'entreprise
        agence_nom = 'Service d\'entreprise';
      }

      return {
        ...service,
        agence_nom
      };
    });

    console.log("✅ Services enrichis:", servicesWithAgenceNames.length);

    return json({
      services: servicesWithAgenceNames,
      agences: agencesData || [],
      accessToken: token
    });
  } catch (error) {
    console.error("❌ Erreur lors du chargement des services:", error);

    // Retourner des tableaux vides plutôt qu'une erreur 500
    return json({
      services: [],
      agences: [],
      accessToken: token,
      error: `Erreur lors du chargement des données: ${error instanceof Error ? error.message : 'Erreur inconnue'}`
    });
  }
};

// ACTION - Une seule déclaration
export async function action({ request }: ActionFunctionArgs) {
  const { token } = await requireAuth(request);
  const formData = await request.formData();
  const actionType = formData.get("_action");

  try {
    switch (actionType) {
      case "delete": {
        const serviceId = formData.get("serviceId") as string;
        console.log("Suppression du service:", serviceId);
        await deleteService(serviceId, token);
        return json({ success: true, message: "Service supprimé avec succès" });
      }

      case "create": {
        const agenceId = formData.get("agenceId") as string;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        console.log("Création du service:", { agenceId, name, description });

        const serviceData = {
          name,
          description: description || undefined
        };

        await createService(agenceId, serviceData, token);
        return json({ success: true, message: "Service créé avec succès" });
      }

      case "update": {
        const serviceId = formData.get("serviceId") as string;
        const name = formData.get("name") as string;
        const description = formData.get("description") as string;

        console.log("Modification du service:", { serviceId, name, description });

        const serviceData = {
          name,
          description: description || undefined
        };

        await updateService(serviceId, serviceData, token);
        return json({ success: true, message: "Service modifié avec succès" });
      }

      default:
        throw new Error("Action non reconnue");
    }
  } catch (error: any) {
    console.error("Erreur action:", error);
    return json(
      { error: error.message || "Une erreur est survenue" },
      { status: 400 }
    );
  }
}

// Composant pour les messages avec auto-dismiss
function StatusMessage({
  message,
  type,
  onDismiss
}: {
  message: string;
  type: 'success' | 'error';
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss();
    }, 5000);

    return () => clearTimeout(timer);
  }, [onDismiss]);

  const bgColor = type === 'success' ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200';
  const textColor = type === 'success' ? 'text-green-800' : 'text-red-800';
  const iconColor = type === 'success' ? 'text-green-400' : 'text-red-400';

  return (
    <div className={`${bgColor} border rounded-md p-4`}>
      <div className="flex items-center justify-between">
        <div className="flex">
          <svg className={`w-5 h-5 ${iconColor}`} fill="currentColor" viewBox="0 0 20 20">
            {type === 'success' ? (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            ) : (
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            )}
          </svg>
          <p className={`ml-3 text-sm ${textColor}`}>{message}</p>
        </div>
        <button
          onClick={onDismiss}
          className={`ml-auto pl-3 ${textColor} hover:opacity-75`}
        >
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Modal de confirmation pour la suppression
function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  serviceName
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  serviceName: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">Confirmer la suppression</h3>
        <p className="text-gray-600 mb-6">
          Êtes-vous sûr de vouloir supprimer le service <strong>{serviceName}</strong> ?
          Cette action est irréversible.
        </p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Annuler
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal pour créer/modifier un service
function ServiceModal({
  isOpen,
  onClose,
  service = null,
  agences,
  onSubmit
}: {
  isOpen: boolean;
  onClose: () => void;
  service?: Service | null;
  agences: Agence[];
  onSubmit: (data: any) => void;
}) {
  const [formData, setFormData] = useState({
    name: service?.name || '',
    description: service?.description || '',
    agenceId: service?.agence_id || ''
  });

  // Reset form when service changes
  useEffect(() => {
    if (service) {
      setFormData({
        name: service.name || '',
        description: service.description || '',
        agenceId: service.agence_id || ''
      });
    } else {
      setFormData({
        name: '',
        description: '',
        agenceId: ''
      });
    }
  }, [service]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      serviceId: service?.id
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">
          {service ? 'Modifier le service' : 'Créer un service'}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nom du service *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ex: Service Client"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Description du service (optionnel)"
              rows={3}
            />
          </div>

          {!service && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Agence *
              </label>
              <select
                required
                value={formData.agenceId}
                onChange={(e) => setFormData(prev => ({ ...prev, agenceId: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner une agence</option>
                {agences.map(agence => (
                  <option key={agence.id} value={agence.id}>
                    {agence.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {service ? 'Modifier' : 'Créer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// COMPOSANT PRINCIPAL - Une seule déclaration export default
export default function ServicesList() {
  const { services, agences, accessToken, error } = useLoaderData<LoaderData>();
  const fetcher = useFetcher();
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; service: Service | null }>({
    isOpen: false,
    service: null
  });
  const [serviceModal, setServiceModal] = useState<{
    isOpen: boolean;
    service: Service | null
  }>({
    isOpen: false,
    service: null
  });

  // État pour gérer l'affichage des messages
  const [statusMessage, setStatusMessage] = useState<{
    message: string;
    type: 'success' | 'error';
  } | null>(null);

  // Effet pour afficher les messages de réponse
  useEffect(() => {
    if (fetcher.data?.error) {
      setStatusMessage({
        message: fetcher.data.error,
        type: 'error'
      });
    } else if (fetcher.data?.success) {
      setStatusMessage({
        message: fetcher.data.message,
        type: 'success'
      });
    }
  }, [fetcher.data]);

  // Afficher message d'erreur du loader
  useEffect(() => {
    if (error) {
      setStatusMessage({
        message: error,
        type: 'error'
      });
    }
  }, [error]);

  // Gestion de la suppression
  const handleDeleteService = (service: Service) => {
    setDeleteModal({ isOpen: true, service });
  };

  const confirmDelete = () => {
    if (deleteModal.service) {
      const formData = new FormData();
      formData.append("_action", "delete");
      formData.append("serviceId", deleteModal.service.id);
      fetcher.submit(formData, { method: "post" });
    }
    setDeleteModal({ isOpen: false, service: null });
  };

  // Gestion de la création/modification
  const handleCreateService = () => {
    if (agences.length === 0) {
      setStatusMessage({
        message: "Vous devez d'abord créer une agence avant de pouvoir créer un service",
        type: 'error'
      });
      return;
    }
    setServiceModal({ isOpen: true, service: null });
  };

  const handleEditService = (service: Service) => {
    setServiceModal({ isOpen: true, service });
  };

  const handleServiceSubmit = (data: any) => {
    const formData = new FormData();

    if (data.serviceId) {
      // Modification
      formData.append("_action", "update");
      formData.append("serviceId", data.serviceId);
    } else {
      // Création
      formData.append("_action", "create");
      formData.append("agenceId", data.agenceId);
    }

    formData.append("name", data.name);
    formData.append("description", data.description || "");

    fetcher.submit(formData, { method: "post" });
  };

  // Fonction pour obtenir le nom de l'agence
  const getAgenceName = (service: Service) => {
    return service.agence_nom || 'Service d\'entreprise';
  };

  return (
    <div className="space-y-8">
      {/* Modals */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={() => setDeleteModal({ isOpen: false, service: null })}
        onConfirm={confirmDelete}
        serviceName={deleteModal.service?.name || ''}
      />

      <ServiceModal
        isOpen={serviceModal.isOpen}
        onClose={() => setServiceModal({ isOpen: false, service: null })}
        service={serviceModal.service}
        agences={agences}
        onSubmit={handleServiceSubmit}
      />

      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Services</h1>
          <p className="text-gray-600 mt-2">
            Gérez les services disponibles dans vos agences
          </p>
        </div>
        <button
          onClick={handleCreateService}
          disabled={agences.length === 0}
          className={`px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2 ${agences.length === 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          Nouveau Service
        </button>
      </div>

      {/* Messages de statut avec auto-dismiss */}
      {statusMessage && (
        <StatusMessage
          message={statusMessage.message}
          type={statusMessage.type}
          onDismiss={() => setStatusMessage(null)}
        />
      )}

      {/* Avertissement si aucune agence */}
      {agences.length === 0 && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                Vous devez d'abord créer une agence avant de pouvoir ajouter des services.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Table des services */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Liste des Services ({services.length})</h3>
        </div>

        {services.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun service</h3>
            <p className="mt-1 text-sm text-gray-500">
              {agences.length === 0
                ? "Créez d'abord une agence pour pouvoir ajouter des services."
                : "Commencez par créer votre premier service."
              }
            </p>
            {agences.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={handleCreateService}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Nouveau Service
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom du Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Agence
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date de création
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {services.map((service) => (
                  <tr key={service.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{service.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {service.description || (
                          <span className="text-gray-400 italic">Aucune description</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{getAgenceName(service)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(service.created_at).toLocaleDateString('fr-FR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditService(service)}
                          className="text-blue-600 hover:text-blue-900 transition-colors"
                          title="Modifier"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteService(service)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                          title="Supprimer"
                          disabled={fetcher.state === "submitting"}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Loading state */}
      {fetcher.state === "submitting" && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2">
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Traitement en cours...</span>
        </div>
      )}
    </div>
  );
}