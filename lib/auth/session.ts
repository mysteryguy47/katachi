import "server-only";
import { cookies } from "next/headers";

const SESSION_COOKIE = "katachi_session";
const SESSION_MAX_AGE_MS = 1000 * 60 * 60 * 24 * 14; // 14 days

export const isAuthConfigured = Boolean(process.env.FIREBASE_SERVICE_ACCOUNT);

export async function createSession(idToken: string) {
  const { adminAuth } = await import("@/lib/firebase/admin");
  const sessionCookie = await adminAuth.createSessionCookie(idToken, {
    expiresIn: SESSION_MAX_AGE_MS,
  });
  const store = await cookies();
  store.set(SESSION_COOKIE, sessionCookie, {
    maxAge: SESSION_MAX_AGE_MS / 1000,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });
}

export async function clearSession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export type SessionUser = {
  id: string | null; // internal Postgres user id, once DATABASE_URL is set
  uid: string; // Firebase uid
  email: string | null;
  phone: string | null;
  displayName: string | null;
  isAdmin: boolean;
};

export async function getSessionUser(): Promise<SessionUser | null> {
  if (!isAuthConfigured) return null;

  const store = await cookies();
  const cookie = store.get(SESSION_COOKIE)?.value;
  if (!cookie) return null;

  try {
    const { adminAuth } = await import("@/lib/firebase/admin");
    const decoded = await adminAuth.verifySessionCookie(cookie, true);

    let id: string | null = null;
    let isAdmin = false;

    if (process.env.DATABASE_URL) {
      const { getOrCreateUser } = await import("@/lib/data/users");
      const user = await getOrCreateUser({
        firebaseUid: decoded.uid,
        email: decoded.email ?? null,
        phone: decoded.phone_number ?? null,
        displayName: decoded.name ?? null,
      });
      id = user.id;
      isAdmin = user.isAdmin;
    }

    return {
      id,
      uid: decoded.uid,
      email: decoded.email ?? null,
      phone: decoded.phone_number ?? null,
      displayName: decoded.name ?? null,
      isAdmin,
    };
  } catch {
    return null;
  }
}
