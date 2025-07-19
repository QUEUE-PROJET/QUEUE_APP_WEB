// export const API_URL = "http://localhost:8000"; // à adapter

// export async function registerUser(data: any) {
//   const res = await fetch(`${API_URL}/users`, {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(data),
//   });
//   return res.json();
// }


// export async function loginUser(credentials: any) {
//   const res = await fetch("http://localhost:8000/login", {
//     method: "POST",
//     headers: { "Content-Type": "application/json" },
//     body: JSON.stringify(credentials),
//   });

//   return await res.json(); // doit contenir { access_token }
// }

// export async function createEntreprise(data: any, token: string) {
//   const res = await fetch("http://localhost:8000/entreprises", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   return await res.json();
// }

// export async function addService(data: any, token: string) {
//   const res = await fetch("http://localhost:8000/services", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`,
//     },
//     body: JSON.stringify(data),
//   });

//   return await res.json();
// }

// export async function getEntrepriseDetails(id: string, token: string) {
//   const res = await fetch(`http://localhost:8000/entreprises/${id}`, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });

//   return await res.json();
// }


// export async function getPendingEntreprises(token: string) {
//   const res = await fetch("http://localhost:8000/entreprises/pending", {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return await res.json();
// }

// export async function validateEntreprise(id: string, token: string) {
//   const res = await fetch(`http://localhost:8000/entreprises/${id}/valider`, {
//     method: "PATCH",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
//   return await res.json();
// }

// export async function createTicket(data: any) {
//   const res = await fetch("http://localhost:8000/tickets", {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(data),
//   });

//   return await res.json(); // ex : { numero: "DEP-001" }
// }




const BASE_API_URL = "https://queue-app-42do.onrender.com"; // change selon ton lien Render

export async function apiFetcher(
  endpoint: string,
  options: RequestInit = {}
) {
  const isFormData = options.body instanceof FormData;

  const headers: HeadersInit = isFormData
    ? (options.headers || {}) // Ne pas définir Content-Type pour FormData
    : {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      };

  const res = await fetch(`${BASE_API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const errorBody = await res.json().catch(() => null);
    throw new Error(errorBody?.detail || "Erreur inconnue");
  }

  return res.json();
}

