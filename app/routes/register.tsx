import { Form, useActionData, redirect } from "@remix-run/react";
import type { ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { registerUser } from "~/utils/api";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const data = {
    nom_complet: formData.get("nom_complet"),
    email: formData.get("email"),
    telephone: formData.get("telephone"),
    password: formData.get("password"),
  };

  try {
    const response = await registerUser(data);
    if (response?.id) {
      return redirect("/login");
    } else {
      return json({ error: "Erreur lors de l'inscription." });
    }
  } catch (error) {
    return json({ error: "Erreur serveur." });
  }
};

export default function Register() {
  const actionData = useActionData<typeof action>();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center text-blue-700">Créer un compte entreprise</h1>

        {actionData?.error && (
          <p className="bg-red-100 text-red-700 p-2 rounded mb-4">{actionData.error}</p>
        )}

        <Form method="post" className="space-y-4">
          <div>
            <label className="block font-medium text-sm">Nom complet</label>
            <input
              type="text"
              name="nom_complet"
              required
              placeholder="Entrez votre nom complet"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-sm">Email</label>
            <input
              type="email"
              name="email"
              required
              placeholder="Entrez votre email"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-sm">Téléphone</label>
            <input
              type="tel"
              name="telephone"
              required
              placeholder="Entrez votre numéro de téléphone"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <div>
            <label className="block font-medium text-sm">Mot de passe</label>
            <input
              type="password"
              name="password"
              required
              placeholder="Entrez votre mot de passe"
              className="w-full border rounded px-3 py-2"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-700"
          >
            S'inscrire
          </button>
        </Form>

        <p className="text-sm text-center mt-4">
          Déjà inscrit ?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Se connecter
          </a>
        </p>
      </div>
    </div>
  );
}
