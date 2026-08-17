import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function getOrCreateUser(input: {
  firebaseUid: string;
  email: string | null;
  phone: string | null;
  displayName: string | null;
}) {
  const existing = await db.query.users.findFirst({
    where: eq(users.firebaseUid, input.firebaseUid),
  });
  if (existing) return existing;

  const [created] = await db.insert(users).values(input).returning();
  return created;
}
