import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useState } from "react";

export function QueryProvider({ children }: { children: React.ReactNode }) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Cache pendant 5 minutes
                        staleTime: 5 * 60 * 1000,
                        // Garde en cache pendant 10 minutes
                        gcTime: 10 * 60 * 1000,
                        // Retry sur échec
                        retry: 2,
                        // Refetch en arrière-plan
                        refetchOnWindowFocus: false,
                        // Prefetch automatique
                        refetchOnMount: false,
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
