

import type { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLoaderData,
} from "@remix-run/react";
import { ThemeProvider } from "./context/theme";
import "./tailwind.css";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/votre-feuille-de-style.css" },
];

export async function loader({ request }: LoaderFunctionArgs) {
  // Ici votre logique d'authentification
  const user = { name: "Admin", role: "admin" }; // Exemple
  return json({ user });
}

export default function App() {
  const { user } = useLoaderData<typeof loader>();

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>

        <ThemeProvider>
          <Outlet />
        </ThemeProvider>

        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}