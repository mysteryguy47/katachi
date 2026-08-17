"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { onAuthStateChanged, signOut as firebaseSignOut, type User } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase/client";
import { clearClientSession } from "@/lib/auth/sync-session";

type AuthContextValue = {
  user: User | null;
  loading: boolean;
  configured: boolean;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({
  user: null,
  loading: false,
  configured: false,
  signOut: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(isFirebaseConfigured);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }
    return onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
  }, []);

  async function signOut() {
    if (auth) await firebaseSignOut(auth);
    await clearClientSession();
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, configured: isFirebaseConfigured, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
