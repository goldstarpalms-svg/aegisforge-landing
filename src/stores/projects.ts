"use client";

import { create } from "zustand";

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
  addProject: (project: Omit<Project, "id" | "createdAt" | "updatedAt" | "conversationIds" | "fileIds" | "scanIds">) => string;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  addConversationToProject: (projectId: string, conversationId: string) => void;
  addScanToProject: (projectId: string, scanId: string) => void;
}

export const useProjects = create<ProjectsState>((set) => ({
  projects: [
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
  ],

  addProject: (input) => {
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
    return id;
  },

  updateProject: (id, updates) =>
    set((state) => ({
      projects: state.projects.map((p) =>
        p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p,
      ),
    })),

  deleteProject: (id) =>
    set((state) => ({
      projects: state.projects.filter((p) => p.id !== id),
    })),

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
