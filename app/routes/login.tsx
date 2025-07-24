// import { Form, useActionData, useNavigate } from "@remix-run/react";
// import { json, redirect, type ActionFunction } from "@remix-run/node";
// import { loginUser } from "~/utils/api";

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();

//   const credentials = {
//     email: formData.get("email"),
//     password: formData.get("password"),
//   };

//   try {
//     const response = await loginUser(credentials);

//     if (response.access_token) {
//       // Stocker le token côté client : ici on le renvoie via headers ou cookies (à adapter)
//       return redirect("/entreprise"); // redirige vers la page entreprise après connexion
//     } else {
//       return json({ error: "Identifiants incorrects" });
//     }
//   } catch (error) {
//     return json({ error: "Erreur de connexion" });
//   }
// };

// export default function Login() {
//   const actionData = useActionData<typeof action>();
//   const navigate = useNavigate();

//   return (
//     <div className="min-h-screen bg-gray-100 flex items-center justify-center">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Connexion</h1>

//         {actionData?.error && (
//           <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{actionData.error}</p>
//         )}

//         <Form method="post" className="space-y-4">
//           <div>
//             <label className="block text-sm font-medium">Email</label>
//             <input
//               type="email"
//               name="email"
//               required
//               placeholder="Entrez votre email"
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium">Mot de passe</label>
//             <input
//               type="password"
//               name="password"
//               required
//               placeholder="Entrez votre mot de passe"
//               className="w-full border px-3 py-2 rounded"
//             />
//           </div>

//           <button
//             type="submit"
//             className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
//           >
//             Se connecter
//           </button>
//         </Form>

//         <p className="text-sm text-center mt-4">
//           Pas encore de compte ?{" "}
//           <a href="/register" className="text-blue-600 hover:underline">
//             Créer un compte
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// }

import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useActionData, useNavigation, useSearchParams } from "@remix-run/react";
import { login } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const credentials = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    rememberMe: formData.get("rememberMe") === "on",
  };

  console.log("Tentative de connexion avec:", credentials);

  const result = await login({ ...credentials, request });

  if (result.redirectTo) {
    return redirect(result.redirectTo, {
      headers: result.headers || new Headers(),
    });
  }

  if (result.success) {
    // Récupérer le rôle de l'utilisateur depuis la réponse
    // const session = await getSession(request.headers.get("Cookie"));
    // const user = session.get("user");
    // const userRole = user?.role;

    const userRole = result.userRole; 
    const redirectTo = userRole === "ENTREPRISE_AGENT" 
    ? "/dashboard" 
    : "/admin/dashboard";

    
    console.log(`Connexion réussie (rôle: ${userRole}), redirection vers ${redirectTo}`);
    return redirect(redirectTo, {
      headers: result.headers,
    });
  }

  console.log("Échec de connexion:", result.error);
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md relative">
        {/* Bouton retour accueil */}
        <a 
          href="/" 
          className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        >
          ← Retour à l'accueil
        </a>

        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Connexion</h2>
        </div>
        
        <Form className="mt-8 space-y-6" method="post">
          <input type="hidden" name="redirectTo" value={searchParams.get("redirectTo") ?? undefined} />
          
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                defaultValue={actionData?.email}
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="rememberMe"
                name="rememberMe"
                type="checkbox"
                defaultChecked={actionData?.rememberMe}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="rememberMe" className="ml-2 block text-sm text-gray-900">
                Se souvenir de moi
              </label>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Connexion en cours...
                </>
              ) : "Se connecter"}
            </button>
          </div>

          {actionData?.error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{actionData.error}</h3>
                </div>
              </div>
            </div>
          )}
        </Form>
      </div>
    </div>
  );
}