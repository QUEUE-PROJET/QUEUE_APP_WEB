// app/routes/logout.tsx
import type { ActionFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { logout } from "~/services/auth.server";

export async function action({ request }: ActionFunctionArgs) {
  const { headers } = await logout(request);
  return redirect("/login", { headers });
}

// Pas besoin de composant par défaut pour une route d'action
export default function Logout() {
  return null;
}