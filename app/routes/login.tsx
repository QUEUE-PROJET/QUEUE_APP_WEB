import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { useState } from "react";
import { login } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    rememberMe: formData.get("rememberMe") === "on",
  };

  const result = await login({ ...credentials, request });

  if (result.redirectTo) {
    return redirect(result.redirectTo, {
      headers: result.headers || new Headers(),
    });
  }

  if (result.success) {
    // Cas où le changement de mot de passe est requis
    if (result.mustChangePassword) {
      return redirect("/change-password", {
        headers: result.headers,
      });
    }

    // Cas normal
    const userRole = result.userRole;
    const redirectTo = userRole === "ENTREPRISE_AGENT"
      ? "/dashboard"
      : "/admin";

    return redirect(redirectTo, {
      headers: result.headers,
    });
  }

  return json({
    error: result.error,
    email: credentials.email,
    rememberMe: credentials.rememberMe
  }, {
    status: 401,
    headers: result.headers,
  });
}

export default function Login() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen" style={{ background: "linear-gradient(135deg, #f0f8ff 0%, #f8ffeb 50%, #e6f3ff 100%)" }}>
      {/* Header avec le logo */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-xl mr-3 shadow-sm flex items-center justify-center" style={{ backgroundColor: "#005DA0" }}>
                <span className="text-white font-bold text-lg">Q</span>
              </div>
              <span className="text-2xl font-bold" style={{ color: "#005DA0" }}>Q-App</span>
            </div>

            {/* Bouton retour à l'accueil */}
            <a
              href="/"
              className="flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-105"
              style={{ color: "#005DA0", backgroundColor: "#f8fbff" }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                <path d="M19 12H5M5 12L12 19M5 12L12 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Retour à l'accueil
            </a>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Carte de connexion */}
          <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
            {/* En-tête de la carte */}
            <div className="px-8 py-10 text-center" style={{ background: "linear-gradient(135deg, #005DA0 0%, #3395E8 100%)" }}>
              <div className="w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg" style={{ backgroundColor: "#E8FF18" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 8H20C21.1046 8 22 8.89543 22 10V20C22 21.1046 21.1046 22 20 22H4C2.89543 22 2 21.1046 2 20V10C2 8.89543 2.89543 8 4 8H6V7C6 4.23858 8.23858 2 11 2H13C15.7614 2 18 4.23858 18 7V8ZM16 8V7C16 5.34315 14.6569 4 13 4H11C9.34315 4 8 5.34315 8 7V8H16ZM12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z" fill="#005DA0" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">
                Bon retour !
              </h1>
              <p className="text-blue-100">
                Connectez-vous à votre espace Q-App
              </p>
            </div>

            {/* Formulaire */}
            <div className="p-8">
              <Form className="space-y-6" method="post">
                <input type="hidden" name="redirectTo" value={searchParams.get("redirectTo") ?? undefined} />

                {/* Champ Email */}
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                    Adresse email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                        <path d="M3 8L10.89 13.26C11.2187 13.4793 11.6049 13.5963 12 13.5963C12.3951 13.5963 12.7813 13.4793 13.11 13.26L21 8M5 19H19C20.1046 19 21 18.1046 21 17V7C21 5.89543 20.1046 5 19 5H5C3.89543 5 3 5.89543 3 7V17C3 18.1046 3.89543 19 5 19Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      defaultValue={actionData?.email}
                      placeholder="votre@email.com"
                      className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                    />
                  </div>
                </div>

                {/* Champ Mot de passe */}
                <div className="space-y-2">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-gray-400">
                        <path d="M16 12V8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8V12M12 16V18M8 12H16C17.1046 12 18 12.8954 18 14V20C18 21.1046 17.1046 22 16 22H8C6.89543 22 6 21.1046 6 20V14C6 12.8954 6.89543 12 8 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      required
                      placeholder="Votre mot de passe"
                      className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors duration-300 bg-gray-50 focus:bg-white"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-300"
                    >
                      {showPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M9.88 9.88C9.33065 10.4294 9.01118 11.1768 9.01118 11.955C9.01118 12.7332 9.33065 13.4806 9.88 14.03C10.4294 14.5794 11.1768 14.8988 11.955 14.8988C12.7332 14.8988 13.4806 14.5794 14.03 14.03M9.88 9.88L14.03 14.03M9.88 9.88C10.4294 9.33065 11.1768 9.01118 11.955 9.01118C12.7332 9.01118 13.4806 9.33065 14.03 9.88M14.03 14.03C13.4806 14.5794 12.7332 14.8988 11.955 14.8988C11.1768 14.8988 10.4294 14.5794 9.88 14.03M14.03 14.03L9.88 9.88M3 3L21 21M12 6.5C7 6.5 3 12 3 12S7 17.5 12 17.5C17 17.5 21 12 21 12S17 6.5 12 6.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M2 12S6.5 4 12 4S22 12 22 12S17.5 20 12 20S2 12 2 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                {/* Se souvenir de moi */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="rememberMe"
                      name="rememberMe"
                      type="checkbox"
                      defaultChecked={actionData?.rememberMe}
                      className="w-4 h-4 rounded border-2 border-gray-300 text-blue-600 focus:ring-blue-500 focus:ring-2"
                    />
                    <label htmlFor="rememberMe" className="ml-3 block text-sm text-gray-700 font-medium">
                      Se souvenir de moi
                    </label>
                  </div>

                  <a href="/forgot-password" className="text-sm font-medium hover:underline transition-all duration-300" style={{ color: "#005DA0" }}>
                    Mot de passe oublié ?
                  </a>
                </div>

                {/* Message d'erreur */}
                {actionData?.error && (
                  <div className="p-4 rounded-xl border-2 border-red-200 bg-red-50">
                    <div className="flex items-center">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-red-600 mr-3">
                        <path d="M12 8V12M12 16H12.01M22 12C22 17.5228 17.5228 22 12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <p className="text-sm font-medium text-red-800">{actionData.error}</p>
                    </div>
                  </div>
                )}

                {/* Bouton de connexion */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 px-6 rounded-xl text-lg font-semibold transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl flex items-center justify-center"
                  style={{
                    backgroundColor: isSubmitting ? "#9ca3af" : "#005DA0",
                    color: "white"
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Connexion en cours...
                    </>
                  ) : (
                    <>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <path d="M15 3H19C20.1046 3 21 3.89543 21 5V19C21 20.1046 20.1046 21 19 21H15M10 17L15 12M15 12L10 7M15 12H3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      Se connecter
                    </>
                  )}
                </button>
              </Form>

              {/* Liens utiles */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-4">
                    Pas encore de compte ?
                  </p>
                  <a
                    href="/forms"
                    className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-md hover:shadow-lg"
                    style={{ backgroundColor: "#E8FF18", color: "#005DA0" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                      <path d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21M12.5 7C12.5 9.20914 10.7091 11 8.5 11C6.29086 11 4.5 9.20914 4.5 7C4.5 4.79086 6.29086 3 8.5 3C10.7091 3 12.5 4.79086 12.5 7ZM20 8V14M23 11H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Créer un compte entreprise
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Informations supplémentaires */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <a href="/support" className="hover:underline transition-all duration-300" style={{ color: "#005DA0" }}>
                Aide & Support
              </a>
              <span className="text-gray-400">•</span>
              <a href="/privacy" className="hover:underline transition-all duration-300" style={{ color: "#005DA0" }}>
                Confidentialité
              </a>
              <span className="text-gray-400">•</span>
              <a href="/terms" className="hover:underline transition-all duration-300" style={{ color: "#005DA0" }}>
                Conditions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}