import { NextRequest, NextResponse } from "next/server";
import { createSession, clearSession, isAuthConfigured } from "@/lib/auth/session";

export async function POST(req: NextRequest) {
  if (!isAuthConfigured) {
    return NextResponse.json({ error: "Auth is not configured yet." }, { status: 503 });
  }

  const { idToken } = await req.json();
  if (!idToken || typeof idToken !== "string") {
    return NextResponse.json({ error: "Missing idToken" }, { status: 400 });
  }

  try {
    await createSession(idToken);
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Session creation failed:", err);
    return NextResponse.json({ error: "Could not create session" }, { status: 401 });
  }
}

export async function DELETE() {
  await clearSession();
  return NextResponse.json({ ok: true });
}
