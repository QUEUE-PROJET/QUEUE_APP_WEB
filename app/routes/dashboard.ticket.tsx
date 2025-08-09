/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ActionFunctionArgs, json, type LoaderFunctionArgs } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { requireAuth } from "~/services/auth.server";
import {
  cancelTicket,
  completeTicket,
  endQueue,
  fetchMyTickets,
  pauseQueue,
  resumeQueue,
  startTicketProcessing
} from "~/utils/api";

// Types
type Ticket = {
  id: string;
  code_ticket: string;
  service_nom: string;
  created_at: string;
  status: string;
  service_id: string;
  agence_id: string;
  position_initial: number;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const { token } = await requireAuth(request);
  const tickets = await fetchMyTickets(token);
  return json({
    accessToken: token,
    tickets
  });
}

export async function action({ request }: ActionFunctionArgs) {
  const { token } = await requireAuth(request);
  const formData = await request.formData();

  const actionType = formData.get("action_type")?.toString();
  const serviceId = formData.get("service_id")?.toString() as string;
  const agenceId = formData.get("agence_id")?.toString() as string;

  if (!serviceId || !agenceId) {
    return json({ error: "Service ID et Agence ID sont requis" }, { status: 400 });
  }

  try {
    let result;
    switch (actionType) {
      case "pause":
        result = await pauseQueue(serviceId, agenceId, token);
        break;
      case "resume":
        result = await resumeQueue(serviceId, agenceId, token);
        break;
      case "end":
        result = await endQueue(serviceId, agenceId, token);
        break;
      default:
        result = await startTicketProcessing(serviceId, agenceId, token);
    }
    return json({ success: true, result });
  } catch (error: any) {
    console.error("Erreur API:", error);
    return json(
      { error: error.message || "Erreur lors de l'opération" },
      { status: 500 }
    );
  }
}

