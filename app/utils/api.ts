/* eslint-disable @typescript-eslint/no-explicit-any */

export const BASE_API_URL = "https://queue-app-42do.onrender.com";
//export const BASE_API_URL = "http://127.0.0.1:8000"; 
// function getCookie(name: string): string | null {
//   const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
//   if (match) return decodeURIComponent(match[2]);
//   return null;
// }
export async function apiFetcher(
  endpoint: string,
  options: RequestInit = {}
) {
  const isFormData = options.body instanceof FormData;

//   // ➕ Token JWT récupéré automatiquement (client seulement)
//  let token: string | null = null;
//   if (typeof window !== "undefined") {
//     token = getCookie("__session"); // ✔️ le nom exact de ton cookie ici
//   }


  const headers: HeadersInit = {
    ...(isFormData ? options.headers || {} : {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    }),
  };

  const fullUrl = `${BASE_API_URL}${endpoint}`;

  // console.log("[API FETCHER] ➜", {
  //   url: fullUrl,
  //   method: options.method || "GET",
  //   headers,
  //   body: isFormData ? "[FormData]" : options.body,
  // });


  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers,
      credentials: 'include' 
    });

    const contentType = res.headers.get("content-type");
    const responseBody =
      contentType?.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {
      console.error("[API FETCHER] ❌ ERREUR", res.status, responseBody);

      if (res.status === 403) {
        throw new Error("Vous n'avez pas les permissions nécessaires");
      }
       
      if (res.status === 204) {
      return null;
  }
      
      throw new Error(
        responseBody?.detail || responseBody?.message || "Une erreur inconnue s'est produite"
      );
    
     

      
    }

     

    // console.log("[API FETCHER] ✅ Réponse OK", responseBody);
    return responseBody;
  } catch (error) {
    if (error instanceof Error) {
      console.error("[API FETCHER] 🚨 Exception attrapée", error.message);
      throw error;
    } else {
      console.error("[API FETCHER] 🚨 Erreur inconnue attrapée", error);
      throw new Error("Une erreur inconnue est survenue.");
    }
  }
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  email_verified: boolean;
  created_at: string;
  must_change_password: boolean | null;
  entreprise_id: string | null;
  agence_id: string | null;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

// Lister les utilisateurs avec pagination
export async function listUsers(page: number = 1, limit: number = 5): Promise<UsersResponse | User[]> {
  const response = await apiFetcher(`/api/users/?page=${page}&limit=${limit}`);
  
  // Si la réponse est un tableau d'utilisateurs, on la retourne directement
  // Le loader se chargera de la formater correctement
  return response;
}

// Obtenir un utilisateur spécifique
export async function getUser(id: string): Promise<User> {
  return apiFetcher(`/api/users/${id}`);
}

