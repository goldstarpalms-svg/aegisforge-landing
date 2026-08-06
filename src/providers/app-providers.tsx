"use client";

import { useEffect } from "react";
import type { ReactNode } from "react";

import { ThemeProvider } from "@/providers/theme-provider";
import { useAuth } from "@/stores/auth";

function AuthInitializer() {
  const initialize = useAuth((s) => s.initialize);
  const initialized = useAuth((s) => s.initialized);

  useEffect(() => {
    if (!initialized) {
      void initialize();
    }
  }, [initialize, initialized]);

  return null;
}

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthInitializer />
      {children}
    </ThemeProvider>
  );
}
