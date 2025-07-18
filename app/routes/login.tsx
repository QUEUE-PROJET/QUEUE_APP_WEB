import { Form, useActionData, useNavigate } from "@remix-run/react";
import { json, redirect, type ActionFunction } from "@remix-run/node";
import { loginUser } from "~/utils/api";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const credentials = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  try {
    const response = await loginUser(credentials);

    if (response.access_token) {
      // Stocker le token côté client : ici on le renvoie via headers ou cookies (à adapter)
      return redirect("/entreprise"); // redirige vers la page entreprise après connexion
    } else {
      return json({ error: "Identifiants incorrects" });
    }
  } catch (error) {
    return json({ error: "Erreur de connexion" });
  }
};

export default function Login() {
  const actionData = useActionData<typeof action>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Connexion</h1>

        {actionData?.error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{actionData.error}</p>
        )}

        <Form method="post" className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Entrez votre email"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Mot de passe</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Entrez votre mot de passe"
              className="w-full border px-3 py-2 rounded"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Se connecter
          </button>
        </Form>

        <p className="text-sm text-center mt-4">
          Pas encore de compte ?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Créer un compte
          </a>
        </p>
      </div>
    </div>
  );
}
