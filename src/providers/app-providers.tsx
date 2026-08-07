"use client";

import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";

import { ThemeProvider } from "@/providers/theme-provider";
import { useAuth } from "@/stores/auth";
import { useProjects } from "@/stores/projects";
import { OnboardingFlow, useOnboarding } from "@/components/common/onboarding";

function AuthInitializer() {
  const initialize = useAuth((s) => s.initialize);
  const initialized = useAuth((s) => s.initialized);
  const user = useAuth((s) => s.user);
  const loadProjects = useProjects((s) => s.loadProjects);

  useEffect(() => {
    if (!initialized) {
      void initialize();
    }
  }, [initialize, initialized]);

  // Load projects once we have a user
  useEffect(() => {
    if (user?.id && initialized) {
      void loadProjects(user.id);
    }
  }, [user?.id, initialized, loadProjects]);

  return null;
}

function OnboardingManager() {
  const { showOnboarding, completeOnboarding, skipOnboarding } = useOnboarding();
  const user = useAuth((s) => s.user);

  // Only show onboarding to new signed-in users
  if (!user && showOnboarding) {
    // Not signed in — skip onboarding, show for signed-in new users only
    return null;
  }

  return (
    <AnimatePresence>
      {showOnboarding && user && (
        <OnboardingFlow onComplete={completeOnboarding} onSkip={skipOnboarding} />
      )}
    </AnimatePresence>
  );
}

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
      <AuthInitializer />
      <OnboardingManager />
      {children}
    </ThemeProvider>
  );
}
