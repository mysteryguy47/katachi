"use client";

export async function syncSession(idToken: string) {
  const res = await fetch("/api/auth/session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idToken }),
  });
  if (!res.ok) throw new Error("Could not start session");
}

export async function clearClientSession() {
  await fetch("/api/auth/session", { method: "DELETE" });
}
