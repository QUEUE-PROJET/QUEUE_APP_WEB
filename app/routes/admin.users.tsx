// import type { ActionFunction, LoaderFunction } from "@remix-run/node";
// import { json, redirect } from "@remix-run/node";
// import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
// import { useState } from "react";
// import { deleteUser, listUsers, roleOptions, User } from "~/utils/api";

// // Type pour les données utilisateur
// interface LoaderData {
//     users: User[];
//     total: number;
//     page: number;
//     limit: number;
// }

// export const loader: LoaderFunction = async ({ request }) => {
//     const url = new URL(request.url);
//     const page = Number(url.searchParams.get("page")) || 1;
//     const limit = Number(url.searchParams.get("limit")) || 10;

//     const data = await listUsers(page, limit);
//     return json(data);
// };

// export const action: ActionFunction = async ({ request }) => {
//     const formData = await request.formData();
//     const actionType = formData.get("_action");
//     const userId = formData.get("userId") as string;

//     switch (actionType) {
//         case "delete":
//             await deleteUser(userId);
//             return redirect("/admin/users");
//         default:
//             return null;
//     }
// };

// export default function AdminUsers() {
//     const { users, total, page, limit } = useLoaderData<LoaderData>();
//     const navigate = useNavigate();
//     const [searchTerm, setSearchTerm] = useState("");

//     // Fonctions utilitaires
//     const formatDate = (dateString: string) => {
//         return new Date(dateString).toLocaleDateString("fr-FR");
//     };

//     const getRoleColor = (role: string) => {
//         const colors = {
//             ADMINISTRATEUR: "bg-purple-100 text-purple-800",
//             ENTREPRISE_AGENT: "bg-blue-100 text-blue-800",
//             EMPLOYE: "bg-green-100 text-green-800",
//             CLIENT: "bg-yellow-100 text-yellow-800",
//         };
//         return colors[role] || "bg-gray-100 text-gray-800";
//     };

//     const filteredUsers = users.filter(user =>
//         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         user.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );

//     const totalPages = Math.ceil(total / limit);

//     return (
//         <div className="container mx-auto px-4 py-8">
//             <div className="flex justify-between items-center mb-8">
//                 <h1 className="text-2xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
//                 <Link
//                     to="/admin/users/create"
//                     className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
//                 >
//                     Créer un utilisateur
//                 </Link>
//             </div>

//             {/* Cartes de statistiques */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 <StatCard
//                     title="Total Utilisateurs"
//                     value={total}
//                     icon={<UsersIcon />}
//                     color="bg-indigo-100 text-indigo-600"
//                 />
//                 <StatCard
//                     title="Agents Entreprise"
//                     value={users.filter(u => u.role === "ENTREPRISE_AGENT").length}
//                     icon={<BriefcaseIcon />}
//                     color="bg-blue-100 text-blue-600"
//                 />
//                 <StatCard
//                     title="Employés"
//                     value={users.filter(u => u.role === "EMPLOYE").length}
//                     icon={<EmployeeIcon />}
//                     color="bg-green-100 text-green-600"
//                 />
//                 <StatCard
//                     title="Clients"
//                     value={users.filter(u => u.role === "CLIENT").length}
//                     icon={<ClientIcon />}
//                     color="bg-yellow-100 text-yellow-600"
//                 />
//             </div>

//             {/* Barre de recherche et filtres */}
//             <div className="bg-white shadow rounded-lg p-4 mb-6">
//                 <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//                     <div className="flex-1">
//                         <label htmlFor="search" className="sr-only">Rechercher</label>
//                         <div className="relative">
//                             <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                                 <SearchIcon />
//                             </div>
//                             <input
//                                 type="text"
//                                 id="search"
//                                 className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
//                                 placeholder="Rechercher par nom ou email"
//                                 value={searchTerm}
//                                 onChange={(e) => setSearchTerm(e.target.value)}
//                             />
//                         </div>
//                     </div>
//                     <div className="flex items-center space-x-4">
//                         <select
//                             className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
//                             defaultValue=""
//                         >
//                             <option value="">Tous les rôles</option>
//                             {roleOptions.map((role) => (
//                                 <option key={role.value} value={role.value}>
//                                     {role.label}
//                                 </option>
//                             ))}
//                         </select>
//                     </div>
//                 </div>
//             </div>

