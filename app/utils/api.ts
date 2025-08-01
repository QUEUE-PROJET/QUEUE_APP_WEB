
export const BASE_API_URL = "https://queue-app-42do.onrender.com"; // change selon ton lien Render
function getCookie(name: string): string | null {
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
  if (match) return decodeURIComponent(match[2]);
  return null;
}
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
      
      throw new Error(
        responseBody?.detail || responseBody?.message || "Une erreur inconnue s’est produite"
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


export async function pingAPI() {
  return apiFetcher("/api/users");
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
  return response.json(); // on suppose que c’est un tableau de strings
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


// Créer un employé
export async function createEmploye(payload: {
  name: string;
  email: string;
  password: string;
  agence_id: string;
},
token : string
) {
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




