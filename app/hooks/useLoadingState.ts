import { useNavigation } from "@remix-run/react";
import { useEffect, useState } from "react";

export function useLoadingState() {
    const navigation = useNavigation();
    const [isLoading, setIsLoading] = useState(false);
    const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

    useEffect(() => {
        if (navigation.state === "loading") {
            setLoadingStartTime(Date.now());
            // Délai minimum avant d'afficher l'indicateur pour éviter le flash
            const timer = setTimeout(() => {
                setIsLoading(true);
            }, 150);

            return () => clearTimeout(timer);
        } else {
            // Si le chargement était très rapide, on ne montre pas l'indicateur
            const loadingDuration = loadingStartTime ? Date.now() - loadingStartTime : 0;
            
            if (loadingDuration < 300) {
                setIsLoading(false);
                setLoadingStartTime(null);
            } else {
                // Délai pour une transition fluide
                const timer = setTimeout(() => {
                    setIsLoading(false);
                    setLoadingStartTime(null);
                }, 200);

                return () => clearTimeout(timer);
            }
        }
    }, [navigation.state, loadingStartTime]);

    return {
        isLoading,
        navigationState: navigation.state,
        isNavigating: navigation.state !== "idle",
        currentLocation: navigation.location,
    };
}

export function useOptimisticLoading(targetPath?: string) {
    const navigation = useNavigation();
    
    return {
        isLoadingTo: targetPath ? navigation.location?.pathname === targetPath : false,
        isSubmitting: navigation.state === "submitting",
        isLoading: navigation.state === "loading",
        formData: navigation.formData,
    };
}
