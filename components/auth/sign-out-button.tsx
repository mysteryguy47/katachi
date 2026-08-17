"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import { useAuth } from "@/lib/auth-context";

export function SignOutButton() {
  const router = useRouter();
  const { signOut } = useAuth();

  return (
    <button
      onClick={async () => {
        await signOut();
        router.push("/admin/login");
        router.refresh();
      }}
      className="flex items-center gap-2 text-sm text-ink-faint hover:text-ink"
    >
      <LogOut className="h-4 w-4" />
      Sign out
    </button>
  );
}
