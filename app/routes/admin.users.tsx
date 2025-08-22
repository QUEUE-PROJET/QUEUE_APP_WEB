import {
    BriefcaseIcon,
    BuildingOfficeIcon,
    CheckCircleIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    EyeIcon,
    MagnifyingGlassIcon,
    PencilIcon,
    TrashIcon,
    UserIcon,
    UsersIcon,
    XCircleIcon
} from "@heroicons/react/24/outline";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, Link, useLoaderData, useNavigate } from "@remix-run/react";
import { useState } from "react";
import { FormField } from "~/components/FormField";
import { Sidebar } from "~/components/SidebarAdmin";
import { deleteUser, listUsers, roleOptions, User } from "~/utils/api";

// Type pour les données utilisateur
interface LoaderData {
    users: User[];
    total: number;
    page: number;
    limit: number;
}

export const loader: LoaderFunction = async ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page")) || 1;
    const limit = Number(url.searchParams.get("limit")) || 10;

    try {
        console.log("🔍 Tentative d'appel API listUsers...");
        const apiResponse = await listUsers(page, limit);
        console.log("✅ Données reçues de l'API:", apiResponse);

        // Vérifier si la réponse est un tableau (votre format actuel)
        if (Array.isArray(apiResponse)) {
            const users = apiResponse;
            const formattedData = {
                users: users,
                total: users.length,
                page: page,
                limit: limit,
            };
            console.log("📊 Données formatées depuis l'API:", formattedData);
            return json(formattedData);
        }

        // Si c'est déjà le bon format (avec users, total, etc.)
        if (apiResponse && apiResponse.users && Array.isArray(apiResponse.users)) {
            console.log("📊 Données API au bon format:", apiResponse);
            return json(apiResponse);
        }

        // Si la réponse est vide ou invalide, utiliser des données mock temporairement
        console.warn("⚠️ Réponse API inattendue, utilisation des données mock temporairement:", apiResponse);
        const mockData = {
            users: [],
            total: 0,
            page: page,
            limit: limit,
        };
        return json(mockData);

    } catch (error) {
        console.error("❌ Erreur lors du chargement des utilisateurs:", error);

        // En cas d'erreur, retourner des données vides
        const errorData = {
            users: [],
            total: 0,
            page: page,
            limit: limit,
        };
        return json(errorData);
    }
};

export const action: ActionFunction = async ({ request }) => {
    const formData = await request.formData();
    const actionType = formData.get("_action");
    const userId = formData.get("userId") as string;

    switch (actionType) {
        case "delete":
            await deleteUser(userId);
            return redirect("/admin/users");
        default:
            return null;
    }
};

