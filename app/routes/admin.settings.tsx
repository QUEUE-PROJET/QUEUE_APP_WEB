import { useNavigation } from "@remix-run/react";
import { PageLoadingSkeleton } from "~/components/LoadingSpinner";
import { Sidebar } from "~/components/SidebarAdmin";

export default function Settings() {
  const navigation = useNavigation();
  const isLoading = navigation.state === "loading";

  // Si on est en train de charger, afficher le skeleton
  if (isLoading) {
    return (
      <>
        <Sidebar />
        <PageLoadingSkeleton />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
      <Sidebar />
      <div className="ml-64 overflow-y-auto p-8">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Paramètres</h1>
          <p className="text-gray-600">Page de paramètres en développement...</p>
        </div>
      </div>
    </div>
  );
}