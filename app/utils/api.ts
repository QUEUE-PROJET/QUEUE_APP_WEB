
export const BASE_API_URL = "https://queue-app-42do.onrender.com"; // change selon ton lien Render

export async function apiFetcher(
  endpoint: string,
  options: RequestInit = {}
) {
  const isFormData = options.body instanceof FormData;

  // ➕ Token JWT récupéré automatiquement (client seulement)
  let token: string | null = null;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("access_token"); // ou ton nom de clé exact
  }

  const headers: HeadersInit = {
    ...(isFormData ? options.headers || {} : {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const fullUrl = `${BASE_API_URL}${endpoint}`;

  console.log("[API FETCHER] ➜", {
    url: fullUrl,
    method: options.method || "GET",
    headers,
    body: isFormData ? "[FormData]" : options.body,
  });

  try {
    const res = await fetch(fullUrl, {
      ...options,
      headers,
    });

    const contentType = res.headers.get("content-type");
    const responseBody =
      contentType?.includes("application/json")
        ? await res.json()
        : await res.text();

    if (!res.ok) {
      console.error("[API FETCHER] ❌ ERREUR", res.status, responseBody);
      throw new Error(
        responseBody?.detail || "Une erreur inconnue s’est produite"
      );
    }

    console.log("[API FETCHER] ✅ Réponse OK", responseBody);
    return responseBody;
  } catch (error: unknown) {
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



// // export async function verifyEmailOtp(email: string, otp: string) {
// //   return apiFetcher("/api/verify-email-otp", {
// //     method: "POST",
// //     body: JSON.stringify({ email, otp }),
// //   });
// }

export async function resendEmailOtp(email: string) {
  return apiFetcher("/api/resend-email-otp", {
    method: "POST",
    body: JSON.stringify(email),
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
