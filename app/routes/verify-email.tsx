import { json } from "@remix-run/node";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { useEffect, useState } from "react";
import { verifyEmail } from "~/utils/api"; // À implémenter dans votre api.ts

export const loader = async () => {
  return json({
    title: "Vérification d'email",
    description: "Entrez le code OTP envoyé à votre adresse email"
  });
};

export const action = async ({ request }) => {
  const formData = await request.formData();
  const otp = formData.get("otp");
  
  try {
    const response = await verifyEmail(otp);
    return json({ success: true, message: "Email vérifié avec succès!" });
  } catch (error) {
    return json({ 
      success: false, 
      error: error.message || "Code OTP invalide ou expiré" 
    });
  }
};

export default function VerifyEmail() {
  const { title, description } = useLoaderData<typeof loader>();
  const actionData = useActionData<typeof action>();
  const [otp, setOtp] = useState("");

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {actionData?.success ? (
            <div className="rounded-md bg-green-50 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-800">
                    {actionData.message}
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <a
                  href="/dashboard"
                  className="text-sm font-medium text-green-700 hover:text-green-600"
                >
                  Accéder au tableau de bord →
                </a>
              </div>
            </div>
          ) : (
            <Form className="space-y-6" method="post">
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700"
                >
                  Code OTP
                </label>
                <div className="mt-1">
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                </div>
              </div>

              {actionData?.error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-red-800">
                        {actionData.error}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Vérifier
                </button>
              </div>

              <div className="text-center text-sm text-gray-600">
                <p>
                  Vous n'avez pas reçu de code ?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      // Implémentez la fonction de renvoi d'OTP
                      alert("Un nouveau code a été envoyé !");
                    }}
                    className="font-medium text-blue-600 hover:text-blue-500"
                  >
                    Renvoyer le code
                  </button>
                </p>
              </div>
            </Form>
          )}
        </div>
      </div>
    </div>
  );
}