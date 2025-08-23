import { useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";

export function SimpleLoadingBar() {
    const navigation = useNavigation();
    const isLoading = navigation.state === "loading";

    if (!isLoading) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-50">
            <div className="h-1 bg-blue-500 animate-pulse shadow-lg"></div>
            <div className="fixed top-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg px-3 py-2 flex items-center gap-2 shadow-lg">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-gray-700">Chargement...</span>
            </div>
        </div>
    );
}