function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
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
            Confirmer
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Tickets() {
  const fetcher = useFetcher();
  const actionFetcher = useFetcher();
  const loaderData = useLoaderData<typeof loader>();

  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [token, setToken] = useState("");
  const [serviceId, setServiceId] = useState("");
  const [agenceId, setAgenceId] = useState("");
  const [queueStatus, setQueueStatus] = useState<'not_started' | 'in_progress' | 'paused' | 'ended'>('not_started');
  const [cancelModal, setCancelModal] = useState({ isOpen: false, ticketId: "" });
  const [loadingButtons, setLoadingButtons] = useState({
    start: false,
    pause: false,
    resume: false,
    end: false,
    cancel: {} as Record<string, boolean>,
    complete: {} as Record<string, boolean>,
  });

  const filteredAndSortedTickets = [...tickets]
    .filter(ticket => ['EN_ATTENTE', 'EN_COURS', 'EN_PAUSE'].includes(ticket.status))
    .sort((a, b) => a.position_initial - b.position_initial);

  // Initialiser les données
  useEffect(() => {
    setTickets(loaderData.tickets);
    setToken(loaderData.accessToken || "");
    if (loaderData.tickets.length > 0) {
      setServiceId(loaderData.tickets[0].service_id);
      setAgenceId(loaderData.tickets[0].agence_id);
    }
  }, [loaderData]);

  // Déterminer l'état de la file
  useEffect(() => {
    const hasInProgress = tickets.some(t => t.status === 'EN_COURS');
    const hasPaused = tickets.some(t => t.status === 'EN_PAUSE');

    if (hasInProgress) setQueueStatus('in_progress');
    else if (hasPaused) setQueueStatus('paused');
    else setQueueStatus('not_started');
  }, [tickets]);


  // Gestion des actions
  const handleCancelTicket = async (ticketId: string) => {
    setLoadingButtons(prev => ({ ...prev, cancel: { ...prev.cancel, [ticketId]: true } }));
    try {
      await cancelTicket(ticketId, token);
      fetcher.load("/tickets/refresh");
    } catch (error) {
      console.error("Erreur lors de l'annulation:", error);
    } finally {
      setLoadingButtons(prev => ({ ...prev, cancel: { ...prev.cancel, [ticketId]: false } }));
      setCancelModal({ isOpen: false, ticketId: "" }); // Fermer le modal après l'action
    }
  };

  const handleCompleteTicket = async (ticketId: string) => {
    setLoadingButtons(prev => ({ ...prev, complete: { ...prev.complete, [ticketId]: true } }));
    try {
      await completeTicket(ticketId, token);
      fetcher.load("/tickets/refresh"); // Rafraîchir immédiatement après la complétion
    } catch (error) {
      console.error("Erreur lors de la terminaison:", error);
    } finally {
      setLoadingButtons(prev => ({ ...prev, complete: { ...prev.complete, [ticketId]: false } }));
    }
  };

  // Action immédiate pour la pause
  const handlePauseQueue = async () => {
    // Mettre à jour l'état local pour effet immédiat
    setQueueStatus('paused');
    setTickets(prevTickets => prevTickets.map(t =>
      t.status === 'EN_COURS' ? { ...t, status: 'EN_ATTENTE' } : t
    ));
    // Appel API en arrière-plan
    try {
      await pauseQueue(serviceId, agenceId, token);
      fetcher.load("/tickets/refresh");
    } catch (error) {
      console.error("Erreur lors de la pause:", error);
      // Optionnel: revenir à l'état précédent si erreur
    }
  };

  // Action immédiate pour la reprise
  const handleResumeQueue = async () => {
    // Mettre à jour l'état local pour effet immédiat
    setQueueStatus('in_progress');
    setTickets(prevTickets => {
      const sorted = [...prevTickets]
        .filter(t => t.status === 'EN_ATTENTE' || t.status === 'EN_PAUSE')
        .sort((a, b) => a.position_initial - b.position_initial);
      if (sorted.length === 0) return prevTickets;
      const firstId = sorted[0].id;
      return prevTickets.map(t =>
        t.id === firstId ? { ...t, status: 'EN_COURS' } : t.status === 'EN_COURS' ? { ...t, status: 'EN_ATTENTE' } : t
      );
    });
    // Appel API en arrière-plan
    try {
      await resumeQueue(serviceId, agenceId, token);
      fetcher.load("/tickets/refresh");
    } catch (error) {
      console.error("Erreur lors de la reprise:", error);
      // Optionnel: revenir à l'état précédent si erreur
    }
  };

  // Rafraîchissement automatique
  useEffect(() => {
    const interval = setInterval(() => {
      fetcher.load("/tickets/refresh");
    }, 5000);
    return () => clearInterval(interval);
  }, [fetcher]);

  // Mise à jour des tickets après rafraîchissement
  useEffect(() => {
    // fetcher.data peut être n'importe quoi, donc on vérifie que c'est un objet avec tickets
    if (fetcher.data && typeof fetcher.data === 'object' && 'tickets' in fetcher.data) {
      setTickets((fetcher.data as { tickets: Ticket[] }).tickets);
    }
  }, [fetcher.data]);

  return (
    <div className="space-y-8">
      <ConfirmationModal
        isOpen={cancelModal.isOpen}
        onClose={() => setCancelModal({ isOpen: false, ticketId: "" })}
        onConfirm={() => {
          setCancelModal({ isOpen: false, ticketId: "" });
          handleCancelTicket(cancelModal.ticketId);
        }}
        title="Confirmer l'annulation"
        message="Êtes-vous sûr de vouloir annuler ce ticket ? Cette action est irréversible."
      />

      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestion des files d&apos;attente
        </h1>

        <div className="flex gap-3">
          {queueStatus === 'in_progress' && (
            <>
              <button
                type="button"
                className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                disabled={!serviceId || !agenceId}
                onClick={handlePauseQueue}
              >
                Mettre en pause
              </button>
              <actionFetcher.Form method="post">
                <input type="hidden" name="action_type" value="end" />
                <input type="hidden" name="service_id" value={serviceId} />
                <input type="hidden" name="agence_id" value={agenceId} />
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                  disabled={actionFetcher.state === "submitting" && actionFetcher.formData?.get("action_type") === "end"}
                >
                  {actionFetcher.state === "submitting" && actionFetcher.formData?.get("action_type") === "end" ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Terminaison...
                    </>
                  ) : "Terminer la file"}
                </button>
              </actionFetcher.Form>
            </>
          )}

          {queueStatus === 'paused' && (
            <>
              <button
                type="button"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                disabled={!serviceId || !agenceId}
                onClick={handleResumeQueue}
              >
                Reprendre la file
              </button>
              <actionFetcher.Form method="post">
                <input type="hidden" name="action_type" value="end" />
                <input type="hidden" name="service_id" value={serviceId} />
                <input type="hidden" name="agence_id" value={agenceId} />
                <button
                  type="submit"
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                  disabled={actionFetcher.state === "submitting" && actionFetcher.formData?.get("action_type") === "end"}
                >
                  {actionFetcher.state === "submitting" && actionFetcher.formData?.get("action_type") === "end" ? (
                    <>
                      <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Terminaison...
                    </>
                  ) : "Terminer la file"}
                </button>
              </actionFetcher.Form>
            </>
          )}

          {queueStatus === 'not_started' && (
            <actionFetcher.Form method="post">
              <input type="hidden" name="service_id" value={serviceId} />
              <input type="hidden" name="agence_id" value={agenceId} />
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-medium text-sm flex items-center gap-2"
                disabled={actionFetcher.state === "submitting"}
              >
                {actionFetcher.state === "submitting" ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Démarrage...
                  </>
                ) : "Commencer la file"}
              </button>
            </actionFetcher.Form>
          )}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                N° Ticket
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Service
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Créé le
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Statut
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredAndSortedTickets.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-4 text-gray-500">
                  Aucun ticket en attente ou en cours.
                </td>
              </tr>
            ) : (
              filteredAndSortedTickets.map((ticket: Ticket) => (
                <tr
                  key={ticket.id}
                  className={
                    ticket.status === "EN_COURS" ? "bg-blue-50 font-medium" :
                      ticket.status === "EN_PAUSE" ? "bg-yellow-50 font-medium" : ""
                  }
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.code_ticket}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.service_nom}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap capitalize">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ticket.status === "EN_COURS"
                        ? "bg-blue-100 text-blue-800"
                        : ticket.status === "EN_PAUSE"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-gray-100 text-gray-800"
                        }`}
                    >
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {ticket.position_initial}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex gap-2">
                      {ticket.status === "EN_COURS" && (
                        <button
                          onClick={() => handleCompleteTicket(ticket.id)}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded flex items-center gap-1"
                          disabled={loadingButtons.complete[ticket.id]}
                        >
                          {loadingButtons.complete[ticket.id] ? (
                            <>
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Terminer</span>
                            </>
                          ) : "Terminer"}
                        </button>
                      )}

                      {(ticket.status === "EN_ATTENTE" || ticket.status === "EN_COURS" || ticket.status === "EN_PAUSE") && (
                        <button
                          onClick={() => setCancelModal({ isOpen: true, ticketId: ticket.id })}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded flex items-center gap-1"
                          disabled={loadingButtons.cancel[ticket.id]}
                        >
                          {loadingButtons.cancel[ticket.id] ? (
                            <>
                              <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              <span>Annulation</span>
                            </>
                          ) : "Annuler"}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}