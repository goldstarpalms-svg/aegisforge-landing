"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Globe,
  Sparkles,
  Brain,
  Shield,
  FileText,
  Mail,
  ArrowRight,
} from "lucide-react";

interface Command {
  id: string;
  label: string;
  shortcut?: string;
  icon: React.ElementType;
  href?: string;
  action?: () => void;
  category: string;
}

const commands: Command[] = [
  { id: "scanner", label: "Open Security Scanner", shortcut: "S", icon: Shield, href: "/scanner", category: "Features" },
  { id: "blueprint", label: "Open Blueprint Engine", icon: Sparkles, href: "/blueprint", category: "Features" },
  { id: "nova", label: "Open Nova Orchestrator", icon: Brain, href: "/nova", category: "Features" },
  { id: "home", label: "Go to Home", icon: Search, href: "/", category: "Navigate" },
  { id: "vision", label: "Go to Vision", icon: FileText, href: "/vision", category: "Navigate" },
  { id: "technology", label: "Go to Technology", icon: Globe, href: "/technology", category: "Navigate" },
  { id: "roadmap", label: "Go to Roadmap", icon: ArrowRight, href: "/roadmap", category: "Navigate" },
  { id: "waitlist", label: "Join Waitlist", shortcut: "W", icon: Mail, href: "/waitlist", category: "Action" },
];

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase()),
  );

  const openPalette = useCallback(() => {
    setOpen(true);
    setQuery("");
    setSelectedIndex(0);
  }, []);

  const closePalette = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) closePalette();
        else openPalette();
      }

      if (e.key === "/" && !e.metaKey && !e.ctrlKey) {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") return;
        e.preventDefault();
        openPalette();
      }

      if (!open) return;

      if (e.key === "Escape") {
        closePalette();
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
        if (cmd.href) {
          window.location.href = cmd.href;
        } else if (cmd.action) {
          cmd.action();
        }
        closePalette();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, filtered, selectedIndex, openPalette, closePalette]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closePalette}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
          />

          {/* Palette */}
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.15 }}
            className="fixed left-1/2 top-[20%] z-50 w-full max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-xl"
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b border-white/5 px-4 py-3">
              <Search className="size-4 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setSelectedIndex(0);
                }}
                placeholder="Type a command or search..."
                autoFocus
                className="flex-1 bg-transparent text-sm text-white placeholder:text-slate-500 focus:outline-none"
              />
              <kbd className="rounded border border-white/10 px-1.5 py-0.5 text-[0.65rem] text-slate-500">
                esc
              </kbd>
            </div>

            {/* Commands */}
            <div className="max-h-72 overflow-y-auto p-2">
              {filtered.length === 0 ? (
                <div className="px-4 py-8 text-center text-sm text-slate-500">
                  No commands found
                </div>
              ) : (
                <>
                  {["Features", "Navigate", "Action"].map((category) => {
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
                                if (cmd.href) window.location.href = cmd.href;
                                else if (cmd.action) cmd.action();
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
                <kbd className="rounded border border-white/10 px-1">esc</kbd> close
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
