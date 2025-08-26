import { json, LoaderFunctionArgs } from "@remix-run/node";
import { Link, useLoaderData, useNavigation } from "@remix-run/react";
import { Button } from "~/components/Button";
import { Sidebar } from "~/components/SidebarAdmin";
import { StatusMessage } from "~/components/StatusMessage";
import { getSession } from "~/services/session.server";
import { apiFetcher, type User, type UsersResponse } from "~/utils/api";

type LoaderData = {
  users: User[];
  total: number;
  page: number;
  limit: number;
  error?: string;
};

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request.headers.get("Cookie"));
  const token = session.get("access_token");
  const userRole = session.get("user_role");

  if (!token) throw new Response("Non autorisé", { status: 401 });
  if (userRole !== "ADMINISTRATEUR") throw new Response("Accès refusé", { status: 403 });

  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get("page") ?? "1", 10);
  const limit = parseInt(url.searchParams.get("limit") ?? "10", 10);

  try {
    const resp = (await apiFetcher(`/api/users/?page=${page}&limit=${limit}`, {
      headers: { Authorization: `Bearer ${token}` },
    })) as UsersResponse | User[];

    const users = Array.isArray(resp) ? resp : resp.users;
    const total = Array.isArray(resp) ? users.length : resp.total;

    return json<LoaderData>({ users, total, page, limit });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Impossible de charger les utilisateurs";
    return json<LoaderData>({ users: [], total: 0, page, limit, error: message });
  }
}

export default function AdminUsers() {
  const { users, total, page, limit, error } = useLoaderData<LoaderData>();
  const navigation = useNavigation();
  const isLoading = navigation.state !== "idle";

  const totalPages = Math.max(1, Math.ceil(total / limit));
  const hasPrev = page > 1;
  const hasNext = page < totalPages;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 h-screen overflow-y-auto">
          <div className="p-6">
            <div className="max-w-6xl mx-auto">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-gradient-to-r from-[#00296b] via-[#003f88] to-[#00509d] rounded-3xl transform -skew-y-1 shadow-2xl"></div>
                <div className="relative bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h1 className="text-3xl font-bold bg-gradient-to-r from-[#00296b] to-[#003f88] bg-clip-text text-transparent">Utilisateurs</h1>
                      <p className="text-sm text-gray-600">Gestion des comptes et rôles</p>
                    </div>
                    {/* <Link to="/admin/users/create">
                      <Button className="bg-gradient-to-r from-[#00296b] to-[#003f88] text-white hover:from-[#003f88] hover:to-[#00509d]">
                        + Créer un utilisateur
                      </Button>
                    </Link> */}
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4">
                  <StatusMessage type="error" message={error} />
                </div>
              )}

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/50 overflow-hidden">
                <div className="p-4 overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-gray-200 bg-gray-50/50">
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Nom</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Rôle</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Vérifié</th>
                        <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">Créé le</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {users.map((u) => (
                        <tr key={u.id} className="hover:bg-blue-50/50">
                          <td className="px-4 py-3 text-sm font-semibold text-gray-900">{u.name}</td>
                          <td className="px-4 py-3 text-sm text-gray-700">{u.email}</td>
                          <td className="px-4 py-3 text-xs font-bold">
                            <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-sm">
                            {u.email_verified ? (
                              <span className="text-emerald-600 font-semibold">Oui</span>
                            ) : (
                              <span className="text-amber-600 font-semibold">Non</span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-600">{new Date(u.created_at).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {users.length === 0 && (
                        <tr>
                          <td className="px-4 py-6 text-center text-gray-500" colSpan={5}>
                            Aucun utilisateur trouvé.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="px-4 py-3 flex items-center justify-between bg-gray-50/60 border-t border-gray-100">
                  <div className="text-xs text-gray-600">
                    Page {page} / {totalPages} • {total} utilisateurs
                  </div>
                  <div className="space-x-2">
                    <Link to={`?page=${page - 1}&limit=${limit}`} className={!hasPrev ? "pointer-events-none opacity-50" : ""}>
                      <Button disabled={!hasPrev} variant="ghost">Précédent</Button>
                    </Link>
                    <Link to={`?page=${page + 1}&limit=${limit}`} className={!hasNext ? "pointer-events-none opacity-50" : ""}>
                      <Button disabled={!hasNext} variant="ghost">Suivant</Button>
                    </Link>
                  </div>
                </div>
              </div>

              {isLoading && (
                <div className="mt-4 text-sm text-gray-500">Chargement…</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}