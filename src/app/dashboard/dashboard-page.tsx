"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  MessageSquare,
  Clock,
  FileCode2,
  Globe,
  ChevronRight,
  LayoutDashboard,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/stores/auth";
import { useAIEContext } from "@/stores/context";
import { useProjects } from "@/stores/projects";
import { getAIE } from "@/lib/aie";
import {
  SkeletonCard,
  SkeletonRow,
  SkeletonPrompt,
  EmptyState,
  LoadingDots,
} from "@/components/common/loading-states";

const sidebarItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
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
  const recentActions = useAIEContext((s) => s.context.recentActions);
  const [prompt, setPrompt] = useState("");
  const [mounted, setMounted] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // Hydration guard
  useEffect(() => setMounted(true), []);

  const engine = getAIE(aieContext);
  const suggestions = engine.getDashboardSuggestions();
  const aiResult = prompt.length > 3 ? engine.process(prompt) : null;

  // Derived data
  const activeProjects = projects.filter((p) => p.status !== "archived");
  const deployedProjects = projects.filter((p) => p.status === "deployed");
  const lastProject = projects[0]; // Most recently updated

  // Simulated conversation history (from recent actions)
  const recentConversations = recentActions
    .filter((a) => a.type === "build" || a.type === "blueprint" || a.type === "debug")
    .slice(0, 5);

  // Active scans from recent actions
  const activeScans = recentActions.filter((a) => a.type === "scan").slice(0, 3);

  if (!mounted) {
    return (
      <div className="flex min-h-[80vh]">
        <aside className="shrink-0 border-r border-white/5 bg-white/[0.02] w-56">
          <div className="p-3 space-y-4">
            <div className="h-5 w-24 rounded bg-white/10 animate-pulse" />
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 w-full rounded-lg bg-white/5 animate-pulse" />
            ))}
          </div>
        </aside>
        <main className="flex-1 p-6 sm:p-8">
          <div className="mx-auto max-w-4xl space-y-8">
            <div className="h-8 w-48 rounded bg-white/10 animate-pulse" />
            <SkeletonPrompt />
            <div className="grid gap-3 sm:grid-cols-2">
              <SkeletonCard />
              <SkeletonCard />
            </div>
            <SkeletonRow />
            <SkeletonRow />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh]">
      {/* Sidebar */}
      <aside className="hidden sm:flex shrink-0 border-r border-white/5 bg-white/[0.02] w-56">
        <div className="flex h-full flex-col p-3">
          <div className="flex items-center gap-2 mb-4 px-2 py-2">
            <Brain className="size-4 text-cyan-400" />
            <span className="text-sm font-medium text-white">AegisForge</span>
          </div>

          <nav className="flex-1 space-y-1" aria-label="Dashboard navigation">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className="flex items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-300 transition-colors hover:bg-white/5 hover:text-white"
                  aria-label={item.label}
                >
                  <Icon className="size-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto space-y-1">
            <div className="px-2 py-2 text-xs text-slate-500 truncate" title={user?.email ?? "Not signed in"}>
              {user?.email ?? "Not signed in"}
            </div>
            <button
              onClick={() => void signOut()}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-slate-400 transition-colors hover:bg-white/5 hover:text-red-300"
              aria-label="Sign out"
            >
              <LogOut className="size-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-8">
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
                <label htmlFor="dashboard-prompt" className="sr-only">Describe what you want to build</label>
                <textarea
                  id="dashboard-prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe what you want to build... e.g. 'I want to build a fintech app'"
                  rows={3}
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/10"
                />
              </div>
              <Link href={prompt ? `/workspace?q=${encodeURIComponent(prompt)}` : "/workspace"}>
                <Button variant="primary" size="lg" className="shrink-0 gap-2" aria-label="Go to AI Workspace">
                  <Brain className="size-4" /> Go
                </Button>
              </Link>
            </div>

            {/* AIE suggestions appear as you type */}
            <AnimatePresence>
              {aiResult && aiResult.understood && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 overflow-hidden"
                >
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
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Continue where you left off */}
          {lastProject && (
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
              aria-label="Continue your work"
            >
              <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Clock className="size-4 text-cyan-400" /> Continue Where You Left Off
              </h2>
              <Link href="/workspace">
                <Card className="group flex items-center gap-4 rounded-2xl border border-cyan-400/10 bg-cyan-400/[0.03] p-5 transition-colors hover:bg-cyan-400/[0.06]">
                  <div className="flex size-11 items-center justify-center rounded-xl border border-cyan-400/15 bg-cyan-400/10">
                    <FolderKanban className="size-5 text-cyan-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-white">{lastProject.name}</p>
                    <p className="text-xs text-slate-500">
                      {lastProject.description}
                      {lastProject.domain && <> · {lastProject.domain}</>}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium ${
                      lastProject.status === "active" ? "bg-cyan-400/10 text-cyan-300" :
                      lastProject.status === "deployed" ? "bg-emerald-400/10 text-emerald-300" :
                      "bg-white/5 text-slate-400"
                    }`}>
                      {lastProject.status}
                    </span>
                    <ChevronRight className="size-4 text-slate-600 transition-transform group-hover:translate-x-1" />
                  </div>
                </Card>
              </Link>
            </motion.section>
          )}

          {/* Status alerts */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-400/5 px-4 py-2.5 text-xs text-emerald-300" role="status">
              <CheckCircle2 className="size-3.5" />
              All systems operational
            </div>
            {deployedProjects.length > 0 && (
              <div className="flex items-center gap-2 rounded-xl border border-amber-400/15 bg-amber-400/5 px-4 py-2.5 text-xs text-amber-300" role="alert">
                <AlertTriangle className="size-3.5" />
                {deployedProjects.length} deployed project{deployedProjects.length > 1 ? "s" : ""} — consider a security scan
              </div>
            )}
          </div>

          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <section className="space-y-3" aria-label="AI suggestions">
              <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Lightbulb className="size-4 text-cyan-400" /> Suggested for You
              </h2>
              <div className="grid gap-3 sm:grid-cols-2">
                {suggestions.slice(0, 4).map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link href={s.href}>
                      <Card className="group flex items-center gap-3 rounded-2xl bg-white/[0.04] p-4 transition-colors hover:bg-white/[0.07]">
                        <Zap className="size-4 shrink-0 text-cyan-400" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-white">{s.label}</p>
                          <p className="text-xs text-slate-500">{s.description}</p>
                        </div>
                        <ArrowRight className="size-3 shrink-0 text-slate-600 transition-transform group-hover:translate-x-1" />
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Recent Conversations */}
          <section className="space-y-3" aria-label="Recent conversations">
            <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <MessageSquare className="size-4" /> Recent Conversations
            </h2>
            {recentConversations.length > 0 ? (
              <div className="space-y-2">
                {recentConversations.map((c, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Link href={c.href || "/workspace"}>
                      <Card className="group flex items-center gap-3 rounded-xl bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]">
                        <MessageSquare className="size-4 text-slate-500" />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-white truncate">{c.label}</p>
                          <p className="text-xs text-slate-500">
                            {c.type} · {new Date(c.timestamp).toLocaleDateString()}
                          </p>
                        </div>
                        <ChevronRight className="size-3 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={MessageSquare}
                title="No conversations yet"
                description="Start a conversation in the AI Workspace to begin building."
                action={{ label: "Start Chat", onClick: () => window.location.href = "/workspace" }}
              />
            )}
          </section>

          {/* Active Projects */}
          <section className="space-y-3" aria-label="Active projects">
            <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
              <FolderKanban className="size-4" /> Active Projects
            </h2>
            {activeProjects.length > 0 ? (
              <div className="space-y-2">
                {activeProjects.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                  >
                    <Card className="group flex items-center justify-between rounded-xl bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-white">{p.name}</p>
                        <p className="text-xs text-slate-500">
                          {p.description}
                          {p.domain && <> · {p.domain}</>}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 ml-2">
                        <span className={`rounded-full px-2 py-0.5 text-[0.65rem] font-medium whitespace-nowrap ${
                          p.status === "active" ? "bg-cyan-400/10 text-cyan-300" :
                          p.status === "deployed" ? "bg-emerald-400/10 text-emerald-300" :
                          "bg-white/5 text-slate-400"
                        }`}>
                          {p.status}
                        </span>
                        <ArrowRight className="size-3 text-slate-600 opacity-0 transition-opacity group-hover:opacity-100" />
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <EmptyState
                icon={FolderKanban}
                title="No projects yet"
                description="Create your first project to organize your work."
                action={{ label: "Create Project", onClick: () => window.location.href = "/workspace" }}
              />
            )}
          </section>

          {/* Active Scans + Blueprint History */}
          <div className="grid gap-6 sm:grid-cols-2">
            <section className="space-y-3" aria-label="Recent scans">
              <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Shield className="size-4" /> Recent Scans
              </h2>
              {activeScans.length > 0 ? (
                <div className="space-y-2">
                  {activeScans.map((s, i) => (
                    <Card key={i} className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5 text-xs text-slate-300">
                      <Globe className="size-3.5 text-cyan-400" />
                      <span className="truncate">{s.label}</span>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
                  <Globe className="mx-auto size-5 text-slate-600 mb-2" />
                  <p className="text-xs text-slate-500">No scans yet</p>
                </div>
              )}
              <Link href="/scanner" className="block">
                <Button variant="ghost" size="sm" className="w-full gap-1.5 text-xs text-slate-400">
                  Run Scan <ArrowRight className="size-3" />
                </Button>
              </Link>
            </section>

            <section className="space-y-3" aria-label="Blueprint history">
              <h2 className="flex items-center gap-2 text-sm font-medium text-slate-300">
                <Sparkles className="size-4" /> Blueprint History
              </h2>
              {recentActions.filter((a) => a.type === "blueprint").length > 0 ? (
                <div className="space-y-2">
                  {recentActions.filter((a) => a.type === "blueprint").slice(0, 3).map((b, i) => (
                    <Card key={i} className="flex items-center gap-2 rounded-xl bg-white/[0.03] px-3 py-2.5 text-xs text-slate-300">
                      <FileCode2 className="size-3.5 text-violet-400" />
                      <span className="truncate">{b.label}</span>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-white/10 p-4 text-center">
                  <Sparkles className="mx-auto size-5 text-slate-600 mb-2" />
                  <p className="text-xs text-slate-500">No blueprints yet</p>
                </div>
              )}
              <Link href="/blueprint" className="block">
                <Button variant="ghost" size="sm" className="w-full gap-1.5 text-xs text-slate-400">
                  Generate Blueprint <ArrowRight className="size-3" />
                </Button>
              </Link>
            </section>
          </div>

          {/* Quick actions */}
          <section className="grid gap-3 sm:grid-cols-3" aria-label="Quick actions">
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
          </section>
        </div>
      </main>
    </div>
  );
}
