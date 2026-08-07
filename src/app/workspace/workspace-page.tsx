"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Send,
  LoaderCircle,
  Plus,
  MessageSquare,
  Paperclip,
  Trash2,
  ChevronLeft,
  PanelLeft,
  Zap,
  Copy,
  Check,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/stores/auth";
import { useAIEContext } from "@/stores/context";
import { useProjects } from "@/stores/projects";
import { getAIE } from "@/lib/aie";
import { LoadingDots, EmptyState } from "@/components/common/loading-states";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://aegisforge-backend.onrender.com";

interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: Date;
}

interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export function WorkspacePage() {
  const user = useAuth((s) => s.user);
  const aieContext = useAIEContext((s) => s.context);
  const setConversation = useAIEContext((s) => s.setConversation);
  const setPage = useAIEContext((s) => s.setPage);
  const addRecentAction = useAIEContext((s) => s.addRecentAction);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeConvo = conversations.find((c) => c.id === activeId) ?? null;
  const engine = getAIE(aieContext);

  // Track context
  useEffect(() => {
    setPage("/workspace");
  }, [setPage]);

  useEffect(() => {
    setConversation(activeId);
  }, [activeId, setConversation]);

  // Get AI suggestions for the current input
  const aiSuggestions = input.length > 3 ? engine.process(input) : null;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConvo?.messages.length]);

  // Responsive sidebar: default closed on mobile
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    setSidebarOpen(!mql.matches);
    const handler = (e: MediaQueryListEvent) => setSidebarOpen(!e.matches);
    mql.addEventListener("change", handler);
    return () => mql.removeEventListener("change", handler);
  }, []);

  function createConversation() {
    const id = crypto.randomUUID();
    const convo: Conversation = {
      id,
      title: "New conversation",
      messages: [
        {
          id: crypto.randomUUID(),
          role: "system",
          content: "You're using AegisForge AI Workspace. Describe what you want to build, and I'll help you plan, architect, and generate code. Ask me anything — from system design to debugging to deployment strategies.",
          timestamp: new Date(),
        },
      ],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setConversations((prev) => [convo, ...prev]);
    setActiveId(id);
  }

  function deleteConversation(id: string) {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) {
      setActiveId(null);
    }
  }

  function copyToClipboard(text: string, msgId: string) {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(msgId);
      setTimeout(() => setCopiedId(null), 2000);
    });
  }

  async function sendMessage() {
    if (!input.trim() || loading) return;

    let convoId = activeId;
    if (!convoId) {
      const id = crypto.randomUUID();
      const convo: Conversation = {
        id,
        title: input.slice(0, 50) + (input.length > 50 ? "..." : ""),
        messages: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      setConversations((prev) => [convo, ...prev]);
      setActiveId(id);
      convoId = id;
    }

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convoId
          ? {
              ...c,
              messages: [...c.messages, userMsg],
              title: c.messages.length === 0 ? input.slice(0, 50) + (input.length > 50 ? "..." : "") : c.title,
              updatedAt: new Date(),
            }
          : c,
      ),
    );

    addRecentAction({ type: "build", label: input.slice(0, 60), timestamp: new Date(), href: "/workspace" });

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v2/nova/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: input.trim(),
          user_id: user?.id,
        }),
      });

      const data = await res.json();

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content:
          data.response ||
          data.message ||
          data.blueprint
            ? JSON.stringify(data.blueprint, null, 2)
            : "I processed your request. Let me know if you'd like me to elaborate or try a different approach.",
        timestamp: new Date(),
      };

      setConversations((prev) =>
        prev.map((c) =>
          c.id === convoId
            ? { ...c, messages: [...c.messages, assistantMsg], updatedAt: new Date() }
            : c,
        ),
      );
    } catch {
      const errorMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: "I'm having trouble connecting right now. Please try again in a moment — the server may be waking up from inactivity.",
        timestamp: new Date(),
      };
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convoId
            ? { ...c, messages: [...c.messages, errorMsg], updatedAt: new Date() }
            : c,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-[80vh]">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 256, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            className="hidden sm:flex shrink-0 overflow-hidden border-r border-white/5 bg-white/[0.02]"
          >
            <div className="flex h-full w-64 flex-col p-3">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-medium text-slate-300">Conversations</h2>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-1 text-slate-400 hover:bg-white/5 hover:text-white"
                  aria-label="Close sidebar"
                >
                  <ChevronLeft className="size-4" />
                </button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={createConversation}
                className="mb-3 gap-1.5 min-h-[40px]"
              >
                <Plus className="size-3.5" /> New Chat
              </Button>

              <div className="flex-1 space-y-1 overflow-y-auto">
                {conversations.length > 0 ? (
                  conversations.map((c) => (
                    <div
                      key={c.id}
                      className={`group flex items-center gap-2 rounded-lg px-2 py-2 text-sm transition-colors min-h-[40px] ${
                        activeId === c.id
                          ? "bg-white/10 text-white"
                          : "text-slate-400 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <button
                        onClick={() => setActiveId(c.id)}
                        className="flex min-w-0 flex-1 items-center gap-2 text-left"
                      >
                        <MessageSquare className="size-3.5 shrink-0" />
                        <span className="truncate">{c.title}</span>
                      </button>
                      <button
                        onClick={() => deleteConversation(c.id)}
                        className="shrink-0 rounded p-1 text-slate-600 opacity-0 transition-opacity hover:text-red-400 group-hover:opacity-100"
                        aria-label={`Delete conversation: ${c.title}`}
                      >
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="px-2 py-4 text-xs text-slate-600">No conversations yet</p>
                )}
              </div>

              <div className="mt-auto border-t border-white/5 pt-3 text-xs text-slate-500">
                {conversations.length} conversation{conversations.length !== 1 ? "s" : ""}
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main chat area */}
      <main className="flex flex-1 flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center gap-2 sm:gap-3 border-b border-white/5 px-3 sm:px-4 py-2.5 sm:py-3">
          {!sidebarOpen && (
            <button
              onClick={() => setSidebarOpen(true)}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
              aria-label="Open sidebar"
            >
              <PanelLeft className="size-4" />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-medium text-white truncate">
              {activeConvo?.title ?? "AI Workspace"}
            </h1>
            <p className="text-xs text-slate-500">
              {activeConvo
                ? `${activeConvo.messages.filter((m) => m.role === "user").length} messages`
                : "Start a new conversation"}
            </p>
          </div>
          <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-xs text-slate-400">
            <Paperclip className="size-3.5" /> Upload
          </Button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          {!activeConvo ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center px-4">
              <Brain className="size-12 text-cyan-400/40" />
              <div>
                <h2 className="text-lg font-medium text-white">AI Workspace</h2>
                <p className="mt-1 max-w-sm text-sm text-slate-400">
                  Describe what you want to build. Chat with AI, create projects,
                  save conversations, and iterate on your ideas.
                </p>
              </div>
              <Button variant="primary" onClick={createConversation} className="gap-2 min-h-[44px]">
                <Plus className="size-4" /> Start Conversation
              </Button>
              <div className="mt-4 grid gap-2 sm:grid-cols-2 w-full max-w-lg">
                {[
                  "Build a SaaS landing page with auth and pricing",
                  "Design a database schema for an e-commerce app",
                  "Create a REST API for a task manager",
                  "Help me debug my Next.js deployment error",
                ].map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => setInput(suggestion)}
                    className="rounded-xl border border-white/5 bg-white/[0.03] px-3 py-3 text-left text-xs text-slate-400 transition-colors hover:bg-white/[0.06] hover:text-white min-h-[44px]"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : activeConvo.messages.length === 0 ? (
            <EmptyState
              icon={MessageSquare}
              title="Start the conversation"
              description="Type your message below to begin chatting with AegisForge AI."
              action={{ label: "Send a message", onClick: () => document.querySelector<HTMLInputElement>("[data-workspace-input]")?.focus() }}
            />
          ) : (
            <div className="mx-auto max-w-3xl space-y-4">
              {activeConvo.messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`group relative max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-7 ${
                      msg.role === "user"
                        ? "bg-cyan-500/15 text-cyan-50"
                        : msg.role === "system"
                          ? "bg-white/[0.03] text-slate-400 italic"
                          : "bg-white/[0.05] text-slate-200"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="mb-1.5 flex items-center gap-1.5 text-xs text-cyan-400">
                        <Brain className="size-3" /> AegisForge AI
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{msg.content}</div>
                    <div className="mt-2 flex items-center gap-2 text-[0.6rem] text-slate-500">
                      <span>{msg.timestamp.toLocaleTimeString()}</span>
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-slate-500 hover:text-slate-300"
                          aria-label="Copy message"
                        >
                          {copiedId === msg.id ? <Check className="size-3 text-emerald-400" /> : <Copy className="size-3" />}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl bg-white/[0.05] px-4 py-3">
                    <div className="flex items-center gap-2 text-sm text-cyan-300">
                      <LoaderCircle className="size-4 animate-spin" />
                      Thinking<LoadingDots />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input with AIE suggestions */}
        <div className="border-t border-white/5 p-3 sm:p-4">
          <div className="mx-auto max-w-3xl space-y-2">
            {aiSuggestions && aiSuggestions.understood && aiSuggestions.actions.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {aiSuggestions.actions.slice(0, 3).map((action) => (
                  <button
                    key={action.id}
                    onClick={() => setInput(action.label)}
                    className="flex items-center gap-1 rounded-full border border-cyan-400/15 bg-cyan-400/5 px-2.5 py-1 text-[0.65rem] text-cyan-300 transition-colors hover:bg-cyan-400/10 min-h-[32px]"
                  >
                    <Zap className="size-2.5" />
                    {action.label}
                  </button>
                ))}
              </div>
            )}
            <div className="flex gap-2 sm:gap-3">
              <Input
                data-workspace-input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    void sendMessage();
                  }
                }}
                placeholder="Describe what you want to build..."
                disabled={loading}
                className="h-11 sm:h-12 rounded-xl bg-white/5 font-mono text-sm"
                aria-label="Chat input"
              />
              <Button
                variant="primary"
                size="lg"
                onClick={() => void sendMessage()}
                disabled={loading || !input.trim()}
                className="shrink-0"
                aria-label="Send message"
              >
                {loading ? <LoaderCircle className="size-4 animate-spin" /> : <Send className="size-4" />}
              </Button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
