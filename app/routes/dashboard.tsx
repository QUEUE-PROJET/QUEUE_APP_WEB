// import { LoaderFunctionArgs, json } from "@remix-run/node";
// import { getSession } from "~/services/session.server";

// export async function loader({ request }: LoaderFunctionArgs) {
//   const session = await getSession(request.headers.get("Cookie"));
//   const user = session.get("user");
//   const accessToken = session.get("access_token");

//   if (!user || !accessToken) {
//     throw new Response("Non autorisé", { status: 401 });
//   }

//   console.log("Accès au dashboard pour:", user.email);

//   return json({
//     user,
//     accessToken: accessToken ? "***" + accessToken.slice(-4) : null, // Masquage partiel du token
//     timestamp: new Date().toISOString()
//   });
// }

// export default function Dashboard() {
//   // const { user, accessToken, timestamp } = useLoaderData<typeof loader>();
//   return (
    
//       <div className="space-y-8">
//         <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
        
//         {/* Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Tickets aujourd'hui</p>
//                 <p className="text-3xl font-bold text-gray-900">42</p>
//                 <p className="text-sm text-green-600">+12% par rapport à hier</p>
//               </div>
//               <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
//                 <div className="w-6 h-6 bg-blue-600 rounded"></div>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Temps d'attente moyen</p>
//                 <p className="text-3xl font-bold text-gray-900">15 min</p>
//                 <p className="text-sm text-red-600">-5% par rapport à hier</p>
//               </div>
//               <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
//                 <div className="w-6 h-6 bg-yellow-500 rounded-full"></div>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Tickets en attente</p>
//                 <p className="text-3xl font-bold text-gray-900">8</p>
//                 <p className="text-sm text-gray-600">2 tickets de plus qu'hier</p>
//               </div>
//               <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
//                 <div className="w-6 h-6 bg-red-600 rounded flex items-center justify-center">
//                   <span className="text-white text-xs">×</span>
//                 </div>
//               </div>
//             </div>
//           </div>
          
//           <div className="bg-white rounded-lg shadow p-6">
//             <div className="flex items-center justify-between">
//               <div>
//                 <p className="text-sm font-medium text-gray-600">Satisfaction client</p>
//                 <p className="text-3xl font-bold text-gray-900">92%</p>
//                 <p className="text-sm text-green-600">+2% par rapport à hier</p>
//               </div>
//               <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
//                 <div className="w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
//                   <span className="text-white text-xs">😊</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
        
//         {/* Tickets Table */}
//         <div className="bg-white rounded-lg shadow">
//           <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
//             <h2 className="text-lg font-semibold text-gray-900">Tickets en attente</h2>
//             <button className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 px-4 py-2 rounded-lg font-medium text-sm">
//               Commencer la file d'attente
//             </button>
//           </div>
          
//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     N° Ticket
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Service
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Temps d'attente
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Statut
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     Actions
//                   </th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 <tr>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     T-001
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     Service client
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     20 min
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                       En cours
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
//                     <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs">
//                       Terminer
//                     </button>
//                     <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
//                       Annuler
//                     </button>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     T-002
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     Comptabilité
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     15 min
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                       En attente
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
//                     <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs">
//                       Appeler
//                     </button>
//                     <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
//                       Annuler
//                     </button>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     T-003
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     Service technique
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     10 min
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                       En attente
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
//                     <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs">
//                       Appeler
//                     </button>
//                     <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
//                       Annuler
//                     </button>
//                   </td>
//                 </tr>
//                 <tr>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
//                     T-004
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     Service client
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                     5 min
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
//                       En attente
//                     </span>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
//                     <button className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-xs">
//                       Appeler
//                     </button>
//                     <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs">
//                       Annuler
//                     </button>
//                   </td>
//                 </tr>
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </div>
   
//   );
// }


import { Outlet, useLoaderData } from "@remix-run/react";
import { Layout } from "~/components/Layout";

import type { loader as dashboardLoader } from "./dashboard";

import { LoaderFunctionArgs, json } from "@remix-run/node";
import { getSession } from "~/services/session.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const user = session.get("user");

  if (!user) {
    // Redirige vers /login si pas connecté au lieu de throw une erreur
    throw new Response(null, {
      status: 302,
      headers: {
        Location: "/login",
      },
    });
  }

  return json({
    user: {
      name: user.name,
      email: user.email,
      role: user.role,
      initials: user.name.split(' ').map(n => n[0]).join('').toUpperCase()
    }
  });
}

export default function DashboardLayout() {
  const { user } = useLoaderData<typeof dashboardLoader>();
  
  return (
    <Layout user={user}>
      <Outlet /> {/* Ici s'afficheront dashboard._index.tsx et dashboard.tickets.tsx */}
    </Layout>
  );
}