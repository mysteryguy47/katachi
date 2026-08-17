"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { syncSession } from "@/lib/auth/sync-session";
import { Button } from "@/components/ui/button";

export function GoogleSignInButton({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleClick() {
    if (!auth) return;
    setPending(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, new GoogleAuthProvider());
      const idToken = await result.user.getIdToken();
      await syncSession(idToken);
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    } catch {
      setError("Sign-in failed. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div>
      <Button
        type="button"
        variant="outline"
        size="lg"
        className="w-full"
        onClick={handleClick}
        disabled={pending}
      >
        {pending ? "Signing in…" : "Continue with Google"}
      </Button>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}
