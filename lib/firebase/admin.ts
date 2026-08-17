import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

// Server-only. Not imported at module top-level anywhere — callers use a
// dynamic import() so the app keeps working (with auth features disabled)
// until FIREBASE_SERVICE_ACCOUNT is set. See lib/auth/session.ts.
function createAdminApp(): App {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is not set. Generate a service account key " +
        "in Firebase console → Project settings → Service accounts, and " +
        "paste the JSON (as a single line) into .env.local.",
    );
  }

  // Defensive: strip accidental wrapping quotes left over from copy-pasting
  // the .env.local single-line format into a dashboard field that doesn't
  // need it (e.g. Vercel's env var UI).
  const cleaned = raw.trim().replace(/^['"]|['"]$/g, "");

  let serviceAccount: Record<string, unknown>;
  try {
    serviceAccount = JSON.parse(cleaned);
  } catch {
    throw new Error(
      "FIREBASE_SERVICE_ACCOUNT is not valid JSON. Paste the exact contents " +
        "of the downloaded service account file — no surrounding quotes needed.",
    );
  }

  const existing = getApps();
  return existing[0] ?? initializeApp({ credential: cert(serviceAccount) });
}

export const adminApp = createAdminApp();
export const adminAuth = getAuth(adminApp);
