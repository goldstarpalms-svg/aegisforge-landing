"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  LoaderCircle,
  Shield,
  Sparkles,
  Rocket,
  BarChart3,
  Wrench,
  CheckCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://aegisforge-backend.onrender.com";

const agents = [
  { id: "product", label: "Product Agent", icon: Sparkles },
  { id: "builder", label: "Builder Agent", icon: Wrench },
  { id: "security", label: "Security Agent", icon: Shield },
  { id: "deploy", label: "Deploy Agent", icon: Rocket },
  { id: "growth", label: "Growth Agent", icon: BarChart3 },
];

const terminalSteps = [
  { label: "Classifying intent...", agent: null },
  { label: "Routing to agents...", agent: null },
  { label: "Product Agent analyzing requirements", agent: "product" },
  { label: "Builder Agent generating structure", agent: "builder" },
  { label: "Security Agent checking constraints", agent: "security" },
  { label: "Deploy Agent preparing environment", agent: "deploy" },
];

interface NovaResponse {
  intent?: string;
  classification?: { category: string; confidence: number; agents: string[] };
  response?: string;
  agents_used?: string[];
  memory_stored?: boolean;
}

export function NovaPage() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<NovaResponse | null>(null);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(-1);
  const [activeAgents, setActiveAgents] = useState<Set<string>>(new Set());

  async function processPrompt() {
    if (!prompt.trim()) return;

    setLoading(true);
    setError("");
    setResult(null);
    setActiveStep(0);
    setActiveAgents(new Set());

    // Animate steps
    const stepInterval = setInterval(() => {
      setActiveStep((prev) => {
        if (prev >= terminalSteps.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        const next = prev + 1;
        const step = terminalSteps[next];
        if (step.agent) {
          setActiveAgents((prevSet) => new Set([...prevSet, step.agent!]));
        }
        return next;
      });
    }, 800);

    try {
      const res = await fetch(`${BACKEND_URL}/api/v2/nova/process`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim() }),
      });

      clearInterval(stepInterval);

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Nova processing failed (${res.status})`);
      }

      const data = await res.json();
      setResult(data);

      // Activate any agents mentioned in response
      if (data.agents_used || data.classification?.agents) {
        const used = data.agents_used || data.classification?.agents || [];
        setActiveAgents(new Set(used.map((a: string) => a.toLowerCase())));
      }
    } catch (err) {
      clearInterval(stepInterval);
      setError(err instanceof Error ? err.message : "Nova processing failed");
    } finally {
      setLoading(false);
      setActiveStep(terminalSteps.length - 1);
    }
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-slate-300">
            <Brain className="size-4" />
            Nova AI Orchestrator
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Build software with one conversation.
          </h1>
          <p className="text-lg text-slate-400">
            Describe what you want. Nova routes your intent to the right agents
            and delivers results.
          </p>
        </div>

        {/* Agent pills */}
        <div className="flex flex-wrap justify-center gap-2">
          {agents.map((agent) => {
            const Icon = agent.icon;
            const active = activeAgents.has(agent.id);
            return (
              <motion.div
                key={agent.id}
                animate={{
                  scale: active ? 1.05 : 1,
                  opacity: active ? 1 : 0.5,
                }}
                className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  active
                    ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                    : "border-white/10 bg-white/[0.03] text-slate-500"
                }`}
              >
                <Icon className="size-3" />
                {agent.label}
                {active && <CheckCircle2 className="size-3 text-cyan-400" />}
              </motion.div>
            );
          })}
        </div>

        {/* Prompt input */}
        <div className="space-y-4">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                processPrompt();
              }
            }}
            placeholder="What do you want to build? e.g. 'Build me a SaaS landing page with auth, pricing, and a waitlist'"
            rows={3}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 font-mono text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/10"
          />
          <Button
            variant="primary"
            size="lg"
            onClick={processPrompt}
            disabled={loading || !prompt.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Brain className="size-4" />
                Run Nova
              </>
            )}
          </Button>
        </div>

        {/* Terminal animation */}
        <AnimatePresence>
          {(loading || result) && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-white/10 bg-black/40 p-5 font-mono text-sm"
            >
              <div className="mb-3 flex items-center gap-2 text-xs text-slate-500">
                <div className="size-2 rounded-full bg-emerald-400" />
                aegisforge-nova
              </div>
              <div className="space-y-2">
                <div className="text-slate-400">
                  <span className="text-cyan-400">$</span> nova process
                  <span className="text-slate-500"> &apos;{prompt.slice(0, 60)}...&apos;</span>
                </div>
                {terminalSteps.map((step, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: i <= activeStep ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className={`flex items-center gap-2 ${
                      i < activeStep
                        ? "text-emerald-400"
                        : i === activeStep && loading
                          ? "text-cyan-300"
                          : "text-slate-600"
                    }`}
                  >
                    {i < activeStep ? (
                      <CheckCircle2 className="size-3 shrink-0" />
                    ) : i === activeStep && loading ? (
                      <LoaderCircle className="size-3 shrink-0 animate-spin" />
                    ) : (
                      <div className="size-3 shrink-0 rounded-full border border-slate-700" />
                    )}
                    {step.label}
                  </motion.div>
                ))}
                {result && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-2 text-emerald-400"
                  >
                    ✓ Complete
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-red-300/20 bg-red-400/10 px-5 py-4 text-sm text-red-200"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {result.classification && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <h3 className="mb-2 text-sm font-medium text-slate-300">
                    Intent Classification
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-sm text-cyan-200">
                      {result.classification.category}
                    </span>
                    <span className="rounded-full bg-white/5 px-3 py-1 text-sm text-slate-300">
                      Confidence: {Math.round(result.classification.confidence * 100)}%
                    </span>
                    {result.classification.agents?.map((a: string) => (
                      <span
                        key={a}
                        className="rounded-full bg-emerald-400/10 px-3 py-1 text-sm text-emerald-200"
                      >
                        → {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {result.response && (
                <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5">
                  <h3 className="mb-2 text-sm font-medium text-slate-300">Response</h3>
                  <p className="whitespace-pre-wrap text-sm leading-7 text-white">
                    {result.response}
                  </p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Disclaimer */}
        <p className="text-center text-xs text-slate-600">
          This is a live AI demonstration. Results may vary. Nova automatically
          selects the best agents for your request.
        </p>
      </div>
    </Container>
  );
}
