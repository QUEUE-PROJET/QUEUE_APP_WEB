import { useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

export function GlobalLoadingIndicator() {
    const navigation = useNavigation();
    const [isVisible, setIsVisible] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        let timer: NodeJS.Timeout;

        if (navigation.state === "loading") {
            // Afficher l'indicateur après un petit délai pour éviter le flicker
            timer = setTimeout(() => setIsVisible(true), 100);

            // Animation de la barre de progression
            const progressTimer = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 90) return 90; // Ne jamais atteindre 100% avant la fin réelle
                    return prev + Math.random() * 15;
                });
            }, 200);

            return () => {
                clearTimeout(timer);
                clearInterval(progressTimer);
            };
        } else {
            setProgress(100);
            // Cacher l'indicateur après l'animation de complétion
            timer = setTimeout(() => {
                setIsVisible(false);
                setProgress(0);
            }, 200);
        }

        return () => clearTimeout(timer);
    }, [navigation.state]);

    if (!isVisible && navigation.state === "idle") return null;

    return (
        <>
            {/* Barre de progression fixe en haut */}
            <div className="fixed top-0 left-0 right-0 z-50">
                <div className="h-1 bg-blue-100/50">
                    <div
                        className="h-full bg-gradient-to-r from-blue-500 via-blue-600 to-purple-600 transition-all duration-300 ease-out shadow-lg"
                        style={{
                            width: `${progress}%`,
                            boxShadow: progress > 0 ? "0 0 10px 0 rgba(59, 130, 246, 0.6)" : "none"
                        }}
                    />
                </div>
            </div>

            {/* Indicateur flottant (optionnel) */}
            {navigation.state === "loading" && (
                <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-4 fade-in duration-300">
                    <div className="bg-white/95 backdrop-blur-sm rounded-full px-4 py-2 flex items-center space-x-2 shadow-lg border border-gray-200">
                        <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                        <span className="text-sm font-medium text-gray-700">Chargement...</span>
                    </div>
                </div>
            )}
        </>
    );
}
