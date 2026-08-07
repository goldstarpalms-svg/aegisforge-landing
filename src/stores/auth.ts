"use client";

import { create } from "zustand";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import type { User, Session } from "@supabase/supabase-js";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://aegisforge-backend.onrender.com";

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string, name?: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<{ error: string | null }>;
  updatePassword: (password: string) => Promise<{ error: string | null }>;
  initialize: () => Promise<void>;
}

function friendlyError(err: string): string {
  if (err.includes("Failed to fetch") || err.includes("NetworkError") || err.includes("network") || err.includes("fetch"))
    return "Could not reach AegisForge. The server may be waking up — please wait 10 seconds and try again.";
  if (err.includes("503") || err.includes("not configured"))
    return "Authentication is being set up. Please try again in a few minutes.";
  if (err.includes("unreachable") || err.includes("Name or service"))
    return "Authentication service is reconnecting. Please wait 10 seconds and try again.";
  if (err.includes("already registered") || err.includes("already exists"))
    return "An account with this email already exists. Try signing in instead.";
  if (err.includes("Invalid email or password") || err.includes("Invalid login"))
    return "Incorrect email or password. Please try again.";
  if (err.includes("Email not confirmed"))
    return "Please check your email and click the verification link before signing in.";
  if (err.includes("Password should be"))
    return "Password must be at least 8 characters long.";
  if (err.includes("rate limit"))
    return "Too many attempts. Please wait a moment and try again.";
  return err;
}

/**
 * Fetch with retry — handles Render cold starts (503, network errors)
 * Retries up to 2 times with increasing delay
 */
async function fetchWithRetry(url: string, options: RequestInit, retries = 2): Promise<Response> {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout per attempt

      const res = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeout);

      // If we get a 503 (service waking up), retry after delay
      if (res.status === 503 && attempt < retries) {
        await new Promise((r) => setTimeout(r, 5000 * (attempt + 1))); // 5s, 10s
        continue;
      }

      return res;
    } catch (e) {
      // Network error — likely cold start, retry
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, 5000 * (attempt + 1)));
        continue;
      }
      throw e;
    }
  }
  throw new Error("Failed to fetch after retries");
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  session: null,
  loading: true,
  initialized: false,

  initialize: async () => {
    if (isSupabaseConfigured) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        set({
          session,
          user: session?.user ?? null,
          loading: false,
          initialized: true,
        });

        supabase.auth.onAuthStateChange((_event, session) => {
          set({
            session,
            user: session?.user ?? null,
            loading: false,
          });
        });
        return;
      } catch {
        // Fall through
      }
    }
    set({ loading: false, initialized: true });
  },

  signUp: async (email, password, name) => {
    try {
      const res = await fetchWithRetry(`${BACKEND_URL}/auth/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name: name || undefined }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { error: friendlyError(data.detail || data.message || "Sign-up failed") };
      }

      return { error: null };
    } catch (e) {
      return { error: friendlyError(e instanceof Error ? e.message : "Unable to create account. Please try again.") };
    }
  },

  signIn: async (email, password) => {
    try {
      const res = await fetchWithRetry(`${BACKEND_URL}/auth/sign-in`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { error: friendlyError(data.detail || data.message || "Sign-in failed") };
      }

      if (isSupabaseConfigured && data.access_token) {
        const { error } = await supabase.auth.setSession({
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        if (!error) {
          const { data: { session } } = await supabase.auth.getSession();
          set({ session, user: session?.user ?? null });
        }
      } else if (data.user) {
        set({
          user: data.user as User,
          session: { access_token: data.access_token } as Session,
        });
      }

      return { error: null };
    } catch (e) {
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.auth.signInWithPassword({ email, password });
          if (!error) {
            const { data: { session } } = await supabase.auth.getSession();
            set({ session, user: session?.user ?? null });
            return { error: null };
          }
          return { error: friendlyError(error.message) };
        } catch {
          // Fall through
        }
      }
      return { error: friendlyError(e instanceof Error ? e.message : "Unable to sign in. Please try again.") };
    }
  },

  signOut: async () => {
    if (isSupabaseConfigured) {
      await supabase.auth.signOut();
    }
    set({ user: null, session: null });
  },

  resetPassword: async (email) => {
    try {
      const res = await fetchWithRetry(`${BACKEND_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        return { error: friendlyError(data.detail || data.message || "Reset request failed") };
      }

      return { error: null };
    } catch (e) {
      if (isSupabaseConfigured) {
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: `${window.location.origin}/auth/reset-password`,
          });
          return { error: error ? friendlyError(error.message) : null };
        } catch {
          // Fall through
        }
      }
      return { error: friendlyError(e instanceof Error ? e.message : "Unable to send reset link. Please try again.") };
    }
  },

  updatePassword: async (password) => {
    if (isSupabaseConfigured) {
      const { error } = await supabase.auth.updateUser({ password });
      return { error: error ? friendlyError(error.message) : null };
    }
    return { error: "Password update requires Supabase configuration. Please contact support." };
  },
}));
