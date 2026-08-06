"use client";

import { useState } from "react";
import Link from "next/link";
import {
  Brain,
  Shield,
  Sparkles,
  FolderKanban,
  ArrowRight,
  Settings,
  LogOut,
  Home,
  Rocket,
  BarChart3,
  AlertTriangle,
  CheckCircle2,
  Zap,
  Lightbulb,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/stores/auth";
import { useAIEContext } from "@/stores/context";
import { useProjects } from "@/stores/projects";
import { getAIE } from "@/lib/aie";

const sidebarItems = [
  { icon: Home, label: "Home", href: "/dashboard" },
  { icon: Brain, label: "AI Workspace", href: "/workspace" },
  { icon: FolderKanban, label: "Projects", href: "/dashboard" },
  { icon: Shield, label: "Security", href: "/scanner" },
  { icon: Rocket, label: "Deployments", href: "/dashboard" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard" },
  { icon: Settings, label: "Settings", href: "/dashboard" },
];

export function DashboardPage() {
  const user = useAuth((s) => s.user);
  const signOut = useAuth((s) => s.signOut);
  const aieContext = useAIEContext((s) => s.context);
  const projects = useProjects((s) => s.projects);
  const [prompt, setPrompt] = useState("");

  const engine = getAIE(aieContext);
  const suggestions = engine.getDashboardSuggestions();
  const aiResult = prompt.length > 3 ? engine.process(prompt) : null;

  return (
    <div className="flex min-h-[80vh]">
      {/* Sidebar */}
      <aside className="shrink-0 border-r border-white/5 bg-white/[0.02] w-56">
        <div className="flex h-full flex-col p-3">
          <div className="flex items-center gap-2 mb-4 px-2 py-2">
            <Brain className="size-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">AegisForge</span>
          </div>

          <nav className="flex-1 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-1">
            <div className="px-2 py-2 text-xs text-slate-500">
              {user?.email ?? "Not signed in"}
            </div>
            <button
              onClick={() => void signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-red-300"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
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

          {/* Smart prompt with AIE */}
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="flex-1">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to build... e.g. 'I want to build a fintech app'"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>
              <Link href={prompt ? `/workspace?q=${encodeURIComponent(prompt)}` : "/workspace"}>
                <Button variant="primary" size="lg" className="shrink-0 gap-2">
                  <Brain className="size-4" /> Go
                </Button>
              </Link>
            </div>

            {/* AIE suggestions appear as you type */}
            {aiResult && aiResult.understood && (
              <div className="space-y-2">
                <p className="text-xs text-cyan-300">
                  <Lightbulb className="inline size-3 mr-1" />
                  {aiResult.reply}
                </p>
                <div className="flex flex-wrap gap-2">
                  {aiResult.actions.slice(0, 3).map((action) => (
                    <Link key={action.id} href={action.href}>
                      <button className="flex items-center gap-1.5 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-3 py-1.5 text-xs text-cyan-200 transition-colors hover:bg-cyan-400/10">
                        <Zap className="size-3" />
                        {action.label}
                        {action.auto && <span className="ml-1 text-[0.55rem] text-cyan-400">auto</span>}
                      </button>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status alerts */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-2.5 text-xs text-emerald-300">
              <CheckCircle2 className="size-3.5" />
              All systems operational
            </div>
            {projects.filter((p) => p.status === "deployed" && p.domain).length > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-2.5 text-xs text-amber-300">
                <AlertTriangle className="size-3.5" />
                {projects.filter((p) => p.status === "deployed").length} deployed project(s) — consider a security scan
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="space-y-3">
              <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Lightbulb className="size-4 text-cyan-400" /> Suggested for You
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {suggestions.slice(0, 4).map((s) => (
                  <Link key={s.id} href={s.href}>
                    <Card className="group flex items-center gap-3 rounded-2xl bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.07]">
                      <Zap className="size-4 shrink-0 text-cyan-400" />
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-white">{s.label}</p>
                        <p className="text-xs text-slate-500">{s.description}</p>
                      </div>
                      <ArrowRight className="size-3 shrink-0 text-slate-600 transition-transform group-hover:translate-x-1" />
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Active Projects */}
          <div className="space-y-3">
            <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FolderKanban className="size-4" /> Active Projects
            </h2>
            <div className="space-y-2">
              {projects.filter((p) => p.status !== "archived").map((p) => (
                <Card key={p.id} className="group flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]">
                  <div>
                    <p className="text-sm text-white">{p.name}</p>
                    <p className="text-xs text-slate-500">
                      {p.description}
                      {p.domain && <> &middot; {p.domain}</>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                      p.status === "active" ? "bg-cyan-400/10 text-cyan-300" :
                      p.status === "deployed" ? "bg-emerald-400/10 text-emerald-300" :
                      "bg-white/5 text-slate-400"
                    }`}>
                      {p.status}
                    </span>
                    <ArrowRight className="size-3 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                </Card>
              ))}
            </div>
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
                  <p className="text-xs text-slate-500">Chat &amp; build</p>
                </div>
                <ArrowRight className="ml-auto size-4 text-slate-600 transition-transform group-hover:translate-x-1" />
              </Card>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