// Créer un utilisateur
export async function createUser(userData: Partial<User>): Promise<User> {
  return apiFetcher('/api/users', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

// Mettre à jour un utilisateur
export async function updateUser(id: string, userData: Partial<User>): Promise<User> {
  return apiFetcher(`/api/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
}

// Supprimer un utilisateur
export async function deleteUser(id: string): Promise<void> {
  return apiFetcher(`/api/users/${id}`, {
    method: 'DELETE',
  });
}

// Options de rôle pour les selects
export const roleOptions = [
  { value: 'ADMINISTRATEUR', label: 'Administrateur' },
  { value: 'ENTREPRISE_AGENT', label: 'Agent Entreprise' },
  { value: 'EMPLOYE', label: 'Employé' },
  { value: 'CLIENT', label: 'Client' },
];


// export async function Listusers() {
//   return apiFetcher("/api/users");
// }

// Récupère les statistiques du dashboard d'une entreprise
export async function fetchEntrepriseDashboard(token: string) {
  return await apiFetcher("/api/dashboard/entreprise", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}



 export async function verifyEmailOtp(email: string, otp: string) {
  return apiFetcher("/api/verify-email-otp", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
    },
     body: JSON.stringify({ email, otp }),
   });
   
}

export async function resendEmailOtp(email: string) {
  return apiFetcher("/api/resend-email-otp", {
    method: "POST",
    body: JSON.stringify({email}),
    
  });
}

export async function getEnterpriseCategories() {
  const response = await fetch(`${BASE_API_URL}/api/entreprise/categories`);
  if (!response.ok) {
    throw new Error("Failed to fetch enterprise categories");
  }
  return response.json(); // on suppose que c'est un tableau de strings
}



// app/utils/api.ts


export async function registerEnterpriseAgentBase64(payload: any) {
  try {
    const response = await fetch(`${BASE_API_URL}/api/register/enterprise-agent-base64`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.detail || "Erreur lors de l'inscription.");
    }

    return await response.json();
  } catch (err: any) {
    throw new Error(err.message || "Erreur réseau.");
  }
}

// Dans api.ts
export async function fetchCompanies() {
  return apiFetcher("/api/entreprises");
}

export async function fetchCompanyDetails(companyId: string) {
  return apiFetcher(`/api/entreprises/${companyId}`);
}


export async function approveCompany(companyId: string, token: string) {  
    // console.log("Envoi de la requête d'approbation pour", companyId);
    const response = await apiFetcher(`/api/entreprises/${companyId}/approve`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      
    });

    // console.log("Réponse de l'API:", response);
    return response;
}

export async function rejectCompany(companyId: string , token: string) {
  
    const response = await apiFetcher(`/api/entreprises/${companyId}/reject`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      
    });
    return response;
  
}



export async function deleteCompany(companyId: string) {
  return apiFetcher(`/api/entreprises/${companyId}`, {
    method: "DELETE",
  });
}



export async function changePassword(payload: {
  email: string;
  old_password: string;
  new_password: string;
}) {
  return apiFetcher("/api/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
        "Content-Type": "application/json",
      },
  });
}


//  liste des employees d'une entreprise


export async function fetchEmployes(token: string) {
  return apiFetcher("/api/employes", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, // ajoute le token ici
    },
  });
}

// Liste des agences liées à l'entreprise de l'agent connecté
export async function fetchAgencesForAgent(token: string) {
  return apiFetcher("/api/agences-de-mon-entreprise", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`, 
    },

  });
}





export async function createEmploye(payload: {
  name: string;
  email: string;
  password: string;
  agence_id: string;
  service_ids: string[];
}, token: string) {
  return apiFetcher("/api/employes", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
}



// Supprimer un employé
export async function deleteEmploye(id: string , token: string) {
  return apiFetcher(`/api/employes/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`, 
    },
  });
}

// Activer ou désactiver un employé
export async function toggleEmploye(id: string, isActive: boolean, token: string) {
  return apiFetcher(`/api/employes/${id}/activer?is_active=${isActive}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`, 
      "Content-Type": "application/json",
    },
  });
}


