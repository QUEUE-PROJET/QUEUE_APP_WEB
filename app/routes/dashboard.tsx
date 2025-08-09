
import { Outlet, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/Layout";

import type { loader as dashboardLoader } from "./dashboard";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (!user) {
    // Redirige vers /login si pas connecté
    throw new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
      },
    });
  }

  // Récupère l'ID d'entreprise dans l'URL
  const url = new URL(request.url);
  let entrepriseId = url.searchParams.get("entreprise");

  // Si c'est un employé, on force l'entreprise de la session
  if (user.role === "EMPLOYE") {
    entrepriseId = user.entreprise_id;
    // Si l'URL ne correspond pas, on redirige
    if (url.searchParams.get("entreprise") !== user.entreprise_id) {
      return new Response(null, {
        status: 302,
        headers: {
          Location: `/dashboard?entreprise=${user.entreprise_id}`,
        },
      });
    }
  }

  // Tu peux ici charger les données de l'entreprise si besoin
  // const entrepriseData = await fetchEntrepriseData(entrepriseId);

  return json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase(),
      entreprise_id: user.entreprise_id,
    },
    entrepriseId,
    // entrepriseData,
  });
}

export default function DashboardLayout() {
  const { user, entrepriseId } = useLoaderData<typeof dashboardLoader>();

  return (
    <Layout user={user} entrepriseId={entrepriseId}>
      <Outlet />
    </Layout>
  );
}