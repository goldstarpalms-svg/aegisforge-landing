"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain,
  Shield,
  Sparkles,
  FolderKanban,
  ArrowRight,
  SkipForward,
  CheckCircle2,
  Rocket,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const steps = [
  {
    id: "welcome",
    icon: Rocket,
    title: "Welcome to AegisForge",
    subtitle: "Your AI software company — let's get you set up in under 3 minutes.",
    description:
      "AegisForge turns ideas into live applications. You'll learn the three core tools: AI Workspace, Security Scanner, and Blueprint Engine.",
  },
  {
    id: "workspace",
    icon: Brain,
    title: "AI Workspace",
    subtitle: "Your center for building with AI.",
    description:
      "Describe what you want to build in plain English. The AI understands intent, suggests architectures, writes code, and iterates with you. Think of it as pair programming with an expert.",
    action: { label: "Try AI Workspace", href: "/workspace" },
  },
  {
    id: "scanner",
    icon: Shield,
    title: "Security Scanner",
    subtitle: "Enterprise-grade security analysis in seconds.",
    description:
      "Enter any domain and get a comprehensive security report: HTTPS, headers, SSL, DNS, cookies, CDN detection — 12 concurrent checks with weighted scoring and confidence levels.",
    action: { label: "Try Scanner", href: "/scanner" },
  },
  {
    id: "blueprint",
    icon: Sparkles,
    title: "Blueprint Engine",
    subtitle: "From idea to architecture in one prompt.",
    description:
      "Describe your application and the AI generates a complete blueprint: tech stack, pages, API design, database schema, and deployment plan. Build with confidence.",
    action: { label: "Try Blueprint", href: "/blueprint" },
  },
  {
    id: "project",
    icon: FolderKanban,
    title: "Create Your First Project",
    subtitle: "Tie it all together.",
    description:
      "Projects organize your work — link conversations, scans, and blueprints in one place. Track status from draft to deployed. Let's create your first one.",
    action: { label: "Go to Dashboard", href: "/dashboard" },
  },
];

interface OnboardingProps {
  onComplete: () => void;
  onSkip: () => void;
}

export function OnboardingFlow({ onComplete, onSkip }: OnboardingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;
  const isLast = currentStep === steps.length - 1;

  function next() {
    setCompletedSteps((prev) => new Set([...prev, step.id]));
    if (isLast) {
      onComplete();
    } else {
      setCurrentStep((i) => i + 1);
    }
  }

  function skip() {
    onSkip();
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-lg px-4"
      >
        <Card className="relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-0 backdrop-blur-xl">
          {/* Progress bar */}
          <div className="h-1 w-full bg-white/5">
            <motion.div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            />
          </div>

          <div className="p-8 sm:p-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={step.id}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Step indicator */}
                <div className="flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Step {currentStep + 1} of {steps.length}
                  </span>
                  <button
                    onClick={skip}
                    className="flex items-center gap-1 text-xs text-slate-500 transition-colors hover:text-slate-300"
                  >
                    Skip <SkipForward className="size-3" />
                  </button>
                </div>

                {/* Icon */}
                <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.06]">
                  <step.icon className="size-7 text-cyan-400" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">{step.title}</h2>
                  <p className="text-sm font-medium text-cyan-300">{step.subtitle}</p>
                  <p className="text-sm leading-7 text-slate-400">{step.description}</p>
                </div>

                {/* Step dots */}
                <div className="flex gap-2">
                  {steps.map((s, i) => (
                    <div
                      key={s.id}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === currentStep
                          ? "w-6 bg-cyan-400"
                          : completedSteps.has(s.id)
                            ? "w-3 bg-cyan-400/40"
                            : "w-3 bg-white/10"
                      }`}
                    />
                  ))}
                </div>

                {/* Action */}
                <div className="flex items-center gap-3">
                  {step.action ? (
                    <Link href={step.action.href} onClick={next}>
                      <Button variant="primary" size="lg" className="gap-2">
                        {step.action.label}
                        <ArrowRight className="size-4" />
                      </Button>
                    </Link>
                  ) : (
                    <Button variant="primary" size="lg" onClick={next} className="gap-2">
                      Get Started
                      <ArrowRight className="size-4" />
                    </Button>
                  )}

                  {!isLast && (
                    <Button variant="ghost" size="lg" onClick={next} className="text-slate-400">
                      Next
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Card>
      </motion.div>
    </div>
  );
}

/** Hook to manage onboarding state */
export function useOnboarding() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const seen = localStorage.getItem("aegisforge_onboarding_seen");
    if (!seen) {
      // Show onboarding after a short delay for page to load
      const timer = setTimeout(() => setShowOnboarding(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  function completeOnboarding() {
    localStorage.setItem("aegisforge_onboarding_seen", "true");
    setShowOnboarding(false);
    setDismissed(true);
  }

  function skipOnboarding() {
    localStorage.setItem("aegisforge_onboarding_seen", "skipped");
    setShowOnboarding(false);
    setDismissed(true);
  }

  function resetOnboarding() {
    localStorage.removeItem("aegisforge_onboarding_seen");
    setShowOnboarding(true);
  }

  return { showOnboarding, completeOnboarding, skipOnboarding, resetOnboarding, dismissed };
}
