"use client";

import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  firebaseConfig.apiKey && firebaseConfig.projectId && firebaseConfig.appId,
);

// Guarded: initializing with empty config would throw and take the whole
// app down. Auth-dependent UI checks isFirebaseConfigured before touching
// `auth` (see lib/auth-context.tsx).
const app = isFirebaseConfigured
  ? getApps()[0] ?? initializeApp(firebaseConfig)
  : undefined;

export const auth = app ? getAuth(app) : undefined;
