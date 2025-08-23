import { useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchCompanies, fetchRapportAdministrateur, listUsers } from "~/utils/api";
import React, { useState } from "react";
// Clés de cache pour organiser les données
export const queryKeys = {
    companies: ['companies'] as const,
    users: (page?: number, limit?: number) => ['users', page, limit] as const,
    rapport: (dateDebut: string, dateFin: string) => ['rapport', dateDebut, dateFin] as const,
    notifications: ['notifications'] as const,
};

// Hook pour les entreprises avec cache
export function useCompanies() {
    return useQuery({
        queryKey: queryKeys.companies,
        queryFn: fetchCompanies,
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000,   // 10 minutes
    });
}

// Hook pour les utilisateurs avec pagination
export function useUsers(page = 1, limit = 10) {
    return useQuery({
        queryKey: queryKeys.users(page, limit),
        queryFn: () => listUsers(page, limit),
        staleTime: 3 * 60 * 1000, // 3 minutes
        placeholderData: (previousData) => previousData, // Garde les données précédentes pendant le chargement
    });
}

// Hook pour les rapports
export function useRapport(dateDebut: string, dateFin: string, token: string) {
    return useQuery({
        queryKey: queryKeys.rapport(dateDebut, dateFin),
        queryFn: () => fetchRapportAdministrateur(dateDebut, dateFin, token),
        staleTime: 2 * 60 * 1000, // 2 minutes (données plus volatiles)
        enabled: !!(dateDebut && dateFin && token), // Ne s'exécute que si les params sont présents
    });
}

// Hook pour précharger les données
export function usePrefetchData() {
    const queryClient = useQueryClient();

    const prefetchCompanies = () => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.companies,
            queryFn: fetchCompanies,
            staleTime: 5 * 60 * 1000,
        });
    };

    const prefetchUsers = (page = 1, limit = 10) => {
        queryClient.prefetchQuery({
            queryKey: queryKeys.users(page, limit),
            queryFn: () => listUsers(page, limit),
            staleTime: 3 * 60 * 1000,
        });
    };

    return {
        prefetchCompanies,
        prefetchUsers,
    };
}

// Hook pour invalider le cache
export function useInvalidateData() {
    const queryClient = useQueryClient();

    const invalidateCompanies = () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.companies });
    };

    const invalidateUsers = () => {
        queryClient.invalidateQueries({ queryKey: ['users'] });
    };

    const invalidateAll = () => {
        queryClient.invalidateQueries();
    };

    return {
        invalidateCompanies,
        invalidateUsers,
        invalidateAll,
    };
}
