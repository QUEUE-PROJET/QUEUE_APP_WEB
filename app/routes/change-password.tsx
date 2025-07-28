import { ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { Form, useNavigation } from "@remix-run/react";
import { changePassword } from "~/services/auth.server";
import { commitSession, getSession } from "~/services/session.server";


export async function action({ request }: ActionFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (!user) {
    return redirect("/login");
  }

  const formData = await request.formData();
  const newPassword = formData.get("newPassword") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  // Validation renforcée
  if (!newPassword || !confirmPassword) {
    return json({ error: "Tous les champs sont requis" }, { status: 400 });
  }

  if (newPassword !== confirmPassword) {
    return json({ error: "Les mots de passe ne correspondent pas" }, { status: 400 });
  }

  if (newPassword.length < 8) {
    return json({ error: "Le mot de passe doit contenir au moins 8 caractères" }, { status: 400 });
  }

  try {
    await changePassword({
      email: user.email,
      old_password: "", // Ignoré pour le premier changement
      new_password: newPassword,
    });

    // Mettre à jour la session
    user.must_change_password = false;
    session.set("user", user);
    session.set("must_change_password", false);

    // Redirection basée sur le rôle
    const redirectTo = user.role === "ENTREPRISE_AGENT" ? "/dashboard" : "/admin";

    return redirect(redirectTo, {
      headers: {
        "Set-Cookie": await commitSession(session),
      },
    });
  } catch (error) {
    return json({
      error: error instanceof Error ? error.message : "Erreur lors du changement de mot de passe",
    }, { status: 500 });
  }
}

export default function ChangePassword() {
  // const actionData = useActionData<typeof action>();
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Changer votre mot de passe
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Vous devez changer votre mot de passe temporaire avant de continuer.
          </p>
        </div>
        
        <Form className="mt-8 space-y-6" method="post">
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                Nouveau mot de passe
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                className="mt-1 appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* {actionData?.error && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="flex">
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">{actionData.error.}</h3>
                </div>
              </div>
            </div>
          )} */}

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              {isSubmitting ? "En cours..." : "Changer le mot de passe"}
            </button>
          </div>
        </Form>
      </div>
    </div>
  );
}