// app/routes/tickets/refresh.tsx
import type { LoaderFunctionArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireAuth } from "~/services/auth.server";
import { fetchMyTickets } from "~/utils/api";

export async function loader({ request }: LoaderFunctionArgs) {
    const { token } = await requireAuth(request);
    const tickets = await fetchMyTickets(token);
    return json({ tickets });
}