//             {/* Tableau des utilisateurs */}
//             <div className="bg-white shadow overflow-hidden sm:rounded-lg">
//                 <div className="overflow-x-auto">
//                     <table className="min-w-full divide-y divide-gray-200">
//                         <thead className="bg-gray-50">
//                             <tr>
//                                 <TableHeader>Nom</TableHeader>
//                                 <TableHeader>Email</TableHeader>
//                                 <TableHeader>Rôle</TableHeader>
//                                 <TableHeader>Créé le</TableHeader>
//                                 <TableHeader>Statut</TableHeader>
//                                 <TableHeader align="right">Actions</TableHeader>
//                             </tr>
//                         </thead>
//                         <tbody className="bg-white divide-y divide-gray-200">
//                             {filteredUsers.length > 0 ? (
//                                 filteredUsers.map((user) => (
//                                     <tr key={user.id} className="hover:bg-gray-50">
//                                         <TableCell>
//                                             <div className="flex items-center">
//                                                 <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
//                                                     <span className="text-gray-600 font-medium">
//                                                         {user.name.charAt(0).toUpperCase()}
//                                                     </span>
//                                                 </div>
//                                                 <div className="ml-4">
//                                                     <div className="text-sm font-medium text-gray-900">
//                                                         {user.name}
//                                                     </div>
//                                                 </div>
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="text-sm text-gray-900">{user.email}</div>
//                                         </TableCell>
//                                         <TableCell>
//                                             <span
//                                                 className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleColor(
//                                                     user.role
//                                                 )}`}
//                                             >
//                                                 {user.role.replace("_", " ")}
//                                             </span>
//                                         </TableCell>
//                                         <TableCell>
//                                             <div className="text-sm text-gray-500">
//                                                 {formatDate(user.created_at)}
//                                             </div>
//                                         </TableCell>
//                                         <TableCell>
//                                             {user.email_verified ? (
//                                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
//                                                     Vérifié
//                                                 </span>
//                                             ) : (
//                                                 <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
//                                                     Non vérifié
//                                                 </span>
//                                             )}
//                                             {user.must_change_password && (
//                                                 <div className="text-xs text-yellow-600 mt-1">
//                                                     Changement mot de passe requis
//                                                 </div>
//                                             )}
//                                         </TableCell>
//                                         <TableCell align="right">
//                                             <div className="flex justify-end space-x-2">
//                                                 <Link
//                                                     to={`/admin/users/${user.id}`}
//                                                     className="text-indigo-600 hover:text-indigo-900 text-sm"
//                                                 >
//                                                     Voir
//                                                 </Link>
//                                                 <Link
//                                                     to={`/admin/users/${user.id}/edit`}
//                                                     className="text-yellow-600 hover:text-yellow-900 text-sm"
//                                                 >
//                                                     Modifier
//                                                 </Link>
//                                                 <Form method="post">
//                                                     <input type="hidden" name="userId" value={user.id} />
//                                                     <button
//                                                         type="submit"
//                                                         name="_action"
//                                                         value="delete"
//                                                         className="text-red-600 hover:text-red-900 text-sm"
//                                                         onClick={(e) => {
//                                                             if (!confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
//                                                                 e.preventDefault();
//                                                             }
//                                                         }}
//                                                     >
//                                                         Supprimer
//                                                     </button>
//                                                 </Form>
//                                             </div>
//                                         </TableCell>
//                                     </tr>
//                                 ))
//                             ) : (
//                                 <tr>
//                                     <TableCell colSpan={6} align="center">
//                                         Aucun utilisateur trouvé
//                                     </TableCell>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>

