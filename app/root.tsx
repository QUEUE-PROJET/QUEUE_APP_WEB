// import type { LinksFunction } from "@remix-run/node";
// import {
//   Links,
//   Meta,
//   Outlet,
//   Scripts,
//   ScrollRestoration,
//   useLoaderData,
// } from "@remix-run/react";
// import { Layout } from "~/components/Layout"; // Importez votre Layout


// export { layoutLoader };

// import "./tailwind.css";

// export const links: LinksFunction = () => [
//   { rel: "preconnect", href: "https://fonts.googleapis.com" },
//   {
//     rel: "preconnect",
//     href: "https://fonts.gstatic.com",
//     crossOrigin: "anonymous",
//   },
//   {
//     rel: "stylesheet",
//     href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
//   },
// ];

// export default function App() {
//  const { user } = useLoaderData<typeof layoutLoader>();
//   return (
//     <html lang="fr">
//       <head>
//         <meta charSet="utf-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1" />
//         <Meta />
//         <Links />
//       </head>
//       <body>
//         <Layout user={user}>
//           <Outlet />
//         </Layout>
//         <ScrollRestoration />
//         <Scripts />
//       </body>
//     </html>
//   );
// }


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
        
          <Outlet />
        
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}