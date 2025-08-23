import { Suspense, lazy } from "react";
import { LoadingSpinner } from "./LoadingSpinner";

// Composants chargés paresseusement
const AdminDashboard = lazy(() => import("~/routes/admin._index"));
const CompaniesPage = lazy(() => import("~/routes/admin.companies._index"));
const UsersPage = lazy(() => import("~/routes/admin.users"));
const RapportsPage = lazy(() => import("~/routes/admin.rapports"));
const NotificationsPage = lazy(() => import("~/routes/admin.notifications"));
const SettingsPage = lazy(() => import("~/routes/admin.settings"));

// Wrapper avec Suspense pour chaque page
export function LazyAdminDashboard() {
    return (
        <Suspense fallback={<LoadingSpinner fullScreen text="Chargement du tableau de bord..." />}>
            <AdminDashboard />
        </Suspense>
    );
}

export function LazyCompaniesPage() {
    return (
        <Suspense fallback={<LoadingSpinner fullScreen text="Chargement des entreprises..." />}>
            <CompaniesPage />
        </Suspense>
    );
}

export function LazyUsersPage() {
    return (
        <Suspense fallback={<LoadingSpinner fullScreen text="Chargement des utilisateurs..." />}>
            <UsersPage />
        </Suspense>
    );
}

export function LazyRapportsPage() {
    return (
        <Suspense fallback={<LoadingSpinner fullScreen text="Chargement des rapports..." />}>
            <RapportsPage />
        </Suspense>
    );
}

export function LazyNotificationsPage() {
    return (
        <Suspense fallback={<LoadingSpinner fullScreen text="Chargement des notifications..." />}>
            <NotificationsPage />
        </Suspense>
    );
}

export function LazySettingsPage() {
    return (
        <Suspense fallback={<LoadingSpinner fullScreen text="Chargement des paramètres..." />}>
            <SettingsPage />
        </Suspense>
    );
}
