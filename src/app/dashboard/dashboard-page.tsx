"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Shield,
  Sparkles,
  FolderKanban,
  Clock,
  ArrowRight,
  Settings,
  LogOut,
  Home,
  Rocket,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/stores/auth";

const sidebarItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Brain, label: "AI Workspace", href: "/workspace" },
  { icon: FolderKanban, label: "Projects", href: "/dashboard" },
  { icon: Shield, label: "Security", href: "/scanner" },
  { icon: Rocket, label: "Deployments", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard" },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

const recentProjects = [
  { name: "SaaS Landing Page", status: "Active", date: "2 hours ago" },
  { name: "E-commerce Storefront", status: "Draft", date: "Yesterday" },
  { name: "Team Dashboard", status: "Deployed", date: "3 days ago" },
];

const recentConversations = [
  { title: "Build an auth system with Next.js", time: "10 min ago" },
  { title: "Design a pricing page layout", time: "1 hour ago" },
  { title: "Secure my API endpoints", time: "Yesterday" },
];

export function DashboardPage() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [prompt, setPrompt] = useState("");

  return (
    <div className="flex min-h-[80vh]">
      {/* Sidebar */}
      <aside className={`shrink-0 border-r border-white/5 bg-white/[0.02] transition-all ${sidebarOpen ? "w-56" : "w-16"}`}>
        <div className="flex h-full flex-col p-3">
          {/* Toggle */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="mb-4 flex items-center gap-2 rounded-lg px-2 py-2 text-xs text-slate-400 hover:bg-white/5"
          >
            <Brain className="size-4 shrink-0 text-cyan-400" />
            {sidebarOpen && <span className="font-medium text-white">AegisForge</span>}
          </button>

          {/* Nav */}
          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Icon className="size-4 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </nav>

          {/* User */}
          <div className="mt-auto space-y-1">
            {sidebarOpen && (
              <div className="px-2 py-2 text-xs text-slate-500">
                {user?.email ?? "Not signed in"}
              </div>
            )}
            <button
              onClick={() => void signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-red-300"
            >
              <LogOut className="size-4 shrink-0" />
              {sidebarOpen && <span>Sign Out</span>}
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-6 sm:p-8">
        <div className="mx-auto max-w-4xl space-y-8">
          {/* Welcome */}
          <div>
            <h1 className="text-2xl font-semibold text-white">
              {user ? `Welcome, ${user.user_metadata?.full_name || "back"}` : "Dashboard"}
            </h1>
            <p className="mt-1 text-sm text-slate-400">What do you want to build today?</p>
          </div>

          {/* Nova prompt */}
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe what you want to build... e.g. 'A project management app with kanban boards, time tracking, and team chat'"
              rows={3}
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/10"
            />
            <Link href={prompt ? `/workspace?q=${encodeURIComponent(prompt)}` : "/workspace"}>
              <Button variant="primary" size="sm" className="absolute bottom-4 right-4 gap-1.5">
                <Brain className="size-3.5" /> Build
              </Button>
            </Link>
          </div>

          {/* Quick actions */}
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/scanner">
              <Card className="group flex items-center gap-3 rounded-2xl bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.07]">
                <Shield className="size-5 text-cyan-400" />
                <div>
                  <p className="text-sm font-medium text-white">Scan a Domain</p>
                  <p className="text-xs text-slate-500">Security analysis</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-slate-600 transition-transform group-hover:translate-x-1" />
              </Card>
            </Link>
            <Link href="/blueprint">
              <Card className="group flex items-center gap-3 rounded-2xl bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.07]">
                <Sparkles className="size-5 text-violet-400" />
                <div>
                  <p className="text-sm font-medium text-white">Generate Blueprint</p>
                  <p className="text-xs text-slate-500">AI-powered planning</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-slate-600 transition-transform group-hover:translate-x-1" />
              </Card>
            </Link>
            <Link href="/workspace">
              <Card className="group flex items-center gap-3 rounded-2xl bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.07]">
                <Brain className="size-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-medium text-white">AI Workspace</p>
                  <p className="text-xs text-slate-500">Chat & build</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-slate-600 transition-transform group-hover:translate-x-1" />
              </Card>
            </Link>
          </div>

          {/* Recent activity */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Projects */}
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <FolderKanban className="size-4" /> Recent Projects
              </h2>
              {recentProjects.map((p) => (
                <Card key={p.name} className="flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3">
                  <div>
                    <p className="text-sm text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.date}</p>
                  </div>
                  <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                    p.status === "Active" ? "bg-cyan-400/10 text-cyan-300" :
                    p.status === "Deployed" ? "bg-emerald-400/10 text-emerald-300" :
                    "bg-white/5 text-slate-400"
                  }`}>
                    {p.status}
                  </span>
                </Card>
              ))}
            </div>

            {/* Conversations */}
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Brain className="size-4" /> Recent Conversations
              </h2>
              {recentConversations.map((c) => (
                <Link key={c.title} href="/workspace">
                  <Card className="group flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]">
                    <Clock className="size-4 shrink-0 text-slate-500" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm text-white">{c.title}</p>
                      <p className="text-xs text-slate-500">{c.time}</p>
                    </div>
                    <ArrowRight className="size-3 shrink-0 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
