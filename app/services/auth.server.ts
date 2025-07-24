// app/services/auth.server.ts
import { redirect } from "@remix-run/node";
import { apiFetcher } from "~/utils/api";
import { commitSession, destroySession, getSession } from "./session.server";
type UserRole = 'ENTREPRISE_AGENT' | 'ADMINISTRATEUR';
type LoginCredentials = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export async function login({
  email,
  password,
  rememberMe,
  request,
}: {
  email: string;
  password: string;
  rememberMe: boolean;
  request: Request;
}) {
  try {
    const response = await apiFetcher("/api/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
        remember_me: rememberMe,
      }),
    });

    const session = await getSession(request.headers.get("Cookie"));
    
    // Stockage des infos utilisateur
    session.set("access_token", response.access_token);
    session.set("user", response.user);

    return {
      success: true,
      userRole: response.user.role,
      headers: {
        "Set-Cookie": await commitSession(session, {
          expires: rememberMe ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) : undefined,
        }),
      },
    };
  } catch (error: unknown) {
    const session = await getSession(request.headers.get("Cookie"));
    
    // Gestion des erreurs spécifiques
    if (error instanceof Error) {
      // Cas 1: Email non vérifié
      if (error.message.includes("email n'est pas encore vérifié")) {
        session.set("unverified_email", email);
        return {
          success: false,
          error: error.message,
          redirectTo: "/verify-email",
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        };
      }
      
      // Cas 2: Entreprise non validée
      if (error.message.includes("entreprise n'a pas encore été validée")) {
        session.set("pending_enterprise", true);
        return {
          success: false,
          error: error.message,
          redirectTo: "/waiting-approval",
          headers: {
            "Set-Cookie": await commitSession(session),
          },
        };
      }
      
      // Cas 3: Token expiré ou autre erreur
      return {
        success: false,
        error: error.message,
      };
    }

    // Erreur inconnue
    return {
      success: false,
      error: "Une erreur inconnue est survenue",
    };
  }
}

// app/services/auth.server.ts
export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  
  // On nettoie simplement la session côté Remix
  // Pas besoin d'appeler l'API puisque votre endpoint backend ne fait rien
  return {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  };
}

export async function requireAuth(
  request: Request,
  requiredRole?: UserRole

) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("access_token");
  const user = session.get("user");

  if (!token || !user) {
    // Redirection avec retour vers la page demandée
    const url = new URL(request.url);
    throw redirect(`/login?redirectTo=${encodeURIComponent(url.pathname)}`);
  }

  // Vérification du rôle si spécifié
  if (requiredRole && user.role !== requiredRole) {
    // Rediriger vers le dashboard approprié selon le rôle
    const redirectTo = user.role === 'ENTREPRISE_AGENT' 
      ? '/dashboard' 
      : '/admin/dashboard';
    
    throw redirect(redirectTo);
  }

  // Vérification optionnelle de la validité du token côté API
  try {
    // Vous pourriez faire une requête de vérification ici si nécessaire
    // await apiFetcher("/verify-token", { headers: { Authorization: `Bearer ${token}` } });
    
    return { token, user };
  } catch (error) {
    // Token invalide - on nettoie et redirige
    throw redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
  }
}

// Ajoutez cette nouvelle fonction pour vérifier le rôle
export async function requireRole(request: Request, requiredRole: UserRole) {
  return requireAuth(request, requiredRole);
}


export async function getAuthUser(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");
  return user as { role: UserRole } | undefined;
}

// Fonction pour vérifier l'email avec OTP
export async function verifyEmailWithOtp(
  request: Request,
  { email, otp }: { email: string; otp: string }
) {
  try {
    const response = await apiFetcher("/api/verify-email-otp", {
      method: "POST",
      body: JSON.stringify({ email, otp }),
    });

    // Mise à jour de la session si vérification réussie
    const session = await getSession(request.headers.get("Cookie"));
    const user = session.get("user");
    
    if (user && user.email === email) {
      user.email_verified = true;
      session.set("user", user);
      
      return {
        success: true,
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

// Fonction pour renvoyer l'OTP
export async function resendEmailOtp(request: Request, email: string) {
  try {
    await apiFetcher("/api/resend-email-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erreur inconnue",
    };
  }
}

export { getSession };