//                 {/* Pagination */}
//                 {totalPages > 1 && (
//                     <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
//                         <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
//                             <div>
//                                 <p className="text-sm text-gray-700">
//                                     Affichage de <span className="font-medium">{(page - 1) * limit + 1}</span> à{' '}
//                                     <span className="font-medium">{Math.min(page * limit, total)}</span> sur{' '}
//                                     <span className="font-medium">{total}</span> utilisateurs
//                                 </p>
//                             </div>
//                             <div>
//                                 <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
//                                     <button
//                                         onClick={() => navigate(`?page=${Math.max(1, page - 1)}&limit=${limit}`)}
//                                         disabled={page <= 1}
//                                         className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${page <= 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
//                                     >
//                                         <span className="sr-only">Précédent</span>
//                                         <ChevronLeftIcon />
//                                     </button>

//                                     {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
//                                         let pageNum;
//                                         if (totalPages <= 5) {
//                                             pageNum = i + 1;
//                                         } else if (page <= 3) {
//                                             pageNum = i + 1;
//                                         } else if (page >= totalPages - 2) {
//                                             pageNum = totalPages - 4 + i;
//                                         } else {
//                                             pageNum = page - 2 + i;
//                                         }

//                                         return (
//                                             <button
//                                                 key={pageNum}
//                                                 onClick={() => navigate(`?page=${pageNum}&limit=${limit}`)}
//                                                 className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${page === pageNum ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
//                                             >
//                                                 {pageNum}
//                                             </button>
//                                         );
//                                     })}

//                                     <button
//                                         onClick={() => navigate(`?page=${Math.min(totalPages, page + 1)}&limit=${limit}`)}
//                                         disabled={page >= totalPages}
//                                         className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${page >= totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
//                                     >
//                                         <span className="sr-only">Suivant</span>
//                                         <ChevronRightIcon />
//                                     </button>
//                                 </nav>
//                             </div>
//                         </div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// }

// // Composants utilitaires
// function TableHeader({ children, align = "left" }: { children: React.ReactNode; align?: "left" | "right" | "center" }) {
//     return (
//         <th
//             scope="col"
//             className={`px-6 py-3 text-${align} text-xs font-medium text-gray-500 uppercase tracking-wider`}
//         >
//             {children}
//         </th>
//     );
// }

// function TableCell({ children, align = "left", colSpan }: { children: React.ReactNode; align?: "left" | "right" | "center"; colSpan?: number }) {
//     return (
//         <td
//             className={`px-6 py-4 whitespace-nowrap text-${align} text-sm`}
//             colSpan={colSpan}
//         >
//             {children}
//         </td>
//     );
// }

// function StatCard({ title, value, icon, color }: { title: string; value: number; icon: React.ReactNode; color: string }) {
//     return (
//         <div className="bg-white overflow-hidden shadow rounded-lg">
//             <div className="px-4 py-5 sm:p-6">
//                 <div className="flex items-center">
//                     <div className={`rounded-md p-3 ${color}`}>
//                         {icon}
//                     </div>
//                     <div className="ml-5 w-0 flex-1">
//                         <dl>
//                             <dt className="text-sm font-medium text-gray-500 truncate">
//                                 {title}
//                             </dt>
//                             <dd className="flex items-baseline">
//                                 <div className="text-2xl font-semibold text-gray-900">
//                                     {value}
//                                 </div>
//                             </dd>
//                         </dl>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }

// // Icônes
// function UsersIcon() {
//     return (
//         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
//         </svg>
//     );
// }

// function BriefcaseIcon() {
//     return (
//         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
//         </svg>
//     );
// }

// function EmployeeIcon() {
//     return (
//         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
//         </svg>
//     );
// }

// function ClientIcon() {
//     return (
//         <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
//         </svg>
//     );
// }

// function SearchIcon() {
//     return (
//         <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
//         </svg>
//     );
// }

// function ChevronLeftIcon() {
//     return (
//         <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//             <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
//         </svg>
//     );
// }

// function ChevronRightIcon() {
//     return (
//         <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
//             <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
//         </svg>
//     );
// }