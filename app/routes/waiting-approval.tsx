import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";

export const loader = async () => {
  return json({
    title: "En attente de validation",
    message: "Votre inscription a bien été prise en compte. Un administrateur va examiner votre demande sous 24-48 heures. Vous recevrez un email une fois votre compte validé."
  });
};

export default function WaitingApproval() {
  const { title, message } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {title}
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
              <svg
                className="h-6 w-6 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="mt-4 text-lg font-medium text-gray-900">{message}</p>
            <div className="mt-6">
              <a
                href="/logout"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Se déconnecter
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}