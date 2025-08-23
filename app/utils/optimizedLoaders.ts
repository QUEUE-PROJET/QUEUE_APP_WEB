import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { requireAuth } from "~/services/auth.server";
import { fetchCompanies } from "~/utils/api";

// Version optimisée du loader dashboard
export async function optimizedDashboardLoader({ request }: LoaderFunctionArgs) {
    // Authentification en parallèle
    const authPromise = requireAuth(request, "ADMINISTRATEUR");
    
    // Commencer le fetch des données immédiatement
    const companiesPromise = fetchCompanies();
    
    // Attendre seulement l'authentification
    await authPromise;
    
    // Les données sont peut-être déjà prêtes
    const companies = await companiesPromise;

    // Traitement optimisé des données
    const processedData = await Promise.all([
        // Traitement en parallèle
        Promise.resolve(companies.filter((c: any) => c.statutEntreprise === "EN_ATTENTE")),
        Promise.resolve(companies.filter((c: any) => c.statutEntreprise === "ACCEPTEE")),
        Promise.resolve(companies.filter((c: any) => c.statutEntreprise === "REJETEE")),
    ]);

    const [pendingCompanies, activeCompanies, rejectedCompanies] = processedData;

    const data = {
        stats: {
            activeCompanies: activeCompanies.length,
            totalUsers: activeCompanies.reduce((sum: number, c: any) => sum + (c.user_count || 0), 0),
            rejectcompanies: rejectedCompanies.length,
            pendingRequests: pendingCompanies.length,
            processedTickets: activeCompanies.reduce((sum: number, c: any) => sum + (c.daily_tickets || 0), 0),
        },
        pendingCompanies: pendingCompanies.slice(0, 6), // Limiter les données
        activeCompanies: activeCompanies.slice(0, 10),  // Pagination côté serveur
    };

    return json(data, {
        headers: {
            "Cache-Control": "public, max-age=60", // Cache pendant 1 minute
        },
    });
}

// Version optimisée pour les entreprises
export async function optimizedCompaniesLoader({ request }: LoaderFunctionArgs) {
    const [, companies] = await Promise.all([
        requireAuth(request, "ADMINISTRATEUR"),
        fetchCompanies(),
    ]);

    // Traitement optimisé
    const processedCompanies = companies.map((c: any) => ({
        id: c.id,
        name: c.name,
        type: c.categorie || "—",
        date: new Date(c.created_at).toLocaleDateString("fr-FR"),
        status: c.statutEntreprise === "EN_ATTENTE" ? "En attente" : 
               c.statutEntreprise === "ACCEPTEE" ? "Actif" : "Rejeté",
        users: c.user_count || 0,
        ticketsPerDay: c.daily_tickets || 0,
        originalStatus: c.statutEntreprise
    }));

    return json({ 
        companies: processedCompanies 
    }, {
        headers: {
            "Cache-Control": "public, max-age=30", // Cache court pour données volatiles
        },
    });
}
