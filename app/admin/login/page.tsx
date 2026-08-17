import { Logo } from "@/components/logo";
import { SignInPanel } from "@/components/auth/sign-in-panel";

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-paper-soft px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <Logo className="justify-center" />
          <p className="mt-1 text-[11px] font-medium tracking-[0.2em] text-ink-faint">
            ADMIN
          </p>
        </div>
        <SignInPanel title="Sign in to Katachi Admin" redirectTo="/admin" hidePhone />
      </div>
    </div>
  );
}
