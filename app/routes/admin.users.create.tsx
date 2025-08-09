// import { Form, useActionData, useNavigate } from "@remix-run/react";
// import { json, redirect } from "@remix-run/node";
// import { createUser, roleOptions } from "~/utils/api";
// import type { ActionFunction } from "@remix-run/node";

// export const action: ActionFunction = async ({ request }) => {
//   const formData = await request.formData();
  
//   const userData = {
//     name: formData.get("name"),
//     email: formData.get("email"),
//     role: formData.get("role"),
//     // Ajoutez d'autres champs selon vos besoins
//   };

//   try {
//     await createUser(userData);
//     return redirect("/admin/users");
//   } catch (error) {
//     return json({ error: error.message }, { status: 400 });
//   }
// };

// export default function CreateUser() {
//   const actionData = useActionData();
//   const navigate = useNavigate();

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-2xl font-bold text-gray-900">Créer un utilisateur</h1>
//         <button
//           onClick={() => navigate("/admin/users")}
//           className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
//         >
//           Annuler
//         </button>
//       </div>

//       <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//         <Form method="post" className="px-4 py-5 sm:p-6">
//           {actionData?.error && (
//             <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-md">
//               {actionData.error}
//             </div>
//           )}

//           <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
//             <div className="sm:col-span-3">
//               <label htmlFor="name" className="block text-sm font-medium text-gray-700">
//                 Nom complet
//               </label>
//               <input
//                 type="text"
//                 name="name"
//                 id="name"
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>

//             <div className="sm:col-span-3">
//               <label htmlFor="email" className="block text-sm font-medium text-gray-700">
//                 Email
//               </label>
//               <input
//                 type="email"
//                 name="email"
//                 id="email"
//                 required
//                 className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//               />
//             </div>

//             <div className="sm:col-span-3">
//               <label htmlFor="role" className="block text-sm font-medium text-gray-700">
//                 Rôle
//               </label>
//               <select
//                 id="role"
//                 name="role"
//                 required
//                 className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//               >
//                 <option value="">Sélectionner un rôle</option>
//                 {roleOptions.map((role) => (
//                   <option key={role.value} value={role.value}>
//                     {role.label}
//                   </option>
//                 ))}
//               </select>
//             </div>

//             <div className="sm:col-span-6">
//               <button
//                 type="submit"
//                 className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
//               >
//                 Créer l'utilisateur
//               </button>
//             </div>
//           </div>
//         </Form>
//       </div>
//     </div>
//   );
// }