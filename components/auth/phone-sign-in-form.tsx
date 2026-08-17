"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult,
} from "firebase/auth";
import { auth } from "@/lib/firebase/client";
import { syncSession } from "@/lib/auth/sync-session";
import { Button } from "@/components/ui/button";

const inputClass =
  "h-12 w-full rounded-full border border-line bg-paper px-5 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus-visible:ring-2 focus-visible:ring-navy-700";

export function PhoneSignInForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recaptchaRef = useRef<HTMLDivElement>(null);
  const verifierRef = useRef<RecaptchaVerifier | null>(null);

  async function sendCode(e: React.FormEvent) {
    e.preventDefault();
    if (!auth || !/^[6-9]\d{9}$/.test(phone)) {
      setError("Enter a valid 10-digit mobile number.");
      return;
    }
    setPending(true);
    setError(null);
    try {
      if (!verifierRef.current) {
        verifierRef.current = new RecaptchaVerifier(auth, recaptchaRef.current!, {
          size: "invisible",
        });
      }
      const result = await signInWithPhoneNumber(auth, `+91${phone}`, verifierRef.current);
      setConfirmation(result);
    } catch {
      setError("Couldn't send a code. Check the number and try again.");
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(e: React.FormEvent) {
    e.preventDefault();
    if (!confirmation) return;
    setPending(true);
    setError(null);
    try {
      const result = await confirmation.confirm(code);
      const idToken = await result.user.getIdToken();
      await syncSession(idToken);
      if (redirectTo) router.push(redirectTo);
      else router.refresh();
    } catch {
      setError("Invalid code. Try again.");
    } finally {
      setPending(false);
    }
  }

  if (confirmation) {
    return (
      <form onSubmit={verifyCode} className="space-y-3">
        <label className="block">
          <span className="mb-1.5 block text-xs font-medium text-ink-soft">
            Enter the code sent to +91 {phone}
          </span>
          <input
            className={inputClass}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            inputMode="numeric"
            placeholder="123456"
            required
          />
        </label>
        {error && <p className="text-xs text-red-600">{error}</p>}
        <Button type="submit" size="lg" className="w-full" disabled={pending}>
          {pending ? "Verifying…" : "Verify & Continue"}
        </Button>
      </form>
    );
  }

  return (
    <form onSubmit={sendCode} className="space-y-3">
      <label className="block">
        <span className="mb-1.5 block text-xs font-medium text-ink-soft">
          Mobile number
        </span>
        <input
          className={inputClass}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
          inputMode="numeric"
          placeholder="98765 43210"
          required
        />
      </label>
      {error && <p className="text-xs text-red-600">{error}</p>}
      <Button type="submit" size="lg" className="w-full" disabled={pending}>
        {pending ? "Sending…" : "Send Code"}
      </Button>
      <div ref={recaptchaRef} />
    </form>
  );
}
