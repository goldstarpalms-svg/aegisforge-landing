"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Sparkles,
  Brain,
  Shield,
  FolderKanban,
  Rocket,
  BarChart3,
  MessageSquare,
  Home,
  Zap,
} from "lucide-react";

import { useAIEContext } from "@/stores/context";
import { useProjects } from "@/stores/projects";
import { getAIE } from "@/lib/aie";

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  category: string;
  context?: string;
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mode, setMode] = useState<"nav" | "ai">("nav");

  const aieContext = useAIEContext((s) => s.context);
  const projects = useProjects((s) => s.projects);

  const engine = getAIE(aieContext);

  // Build commands dynamically
  const allCommands: Command[] = [
    // AI Commands
    {
      id: "ai-build",
      label: "AI: Build something...",
      shortcut: "B",
      icon: Zap,
      category: "AI",
      action: () => { setMode("ai"); setQuery(""); },
    },
    // Pages
    { id: "workspace", label: "AI Workspace", icon: Brain, href: "/workspace", category: "Modules" },
    { id: "scanner", label: "Security Scanner", shortcut: "S", icon: Shield, href: "/scanner", category: "Modules" },
    { id: "blueprint", label: "Blueprint Engine", icon: Sparkles, href: "/blueprint", category: "Modules" },
    { id: "nova", label: "Nova Orchestrator", icon: Brain, href: "/nova", category: "Modules" },
    { id: "dashboard", label: "Dashboard", icon: Home, href: "/dashboard", category: "Navigate" },
    { id: "vision", label: "Vision", icon: Globe, href: "/vision", category: "Navigate" },
    { id: "roadmap", label: "Roadmap", icon: Rocket, href: "/roadmap", category: "Navigate" },
    { id: "technology", label: "Technology", icon: BarChart3, href: "/technology", category: "Navigate" },
    { id: "faq", label: "FAQ", icon: Search, href: "/faq", category: "Navigate" },
    { id: "waitlist", label: "Join Waitlist", shortcut: "W", icon: MessageSquare, href: "/waitlist", category: "Action" },
    // Projects
    ...projects.map((p) => ({
      id: `project-${p.id}`,
      label: `Project: ${p.name}`,
      icon: FolderKanban,
      href: "/workspace",
      category: "Projects",
      context: p.status,
    })),
  ];

  // If in AI mode and user typed something, generate AI suggestions
  const aiResults = mode === "ai" && query.length > 2 ? engine.process(query) : null;

  const aiCommands: Command[] = aiResults
    ? aiResults.actions.map((a) => ({
        id: a.id,
        label: a.label,
        icon: Zap,
        href: a.href,
        category: "AI Suggests",
      }))
    : [];

  const commands = mode === "ai" ? aiCommands : allCommands;

  const filtered = query && mode === "nav"
    ? commands.filter((cmd) =>
        cmd.label.toLowerCase().includes(query.toLowerCase()),
      )
    : commands;

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
    setMode("nav");
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
    setMode("nav");
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
      }

      if (e.key === "/" && !e.metaKey && !e.ctrlKey && !open) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        openPalette();
      }

      if (!open) return;

      if (e.key === "Escape") {
        if (mode === "ai") { setMode("nav"); setQuery(""); }
        else closePalette();
        return;
      }

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.min(prev + 1, filtered.length - 1));
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => Math.max(prev - 1, 0));
      }

      if (e.key === "Enter" && filtered[selectedIndex]) {
        e.preventDefault();
        const cmd = filtered[selectedIndex];
        if (cmd.action) cmd.action();
        else if (cmd.href) window.location.href = cmd.href;
        closePalette();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, selectedIndex, mode, openPalette, closePalette]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[18%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Search */}
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
              {mode === "ai" ? (
                <Zap className="size-4 text-cyan-400" />
              ) : (
                <Search className="size-4 text-slate-400" />
              )}
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder={mode === "ai" ? "Tell AI what you want to do..." : "Search projects, pages, or type a command..."}
                autoFocus
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              {mode === "ai" && (
                <span className="rounded-full bg-cyan-400/10 px-2 py-0.5 text-[0.6rem] text-cyan-300">AI</span>
              )}
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[0.65rem] text-slate-500">
                esc
              </kbd>
            </div>

            {/* AI response */}
            {aiResults && mode === "ai" && (
              <div className="border-b border-white/5 px-4 py-3">
                <p className="text-xs text-slate-300">{aiResults.reply}</p>
              </div>
            )}

            {/* Results */}
            <div className="max-h-64 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-6 text-center text-sm text-slate-500">
                  {mode === "ai" ? "Type what you want to do..." : "No results found"}
                </div>
              ) : (
                <>
                  {["AI Suggests", "AI", "Modules", "Navigate", "Projects", "Action"].map((category) => {
                    const items = filtered.filter((c) => c.category === category);
                    if (items.length === 0) return null;
                    return (
                      <div key={category}>
                        <div className="px-2 py-1 text-[0.65rem] uppercase tracking-wider text-slate-500">
                          {category}
                        </div>
                        {items.map((cmd) => {
                          const Icon = cmd.icon;
                          const globalIndex = filtered.indexOf(cmd);
                          const isSelected = globalIndex === selectedIndex;
                          return (
                            <button
                              key={cmd.id}
                              onMouseEnter={() => setSelectedIndex(globalIndex)}
                              onClick={() => {
                                if (cmd.action) cmd.action();
                                else if (cmd.href) window.location.href = cmd.href;
                                closePalette();
                              }}
                              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                                isSelected
                                  ? "bg-white/10 text-white"
                                  : "text-slate-300 hover:bg-white/5"
                              }`}
                            >
                              <Icon className="size-4 shrink-0 text-slate-400" />
                              <span className="flex-1 text-left">{cmd.label}</span>
                              {cmd.shortcut && (
                                <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[0.6rem] text-slate-500">
                                  {cmd.shortcut}
                                </kbd>
                              )}
                              {cmd.context && (
                                <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[0.55rem] text-slate-500">
                                  {cmd.context}
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    );
                  })}
                </>
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center gap-4 border-t border-white/5 px-4 py-2 text-[0.65rem] text-slate-500">
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/10 px-1">↑↓</kbd> navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/10 px-1">↵</kbd> open
              </span>
              <span className="flex items-center gap-1">
                <kbd className="rounded border border-white/10 px-1">B</kbd> AI mode
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
