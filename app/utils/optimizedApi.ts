/* eslint-disable @typescript-eslint/no-explicit-any */

export const BASE_API_URL = "http://127.0.0.1:8000";

// Cache en mémoire simple
const cache = new Map<string, { data: any; timestamp: number; expiry: number }>();

// Fonction de cache intelligent
function getCachedData(key: string) {
    const cached = cache.get(key);
    if (cached && Date.now() < cached.timestamp + cached.expiry) {
        return cached.data;
    }
    cache.delete(key);
    return null;
}

function setCachedData(key: string, data: any, expiryMs: number) {
    cache.set(key, {
        data,
        timestamp: Date.now(),
        expiry: expiryMs,
    });
}

export async function optimizedApiFetcher(
    endpoint: string,
    options: RequestInit = {},
    cacheOptions?: { key?: string; expiry?: number; skipCache?: boolean }
) {
    const cacheKey = cacheOptions?.key || `${endpoint}_${JSON.stringify(options)}`;
    const expiry = cacheOptions?.expiry || 5 * 60 * 1000; // 5 minutes par défaut
    
    // Vérifier le cache sauf si skipCache est true
    if (!cacheOptions?.skipCache) {
        const cachedData = getCachedData(cacheKey);
        if (cachedData) {
            console.log(`🚀 Cache hit for ${endpoint}`);
            return cachedData;
        }
    }

    const isFormData = options.body instanceof FormData;

    const headers: HeadersInit = {
        ...(isFormData ? options.headers || {} : {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        }),
    };

    const fullUrl = `${BASE_API_URL}${endpoint}`;

    try {
        console.log(`🌐 API call to ${endpoint}`);
        const res = await fetch(fullUrl, {
            ...options,
            headers,
            credentials: 'include'
        });

        const contentType = res.headers.get("content-type");
        const responseBody =
            contentType?.includes("application/json")
                ? await res.json()
                : await res.text();

        if (!res.ok) {
            throw new Error(responseBody.message || `HTTP ${res.status}`);
        }

        // Mettre en cache le résultat
        setCachedData(cacheKey, responseBody, expiry);
        console.log(`💾 Cached data for ${endpoint}`);

        return responseBody;
    } catch (error) {
        console.error(`❌ API Error for ${endpoint}:`, error);
        throw error;
    }
}

// Versions optimisées des fonctions API
export async function fetchCompaniesOptimized() {
    return optimizedApiFetcher("/entreprises/", {}, {
        key: "companies",
        expiry: 5 * 60 * 1000, // 5 minutes
    });
}

export async function listUsersOptimized(page = 1, limit = 10) {
    return optimizedApiFetcher(`/users/?page=${page}&limit=${limit}`, {}, {
        key: `users_${page}_${limit}`,
        expiry: 3 * 60 * 1000, // 3 minutes
    });
}

export async function fetchRapportOptimized(dateDebut: string, dateFin: string, token: string) {
    return optimizedApiFetcher(
        `/admin/rapport-administrateur?date_debut=${dateDebut}&date_fin=${dateFin}`,
        {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        },
        {
            key: `rapport_${dateDebut}_${dateFin}`,
            expiry: 2 * 60 * 1000, // 2 minutes (données plus volatiles)
        }
    );
}

// Fonction pour vider le cache
export function clearApiCache(pattern?: string) {
    if (pattern) {
        Array.from(cache.keys())
            .filter(key => key.includes(pattern))
            .forEach(key => cache.delete(key));
    } else {
        cache.clear();
    }
    console.log(`🗑️ Cache cleared ${pattern ? `for pattern: ${pattern}` : 'completely'}`);
}

// Fonction pour précharger des données
export async function prefetchData(endpoints: Array<{ endpoint: string; options?: RequestInit; cacheKey?: string }>) {
    const promises = endpoints.map(({ endpoint, options = {}, cacheKey }) => 
        optimizedApiFetcher(endpoint, options, { key: cacheKey })
            .catch(error => console.warn(`Prefetch failed for ${endpoint}:`, error))
    );

    await Promise.allSettled(promises);
    console.log(`🚀 Prefetched ${endpoints.length} endpoints`);
}