// creattion d'une agence 
export async function createAgence(payload: any, token: string) {
  return apiFetcher("/api/agences", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}
// Récupérer les agences d'une entreprise
export async function fetchAgences(token: string) {
  return apiFetcher("/api/agences", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateAgence(agenceId: string, payload: any, token: string) {
  return apiFetcher(`/api/agences/${agenceId}`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export async function deleteAgence(agenceId: string, token: string) {
  return apiFetcher(`/api/agences/${agenceId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
}

export async function fetchAgenceDetails(agenceId: string, token: string) {
  return apiFetcher(`/api/agences/${agenceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

}

// Récupérer les services d'une agence
export async function fetchServicesByAgence(agenceId: string, token: string) {
  return apiFetcher(`/api/agences/${agenceId}/services`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// =================== SERVICES CRUD ===================

// Récupérer tous les services de l'entreprise (avec filtre optionnel par agence)
export async function fetchServices(token: string, agenceId?: string) {
  let endpoint = "/api/services";
  if (agenceId) {
    endpoint += `?agence_id=${agenceId}`;
  }
  
  return apiFetcher(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Récupérer un service par ID
export async function fetchServiceById(serviceId: string, token: string) {
  return apiFetcher(`/api/services/${serviceId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Créer un nouveau service
export async function createService(agenceId: string, serviceData: {
  name: string;
  description?: string;
}, token: string) {
  return apiFetcher(`/api/services?agence_id=${agenceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });
}

// Mettre à jour un service
export async function updateService(serviceId: string, serviceData: {
  name?: string;
  description?: string;
}, token: string) {
  return apiFetcher(`/api/services/${serviceId}`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(serviceData),
  });
}

// Supprimer un service
export async function deleteService(serviceId: string, token: string) {
  const response = await fetch(`${BASE_API_URL}/api/services/${serviceId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    credentials: 'include'
  });

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.detail || errorJson.message || "Erreur lors de la suppression";
    } catch {
      errorMessage = "Erreur lors de la suppression du service";
    }
    throw new Error(errorMessage);
  }

  // Pour les réponses 204 No Content, on retourne un objet de succès
  return { success: true, message: "Service supprimé avec succès" };
}

// =================== FIN SERVICES CRUD ===================


// Récupérer les tickets pour les services d'un employé
export async function fetchEmployeeTickets(token: string) {
  return apiFetcher("/api/tickets/employe/services", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Démarrer un ticket
export async function startTicketProcessing(
  serviceId: string,
  agenceId: string,
  token: string
) {
  return apiFetcher("/api/tickets/demarrer-file", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ service_id: serviceId, agence_id: agenceId }),
  });
}

// Terminer un ticket
export async function completeTicket(ticketId: string, token: string) {
  return apiFetcher("/api/tickets/terminer-ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ticket_id: ticketId }),
  });
}

// Mettre en pause un service
export async function pauseQueue(
  serviceId: string,
  agenceId: string,
  token: string
) {
  return apiFetcher(`/api/tickets/mettre-en-pause?service_id=${serviceId}&agence_id=${agenceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}
export async function resumeQueue(
  serviceId: string,
  agenceId: string,
  token: string
) {
  return apiFetcher(`/api/tickets/reprendre-file?service_id=${serviceId}&agence_id=${agenceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


// Terminer la file d'attente
export async function endQueue(
  serviceId: string,
  agenceId: string,
  token: string
) {
  return apiFetcher(`/api/tickets/terminer-file?service_id=${serviceId}&agence_id=${agenceId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// WebSocket pour les mises à jour en temps réel
export function setupTicketWebSocket(serviceId: string, onUpdate: (data: any) => void) {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss://' : 'ws://';
  const baseUrl = BASE_API_URL.replace(/^https?:\/\//, '');
  const socket = new WebSocket(`${wsProtocol}${baseUrl}/ws/tickets/${serviceId}`);

  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    if (data.event === 'tickets_update') {
      onUpdate(data.data);
    }
  };

  socket.onclose = () => {
    console.log('WebSocket disconnected, attempting to reconnect...');
    setTimeout(() => setupTicketWebSocket(serviceId, onUpdate), 5000);
  };

  return socket;
}



export async function fetchMyTickets(token: string) {
  return apiFetcher("/api/mes-tickets", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// fontion pour annuler un ticket
export async function cancelTicket(ticketId: string, token: string) {
  return apiFetcher("/api/tickets/annuler-ticket", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ ticket_id: ticketId }),
  });
}


// notifications

export async function fetchUserNotifications(token: string, isRead?: boolean) {
  let endpoint = "/api/notifications";
  if (isRead !== undefined) {
    endpoint += `?is_read=${isRead}`;
  }
  
  return apiFetcher(endpoint, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function markNotificationAsRead(notificationId: string, token: string) {
  return apiFetcher(`/api/notifications/${notificationId}/read`, {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


export async function markAllNotificationsAsRead(token: string) {
  return apiFetcher("/api/notifications/read-all", {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}


// Récupérer le profil utilisateur
export async function fetchUserProfile(token: string) {
  return apiFetcher("/api/users/me", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Mettre à jour le profil utilisateur
export async function updateProfile(
  payload: {
    name: string;
    email: string;
  },
  token: string
) {
  return apiFetcher("/api/users/profile", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
}

// =================== RAPPORTS API ===================

// Récupérer le rapport administrateur
export async function fetchRapportAdministrateur(
  dateDebut: string,
  dateFin: string,
  token: string
) {
  return apiFetcher(`/api/rapports/administrateur?date_debut=${dateDebut}&date_fin=${dateFin}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Récupérer le rapport d'une entreprise spécifique
export async function fetchRapportEntreprise(
  entrepriseId: string,
  dateDebut: string,
  dateFin: string,
  token: string
) {
  return apiFetcher(`/api/rapports/entreprise/${entrepriseId}?date_debut=${dateDebut}&date_fin=${dateFin}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

// Exporter le rapport d'une entreprise
export async function exportRapportEntreprise(
  entrepriseId: string,
  dateDebut: string,
  dateFin: string,
  formatExport: 'json' | 'csv' = 'json',
  token: string
) {
  return apiFetcher(`/api/rapports/entreprise/${entrepriseId}/export?date_debut=${dateDebut}&date_fin=${dateFin}&format_export=${formatExport}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}