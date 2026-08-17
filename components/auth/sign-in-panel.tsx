"use client";

import { useAuth } from "@/lib/auth-context";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PhoneSignInForm } from "@/components/auth/phone-sign-in-form";

export function SignInPanel({
  title = "Sign in to continue",
  redirectTo,
  hidePhone = false,
}: {
  title?: string;
  redirectTo?: string;
  hidePhone?: boolean;
}) {
  const { configured } = useAuth();

  if (!configured) {
    return (
      <div className="rounded-[var(--radius-card)] bg-navy-50 px-6 py-8 text-center text-sm text-ink-soft">
        Sign-in isn't configured yet — Google and phone sign-in will appear
        here once Firebase credentials are added.
      </div>
    );
  }

  return (
    <div className="rounded-[var(--radius-card)] border border-line p-6">
      <h3 className="text-sm font-semibold text-ink">{title}</h3>
      <div className="mt-4">
        <GoogleSignInButton redirectTo={redirectTo} />
      </div>
      {!hidePhone && (
        <>
          <div className="my-6 flex items-center gap-3 text-xs text-ink-faint">
            <div className="h-px flex-1 bg-line" />
            OR
            <div className="h-px flex-1 bg-line" />
          </div>
          <PhoneSignInForm redirectTo={redirectTo} />
        </>
      )}
    </div>
  );
}