export default function AdminUsers() {
    const data = useLoaderData<LoaderData>();
    const users = data?.users || [];
    const total = data?.total || 0;
    const page = data?.page || 1;
    const limit = data?.limit || 10;
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [roleFilter, setRoleFilter] = useState("");

    // Fonctions utilitaires
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("fr-FR", {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getRoleColor = (role: string) => {
        const colors = {
            ADMINISTRATEUR: "from-purple-500 to-purple-600 text-white",
            ENTREPRISE_AGENT: "from-blue-500 to-blue-600 text-white",
            EMPLOYE: "from-emerald-500 to-green-600 text-white",
            CLIENT: "from-amber-500 to-orange-600 text-white",
        };
        return colors[role as keyof typeof colors] || "from-gray-500 to-gray-600 text-white";
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "ADMINISTRATEUR":
                return UserIcon;
            case "ENTREPRISE_AGENT":
                return BriefcaseIcon;
            case "EMPLOYE":
                return BuildingOfficeIcon;
            case "CLIENT":
                return UsersIcon;
            default:
                return UserIcon;
        }
    };

    const filteredUsers = Array.isArray(users) ? users.filter(user => {
        const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = !roleFilter || user.role === roleFilter;
        return matchesSearch && matchesRole;
    }) : [];

    const totalPages = Math.ceil(total / limit) || 1;

    // Statistiques par rôle
    const stats = [
        {
            title: "Total Utilisateurs",
            value: total,
            icon: UsersIcon,
            gradient: "from-indigo-500 to-blue-600",
            bgGradient: "from-indigo-50 to-blue-100",
        },
        {
            title: "Administrateurs",
            value: Array.isArray(users) ? users.filter(u => u.role === "ADMINISTRATEUR").length : 0,
            icon: UserIcon,
            gradient: "from-purple-500 to-violet-600",
            bgGradient: "from-purple-50 to-violet-100",
        },
        {
            title: "Agents Entreprise",
            value: Array.isArray(users) ? users.filter(u => u.role === "ENTREPRISE_AGENT").length : 0,
            icon: BriefcaseIcon,
            gradient: "from-blue-500 to-cyan-600",
            bgGradient: "from-blue-50 to-cyan-100",
        },
        {
            title: "Employés",
            value: Array.isArray(users) ? users.filter(u => u.role === "EMPLOYE").length : 0,
            icon: BuildingOfficeIcon,
            gradient: "from-emerald-500 to-green-600",
            bgGradient: "from-emerald-50 to-green-100",
        },
        {
            title: "Clients",
            value: Array.isArray(users) ? users.filter(u => u.role === "CLIENT").length : 0,
            icon: UsersIcon,
            gradient: "from-amber-500 to-orange-600",
            bgGradient: "from-amber-50 to-orange-100",
        },
        {
            title: "Comptes Vérifiés",
            value: Array.isArray(users) ? users.filter(u => u.email_verified).length : 0,
            icon: CheckCircleIcon,
            gradient: "from-green-500 to-emerald-600",
            bgGradient: "from-green-50 to-emerald-100",
        },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
            <div className="flex">
                <Sidebar />
                <div className="flex-1 ml-64">
                    <div className="p-8">
                        <div className="max-w-7xl mx-auto">
                            {/* En-tête avec animation */}
                            <div className="relative mb-12">
                                <div className="absolute inset-0 bg-gradient-to-r from-[#00296b] via-[#003f88] to-[#00509d] rounded-3xl transform -skew-y-1 shadow-2xl"></div>
                                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h1 className="text-4xl font-bold bg-gradient-to-r from-[#00296b] to-[#003f88] bg-clip-text text-transparent mb-2">
                                                Gestion des Utilisateurs
                                            </h1>
                                            <p className="text-lg text-gray-600">Administration complète des comptes utilisateurs</p>
                                        </div>
                                        {/* <div className="flex items-center space-x-3">
                                            <Link
                                                to="/admin/users/create"
                                                className="bg-gradient-to-r from-[#fdc500] to-[#ffd500] text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2"
                                            >
                                                <UserPlusIcon className="h-5 w-5" />
                                                <span>Créer un utilisateur</span>
                                            </Link>
                                        </div> */}
                                    </div>
                                </div>
                            </div>

                            {/* Statistiques */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-slate-50/50 to-gray-50/50"></div>
                                <div className="relative">
                                    <div className="flex items-center space-x-3 mb-8">
                                        <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Statistiques des Utilisateurs
                                        </h2>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {stats.map((stat, index) => (
                                            <div
                                                key={index}
                                                className="group relative bg-gradient-to-br from-white to-gray-50/50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100/50"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <div className={`p-4 rounded-2xl bg-gradient-to-br ${stat.bgGradient} group-hover:scale-110 transition-transform duration-300`}>
                                                        <stat.icon className={`h-8 w-8 text-gray-600`} />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-sm font-semibold text-gray-600 mb-1">{stat.title}</p>
                                                        <p className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                                                            {stat.value.toLocaleString()}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className={`absolute inset-0 bg-gradient-to-r ${stat.gradient} opacity-0 group-hover:opacity-5 rounded-2xl transition-opacity duration-300`}></div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Filtres et recherche */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 p-8 relative overflow-hidden mb-8">
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50"></div>
                                <div className="relative">
                                    <div className="flex items-center space-x-3 mb-6">
                                        <div className="w-3 h-3 bg-gradient-to-r from-[#00296b] to-[#003f88] rounded-full"></div>
                                        <h3 className="text-xl font-bold text-gray-900">
                                            Rechercher et Filtrer
                                        </h3>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div className="md:col-span-2">
                                            <div className="relative">
                                                <FormField
                                                    label="Rechercher par nom ou email"
                                                    name="search"
                                                    type="text"
                                                    value={searchTerm}
                                                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
                                                    placeholder="Tapez pour rechercher..."
                                                />
                                                <MagnifyingGlassIcon className="absolute right-3 top-11 h-5 w-5 text-gray-400" />
                                            </div>
                                        </div>
                                        <div>
                                            <label htmlFor="role-filter" className="block text-sm font-bold text-gray-700 mb-2">
                                                Filtrer par rôle
                                            </label>
                                            <select
                                                id="role-filter"
                                                value={roleFilter}
                                                onChange={(e) => setRoleFilter(e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl bg-white/80 backdrop-blur-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 shadow-sm hover:shadow-md"
                                            >
                                                <option value="">Tous les rôles</option>
                                                {roleOptions.map((role) => (
                                                    <option key={role.value} value={role.value}>
                                                        {role.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Tableau des utilisateurs */}
                            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                                <div className="bg-gradient-to-r from-[#00296b] to-[#003f88] px-8 py-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-3 h-3 bg-gradient-to-r from-[#fdc500] to-[#ffd500] rounded-full"></div>
                                            <h3 className="text-xl font-bold text-white">
                                                Liste des Utilisateurs ({filteredUsers.length})
                                            </h3>
                                        </div>
                                        <div className="text-sm text-blue-100">
                                            Page {page} sur {totalPages}
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="overflow-x-auto">
                                        <table className="min-w-full">
                                            <thead>
                                                <tr className="border-b border-gray-200">
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                        Utilisateur
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                        Rôle
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                        Statut
                                                    </th>
                                                    <th className="px-6 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                        Créé le
                                                    </th>
                                                    <th className="px-6 py-4 text-right text-sm font-bold text-gray-700 uppercase tracking-wider">
                                                        Actions
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {filteredUsers.length > 0 ? (
                                                    filteredUsers.map((user) => {
                                                        const RoleIcon = getRoleIcon(user.role);
                                                        return (
                                                            <tr key={user.id} className="group hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-300">
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center">
                                                                        <div className="flex-shrink-0 h-12 w-12">
                                                                            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-[#00296b] to-[#003f88] flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 transform group-hover:scale-110">
                                                                                <span className="text-white text-lg font-bold">
                                                                                    {user.name.charAt(0).toUpperCase()}
                                                                                </span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="ml-4">
                                                                            <div className="text-sm font-bold text-gray-900 group-hover:text-blue-900 transition-colors duration-300">
                                                                                {user.name}
                                                                            </div>
                                                                            <div className="text-sm text-gray-500">
                                                                                {user.email}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="flex items-center space-x-2">
                                                                        <RoleIcon className="h-5 w-5 text-gray-500" />
                                                                        <span className={`px-3 py-1 inline-flex text-xs font-bold rounded-full bg-gradient-to-r ${getRoleColor(user.role)}`}>
                                                                            {user.role.replace("_", " ")}
                                                                        </span>
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap">
                                                                    <div className="space-y-1">
                                                                        {user.email_verified ? (
                                                                            <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-gradient-to-r from-emerald-500 to-green-600 text-white">
                                                                                <CheckCircleIcon className="h-3 w-3 mr-1" />
                                                                                Vérifié
                                                                            </span>
                                                                        ) : (
                                                                            <span className="px-3 py-1 inline-flex text-xs font-bold rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white">
                                                                                <XCircleIcon className="h-3 w-3 mr-1" />
                                                                                Non vérifié
                                                                            </span>
                                                                        )}
                                                                        {user.must_change_password === true && (
                                                                            <div className="text-xs font-medium text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                                                                                Changement mot de passe requis
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                                    {formatDate(user.created_at)}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                                    <div className="flex justify-end items-center space-x-2">
                                                                        <Link
                                                                            to={`/admin/users/${user.id}`}
                                                                            className="p-2 text-blue-600 hover:text-blue-900 hover:bg-blue-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                                                                            title="Voir les détails"
                                                                        >
                                                                            <EyeIcon className="h-4 w-4" />
                                                                        </Link>
                                                                        <Link
                                                                            to={`/admin/users/${user.id}/edit`}
                                                                            className="p-2 text-amber-600 hover:text-amber-900 hover:bg-amber-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                                                                            title="Modifier"
                                                                        >
                                                                            <PencilIcon className="h-4 w-4" />
                                                                        </Link>
                                                                        <Form method="post" className="inline">
                                                                            <input type="hidden" name="_action" value="delete" />
                                                                            <input type="hidden" name="userId" value={user.id} />
                                                                            <button
                                                                                type="submit"
                                                                                onClick={(e) => {
                                                                                    if (!confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" ? Cette action est irréversible.`)) {
                                                                                        e.preventDefault();
                                                                                    }
                                                                                }}
                                                                                className="p-2 text-red-600 hover:text-red-900 hover:bg-red-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                                                                                title="Supprimer"
                                                                            >
                                                                                <TrashIcon className="h-4 w-4" />
                                                                            </button>
                                                                        </Form>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })
                                                ) : (
                                                    <tr>
                                                        <td colSpan={5} className="px-6 py-12 text-center">
                                                            <div className="flex flex-col items-center justify-center space-y-4">
                                                                <UsersIcon className="h-12 w-12 text-gray-400" />
                                                                <div className="text-lg font-medium text-gray-500">
                                                                    Aucun utilisateur trouvé
                                                                </div>
                                                                <div className="text-sm text-gray-400">
                                                                    Essayez de modifier vos critères de recherche
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-6">
                                            <div className="text-sm text-gray-700">
                                                Affichage de <span className="font-bold">{(page - 1) * limit + 1}</span> à{' '}
                                                <span className="font-bold">{Math.min(page * limit, total)}</span> sur{' '}
                                                <span className="font-bold">{total}</span> utilisateurs
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => navigate(`?page=${Math.max(1, page - 1)}&limit=${limit}`)}
                                                    disabled={page <= 1}
                                                    className={`p-2 rounded-xl border transition-all duration-300 ${page <= 1
                                                            ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                                            : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105'
                                                        }`}
                                                >
                                                    <ChevronLeftIcon className="h-5 w-5" />
                                                </button>

                                                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                                    let pageNum;
                                                    if (totalPages <= 5) {
                                                        pageNum = i + 1;
                                                    } else if (page <= 3) {
                                                        pageNum = i + 1;
                                                    } else if (page >= totalPages - 2) {
                                                        pageNum = totalPages - 4 + i;
                                                    } else {
                                                        pageNum = page - 2 + i;
                                                    }

                                                    return (
                                                        <button
                                                            key={pageNum}
                                                            onClick={() => navigate(`?page=${pageNum}&limit=${limit}`)}
                                                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 transform hover:scale-105 ${page === pageNum
                                                                    ? 'bg-gradient-to-r from-[#00296b] to-[#003f88] text-white shadow-lg'
                                                                    : 'text-gray-700 border border-gray-300 hover:bg-gray-50'
                                                                }`}
                                                        >
                                                            {pageNum}
                                                        </button>
                                                    );
                                                })}

                                                <button
                                                    onClick={() => navigate(`?page=${Math.min(totalPages, page + 1)}&limit=${limit}`)}
                                                    disabled={page >= totalPages}
                                                    className={`p-2 rounded-xl border transition-all duration-300 ${page >= totalPages
                                                            ? 'text-gray-300 border-gray-200 cursor-not-allowed'
                                                            : 'text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-gray-400 transform hover:scale-105'
                                                        }`}
                                                >
                                                    <ChevronRightIcon className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}