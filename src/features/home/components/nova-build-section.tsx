"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  CheckCircle2,
  Sparkles,
  Wrench,
  Shield,
  Rocket,
  BarChart3,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Reveal } from "@/components/common/reveal";

const agents = [
  { id: "product", label: "Product", icon: Sparkles, color: "text-cyan-400" },
  { id: "builder", label: "Builder", icon: Wrench, color: "text-violet-400" },
  { id: "security", label: "Security", icon: Shield, color: "text-emerald-400" },
  { id: "deploy", label: "Deploy", icon: Rocket, color: "text-amber-400" },
  { id: "growth", label: "Growth", icon: BarChart3, color: "text-rose-400" },
];

const steps = [
  { text: "Analyzing request...", agent: null },
  { text: "Classifying intent → build", agent: null },
  { text: "Activating Product Agent", agent: "product" },
  { text: "Product Agent → defining requirements", agent: "product" },
  { text: "Activating Builder Agent", agent: "builder" },
  { text: "Builder Agent → generating structure", agent: "builder" },
  { text: "Activating Security Agent", agent: "security" },
  { text: "Security Agent → validating constraints", agent: "security" },
  { text: "Activating Deploy Agent", agent: "deploy" },
  { text: "Deploy Agent → preparing environment", agent: "deploy" },
  { text: "✓ Build complete. Application ready.", agent: null },
];

export function NovaBuildSection() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(-1);
  const [activeAgents, setActiveAgents] = useState<Set<string>>(new Set());

  function startDemo() {
    setIsPlaying(true);
    setCurrentStep(0);
    setActiveAgents(new Set());
  }

  useEffect(() => {
    if (!isPlaying || currentStep < 0) return;

    if (currentStep >= steps.length - 1) {
      const timer = setTimeout(() => {
        setIsPlaying(false);
      }, 2000);
      return () => clearTimeout(timer);
    }

    const timer = setTimeout(() => {
      const next = currentStep + 1;
      setCurrentStep(next);
      const step = steps[next];
      if (step.agent) {
        setActiveAgents((prev) => new Set([...prev, step.agent!]));
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep]);

  return (
    <Container>
      <Reveal>
        <section className="space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Watch AI Build an App
            </h2>
            <p className="mt-3 text-slate-400">
              You describe it. Nova routes, builds, secures, and deploys — automatically.
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
                    scale: active ? 1.08 : 1,
                    opacity: active ? 1 : 0.4,
                  }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                    active
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/5 bg-white/[0.02] text-slate-600"
                  }`}
                >
                  <Icon className={`size-3 ${active ? agent.color : ""}`} />
                  {agent.label}
                  {active && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="size-1.5 rounded-full bg-cyan-400"
                    />
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Terminal */}
          <div className="mx-auto max-w-2xl overflow-hidden rounded-2xl border border-white/10 bg-black/60">
            {/* Terminal header */}
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <div className="size-2 rounded-full bg-red-400/60" />
              <div className="size-2 rounded-full bg-amber-400/60" />
              <div className="size-2 rounded-full bg-emerald-400/60" />
              <span className="ml-2 text-xs text-slate-500">aegisforge-nova</span>
            </div>

            {/* Terminal body */}
            <div className="p-5 font-mono text-xs sm:text-sm">
              <div className="mb-2 text-slate-500">
                <span className="text-cyan-400">$</span> nova build &apos;A SaaS landing page with
                auth, pricing, and waitlist&apos;
              </div>

              {!isPlaying && currentStep === -1 && (
                <div className="py-4 text-center text-slate-600">
                  Press play to see the demo
                </div>
              )}

              <AnimatePresence>
                {steps.map((step, i) => {
                  if (i > currentStep) return null;
                  const done = i < currentStep;
                  const isCurrent = i === currentStep && isPlaying;
                  const isComplete = i === steps.length - 1 && !isPlaying && currentStep >= steps.length - 1;

                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className={`flex items-center gap-2 py-0.5 ${
                        isComplete
                          ? "text-emerald-400"
                          : done
                            ? "text-slate-400"
                            : isCurrent
                              ? "text-cyan-300"
                              : "text-slate-600"
                      }`}
                    >
                      {done || isComplete ? (
                        <CheckCircle2 className="size-3 shrink-0" />
                      ) : isCurrent ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                          className="size-3 shrink-0 rounded-full border border-cyan-400 border-t-transparent"
                        />
                      ) : (
                        <div className="size-3 shrink-0 rounded-full border border-slate-700" />
                      )}
                      {step.text}
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Play button */}
          <div className="text-center">
            <Button
              variant="primary"
              size="lg"
              onClick={startDemo}
              disabled={isPlaying}
              className="gap-2"
            >
              <Brain className="size-4" />
              {isPlaying ? "Building..." : "Run Demo"}
            </Button>
          </div>

          {/* Disclaimer */}
          <p className="text-center text-xs text-slate-600">
            This is an animated demonstration. In production, Nova processes real
            requests through 5 AI agents.
          </p>
        </section>
      </Reveal>
    </Container>
  );
}
