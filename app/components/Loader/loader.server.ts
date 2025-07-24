import { json } from "@remix-run/node";
import type { LoaderFunctionArgs } from "@remix-run/node";
import { getSession } from "~/services/auth.server"; // Assurez-vous que le chemin est correct

interface User {
  name: string;
  email: string;
  role: string;
  initials: string;
}

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const userData = session.get("user");

  // Retourne un user par défaut si non connecté
  const defaultUser: User | null = null; 
  // Ou pour un guest user:
  // const defaultUser: User = {
  //   name: "Invité",
  //   email: "",
  //   role: "guest",
  //   initials: "GU"
  // };

  const user = userData ? {
    name: userData.name,
    email: userData.email,
    role: userData.role,
    initials: userData.name.split(' ').map(n => n[0]).join('').toUpperCase()
  } : defaultUser;

  return json({
    user // Garantit que user est toujours présent (même si null)
  });
}