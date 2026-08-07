"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AIEContext, RecentAction, UserPreferences } from "@/lib/aie";

interface ContextState {
  context: AIEContext;
  setPage: (page: string) => void;
  setProject: (id: string | null) => void;
  setConversation: (id: string | null) => void;
  addRecentAction: (action: RecentAction) => void;
  updatePreferences: (prefs: Partial<UserPreferences>) => void;
  updateContext: (partial: Partial<AIEContext>) => void;
  clearContext: () => void;
}

const defaultContext: AIEContext = {
  currentPage: "",
  currentProjectId: null,
  currentConversationId: null,
  openFileIds: [],
  recentActions: [],
  userPreferences: {
    frequentModules: [],
  },
};

export const useAIEContext = create<ContextState>()(
  persist(
    (set) => ({
      context: defaultContext,

      setPage: (page) =>
        set((state) => ({
          context: { ...state.context, currentPage: page },
        })),

      setProject: (id) =>
        set((state) => ({
          context: { ...state.context, currentProjectId: id },
        })),

      setConversation: (id) =>
        set((state) => ({
          context: { ...state.context, currentConversationId: id },
        })),

      addRecentAction: (action) =>
        set((state) => ({
          context: {
            ...state.context,
            recentActions: [action, ...state.context.recentActions].slice(0, 50),
          },
        })),

      updatePreferences: (prefs) =>
        set((state) => ({
          context: {
            ...state.context,
            userPreferences: { ...state.context.userPreferences, ...prefs },
          },
        })),

      updateContext: (partial) =>
        set((state) => ({
          context: { ...state.context, ...partial },
        })),

      clearContext: () =>
        set({ context: defaultContext }),
    }),
    {
      name: "aegisforge-context",
      // Only persist these fields
      partialize: (state) => ({
        context: {
          recentActions: state.context.recentActions.slice(0, 20),
          userPreferences: state.context.userPreferences,
        },
      }),
    }
  )
);
