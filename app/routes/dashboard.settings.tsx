// app/routes/dashboard.settings.tsx
import type { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Form, useLoaderData, useNavigation } from "@remix-run/react";
import { useTheme } from "~/context/theme";
import { changePassword, requireAuth } from "~/services/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const { user } = await requireAuth(request);
  return json({ user });
}

export async function action({ request }: ActionFunctionArgs) {
  const { user } = await requireAuth(request);
  const formData = await request.formData();
  const intent = formData.get("intent");

  // Gestion du changement de mot de passe
  if (intent === "change-password") {
    const oldPassword = formData.get("oldPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    // Validation
    if (!oldPassword || !newPassword || !confirmPassword) {
      return json(
        { error: "Tous les champs sont obligatoires" },
        { status: 400 }
      );
    }

    if (newPassword !== confirmPassword) {
      return json(
        { error: "Les nouveaux mots de passe ne correspondent pas" },
        { status: 400 }
      );
    }

    if (newPassword.length < 8) {
      return json(
        { error: "Le mot de passe doit contenir au moins 8 caractères" },
        { status: 400 }
      );
    }

    try {
      await changePassword({
        email: user.email,
        old_password: oldPassword,
        new_password: newPassword,
      });

      return json({ success: "Mot de passe changé avec succès" });
    } catch (error: any) {
      return json(
        { error: error.message || "Erreur lors du changement de mot de passe" },
        { status: 400 }
      );
    }
  }

  return null;
}

export default function SettingsPage() {
  const { user } = useLoaderData<typeof loader>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold dark:text-white">Paramètres du compte</h1>

      {/* Section Informations du compte */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Informations du compte</h2>
        <div className="space-y-4">
          <div className="flex items-center">
            <span className="w-32 font-medium dark:text-gray-200">Email:</span>
            <span className="dark:text-gray-300">{user.email}</span>
          </div>
          <div className="flex items-center">
            <span className="w-32 font-medium dark:text-gray-200">Rôle:</span>
            <span className="capitalize dark:text-gray-300">{user.role.toLowerCase()}</span>
          </div>
        </div>
      </div>

      {/* Section Changement de mot de passe */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Changer le mot de passe</h2>
        <Form method="post" className="space-y-4">
          <input type="hidden" name="intent" value="change-password" />

          <div>
            <label htmlFor="oldPassword" className="block mb-2 font-medium dark:text-gray-200">
              Ancien mot de passe
            </label>
            <input
              type="password"
              id="oldPassword"
              name="oldPassword"
              required
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="newPassword" className="block mb-2 font-medium dark:text-gray-200">
              Nouveau mot de passe
            </label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block mb-2 font-medium dark:text-gray-200">
              Confirmer le nouveau mot de passe
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={8}
              className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-blue-300 transition-colors duration-200 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            {isSubmitting ? "En cours..." : "Changer le mot de passe"}
          </button>
        </Form>
      </div>

      {/* Section Préférences */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4 dark:text-white">Préférences</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium dark:text-gray-200">Mode sombre</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Activez le thème sombre pour un confort visuel
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={theme === "dark"}
                onChange={toggleTheme}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600 dark:peer-focus:ring-blue-800 dark:bg-gray-700"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}