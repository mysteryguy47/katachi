import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Not used by any page yet — lib/data/products.ts serves seed data until
// DATABASE_URL is provisioned (Phase 2). Importing this file will throw if
// the env var is missing, so nothing in Phase 1 imports it.
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Provision a Neon Postgres database and add it to .env.local.",
    );
  }
  return drizzle(neon(url), { schema });
}

export const db = createDb();
