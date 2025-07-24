// gestion des sessions utilisateur avec Remix

import { createCookieSessionStorage } from "@remix-run/node";

// Clé secrète - à remplacer par une vraie clé sécurisée
const SECRET_KEY = process.env.SESSION_SECRET || "secret-key";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SECRET_KEY],
    secure: process.env.NODE_ENV === "production",
  },
});

export const { getSession, commitSession, destroySession } = sessionStorage;