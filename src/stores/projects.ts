"use client";

import { create } from "zustand";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";

export interface Project {
  id: string;
  name: string;
  description: string;
  domain?: string;
  status: "active" | "draft" | "deployed" | "archived";
  createdAt: Date;
  updatedAt: Date;
  conversationIds: string[];
  fileIds: string[];
  scanIds: string[];
  blueprintId?: string;
}

interface ProjectsState {
  projects: Project[];
  loading: boolean;
  error: string | null;
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "conversationIds" | "fileIds" | "scanIds">) => Promise<string>;
  updateProject: (id: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;
  addConversationToProject: (projectId: string, conversationId: string) => void;
  addScanToProject: (projectId: string, scanId: string) => void;
  loadProjects: (userId: string) => Promise<void>;
}

// In-memory fallback seed data
const seedProjects: Project[] = [
  {
    id: "proj-1",
    name: "SaaS Landing Page",
    description: "A SaaS landing page with auth, pricing, and waitlist",
    status: "active",
    createdAt: new Date(Date.now() - 7200000),
    updatedAt: new Date(Date.now() - 3600000),
    conversationIds: [],
    fileIds: [],
    scanIds: [],
  },
  {
    id: "proj-2",
    name: "E-commerce Storefront",
    description: "Product catalog, cart, checkout with Stripe",
    status: "draft",
    createdAt: new Date(Date.now() - 86400000),
    updatedAt: new Date(Date.now() - 43200000),
    conversationIds: [],
    fileIds: [],
    scanIds: [],
  },
  {
    id: "proj-3",
    name: "Team Dashboard",
    description: "Analytics dashboard with real-time data",
    domain: "app.example.com",
    status: "deployed",
    createdAt: new Date(Date.now() - 259200000),
    updatedAt: new Date(Date.now() - 86400000),
    conversationIds: [],
    fileIds: [],
    scanIds: [],
  },
];

export const useProjects = create<ProjectsState>((set, get) => ({
  projects: seedProjects,
  loading: false,
  error: null,

  loadProjects: async (userId: string) => {
    if (!isSupabaseConfigured) return;

    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

      if (error) throw error;

      if (data && data.length > 0) {
        const projects: Project[] = data.map((row: Record<string, unknown>) => ({
          id: row.id as string,
          name: row.name as string,
          description: (row.description as string) || "",
          domain: row.domain as string | undefined,
          status: (row.status as Project["status"]) || "draft",
          createdAt: new Date(row.created_at as string),
          updatedAt: new Date(row.updated_at as string),
          conversationIds: (row.conversation_ids as string[]) || [],
          fileIds: (row.file_ids as string[]) || [],
          scanIds: (row.scan_ids as string[]) || [],
          blueprintId: row.blueprint_id as string | undefined,
        }));
        set({ projects, loading: false });
      }
    } catch (err) {
      // Silently fall back to seed data
      set({ loading: false, error: err instanceof Error ? err.message : "Failed to load projects" });
    }
  },

  addProject: async (input) => {
    const id = `proj-${crypto.randomUUID().slice(0, 8)}`;
    const now = new Date();
    const project: Project = {
      ...input,
      id,
      createdAt: now,
      updatedAt: now,
      conversationIds: [],
      fileIds: [],
      scanIds: [],
    };
    set((state) => ({ projects: [project, ...state.projects] }));

    // Persist to Supabase in background
    if (isSupabaseConfigured) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          await supabase.from("projects").insert({
            id,
            user_id: user.id,
            name: input.name,
            description: input.description,
            domain: input.domain,
            status: input.status,
          });
        }
      } catch {
        // Background save failed — data is still in memory
      }
    }

    return id;
  },

  updateProject: async (id, updates) => {
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p,
      ),
    }));

    if (isSupabaseConfigured) {
      try {
        const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
        if (updates.name !== undefined) row.name = updates.name;
        if (updates.description !== undefined) row.description = updates.description;
        if (updates.status !== undefined) row.status = updates.status;
        if (updates.domain !== undefined) row.domain = updates.domain;
        await supabase.from("projects").update(row).eq("id", id);
      } catch {
        // Background update failed
      }
    }
  },

  deleteProject: async (id) => {
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    }));

    if (isSupabaseConfigured) {
      try {
        await supabase.from("projects").delete().eq("id", id);
      } catch {
        // Background delete failed
      }
    }
  },

  addConversationToProject: (projectId, conversationId) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, conversationIds: [...p.conversationIds, conversationId], updatedAt: new Date() }
          : p,
      ),
    })),

  addScanToProject: (projectId, scanId) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === projectId
          ? { ...p, scanIds: [...p.scanIds, scanId], updatedAt: new Date() }
          : p,
      ),
    })),
}));
