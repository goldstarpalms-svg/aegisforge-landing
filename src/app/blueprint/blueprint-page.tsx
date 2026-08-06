"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  LoaderCircle,
  Copy,
  Download,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://aegisforge-backend.onrender.com";

interface BlueprintData {
  app_name: string;
  description: string;
  target_users: string;
  core_features: string[];
  tech_stack: {
    frontend: string;
    backend: string;
    database: string;
    hosting: string;
  };
  architecture: string;
  pages: { name: string; description: string }[];
  api_endpoints: { method: string; path: string; description: string }[];
  timeline: string;
}

export function BlueprintPage() {
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [blueprint, setBlueprint] = useState<BlueprintData | null>(null);
  const [rawBlueprint, setRawBlueprint] = useState<string>("");
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(-1);

  const steps = [
    "Analyzing your idea...",
    "Identifying target users...",
    "Designing architecture...",
    "Selecting tech stack...",
    "Defining core features...",
    "Planning API endpoints...",
    "Building page structure...",
    "Creating timeline...",
  ];

  async function generateBlueprint() {
    if (!description.trim()) return;

    setLoading(true);
    setError("");
    setBlueprint(null);
    setRawBlueprint("");
    setActiveStep(0);

    try {
      const res = await fetch(`${BACKEND_URL}/ai/app-blueprint`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: description.trim() }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Blueprint generation failed (${res.status})`);
      }

      const data = await res.json();
      setRawBlueprint(JSON.stringify(data, null, 2));

      if (data.blueprint) {
        setBlueprint(data.blueprint);
      } else {
        setBlueprint(data as BlueprintData);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Blueprint generation failed");
    } finally {
      setLoading(false);
      setActiveStep(-1);
    }
  }

  function copyJSON() {
    if (rawBlueprint) {
      navigator.clipboard.writeText(rawBlueprint);
    }
  }

  function downloadJSON() {
    if (!rawBlueprint) return;
    const blob = new Blob([rawBlueprint], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `blueprint-${(blueprint?.app_name || "app").toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        {/* Header */}
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-slate-300">
            <Sparkles className="size-4" />
            AI Blueprint Engine
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Describe your idea. Get a blueprint.
          </h1>
          <p className="text-lg text-slate-400">
            AI generates a full product blueprint — architecture, features, tech
            stack, pages, and API endpoints.
          </p>
        </div>

        {/* Input */}
        <div className="space-y-4">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe the app you want to build... e.g. 'A task management app for remote teams with real-time collaboration, time tracking, and integrations with Slack and GitHub'"
            rows={4}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white placeholder:text-slate-500 focus:border-cyan-400/30 focus:outline-none focus:ring-2 focus:ring-cyan-400/10"
          />
          <Button
            variant="primary"
            size="lg"
            onClick={generateBlueprint}
            disabled={loading || !description.trim()}
            className="w-full sm:w-auto"
          >
            {loading ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="size-4" />
                Generate Blueprint
              </>
            )}
          </Button>
        </div>

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

        {/* Loading steps */}
        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              <div className="mb-4 flex items-center gap-2 text-sm text-cyan-300">
                <div className="size-2 animate-pulse rounded-full bg-cyan-400" />
                Generating your blueprint...
              </div>
              {steps.map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.4 }}
                  className={`flex items-center gap-3 rounded-lg border px-3 py-2 text-xs ${
                    i <= activeStep
                      ? "border-cyan-300/15 bg-cyan-400/5 text-cyan-200"
                      : "border-white/5 bg-white/[0.02] text-slate-600"
                  }`}
                >
                  {i <= activeStep ? (
                    <LoaderCircle className="size-3 animate-spin" />
                  ) : (
                    <div className="size-3 rounded-full border border-slate-700" />
                  )}
                  {step}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Blueprint result */}
        <AnimatePresence>
          {blueprint && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Title */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    {blueprint.app_name}
                  </h2>
                  <p className="text-sm text-slate-400">Generated by AegisForge AI</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={copyJSON} className="gap-1.5">
                    <Copy className="size-3" /> Copy
                  </Button>
                  <Button variant="secondary" size="sm" onClick={downloadJSON} className="gap-1.5">
                    <Download className="size-3" /> Download
                  </Button>
                </div>
              </div>

              {/* Description & Target */}
              <div className="grid gap-4 sm:grid-cols-2">
                <Card className="rounded-2xl bg-white/[0.05] p-5">
                  <h3 className="mb-2 text-sm font-medium text-slate-300">Description</h3>
                  <p className="text-sm text-white">{blueprint.description}</p>
                </Card>
                <Card className="rounded-2xl bg-white/[0.05] p-5">
                  <h3 className="mb-2 text-sm font-medium text-slate-300">Target Users</h3>
                  <p className="text-sm text-white">{blueprint.target_users}</p>
                </Card>
              </div>

              {/* Tech Stack */}
              {blueprint.tech_stack && (
                <Card className="rounded-2xl bg-white/[0.05] p-5">
                  <h3 className="mb-3 text-sm font-medium text-slate-300">Tech Stack</h3>
                  <div className="grid gap-3 sm:grid-cols-4">
                    {Object.entries(blueprint.tech_stack).map(([key, val]) => (
                      <div key={key}>
                        <span className="text-xs uppercase tracking-wider text-slate-500">
                          {key}
                        </span>
                        <p className="mt-1 text-sm text-white">{val}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Core Features */}
              {blueprint.core_features && (
                <Card className="rounded-2xl bg-white/[0.05] p-5">
                  <h3 className="mb-3 text-sm font-medium text-slate-300">Core Features</h3>
                  <div className="flex flex-wrap gap-2">
                    {blueprint.core_features.map((f) => (
                      <span
                        key={f}
                        className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs text-cyan-200"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </Card>
              )}

              {/* Architecture */}
              {blueprint.architecture && (
                <Card className="rounded-2xl bg-white/[0.05] p-5">
                  <h3 className="mb-2 text-sm font-medium text-slate-300">Architecture</h3>
                  <p className="text-sm leading-7 text-white">{blueprint.architecture}</p>
                </Card>
              )}

              {/* Pages */}
              {blueprint.pages && blueprint.pages.length > 0 && (
                <Card className="rounded-2xl bg-white/[0.05] p-5">
                  <h3 className="mb-3 text-sm font-medium text-slate-300">Pages</h3>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {blueprint.pages.map((p, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-white/8 bg-white/[0.03] p-3"
                      >
                        <span className="text-sm font-medium text-white">{p.name}</span>
                        <p className="mt-1 text-xs text-slate-400">{p.description}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* API Endpoints */}
              {blueprint.api_endpoints && blueprint.api_endpoints.length > 0 && (
                <Card className="rounded-2xl bg-white/[0.05] p-5">
                  <h3 className="mb-3 text-sm font-medium text-slate-300">API Endpoints</h3>
                  <div className="space-y-2">
                    {blueprint.api_endpoints.map((ep, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs"
                      >
                        <span
                          className={`shrink-0 font-mono font-bold ${
                            ep.method === "GET"
                              ? "text-emerald-400"
                              : ep.method === "POST"
                                ? "text-cyan-400"
                                : ep.method === "PUT"
                                  ? "text-amber-400"
                                  : "text-red-400"
                          }`}
                        >
                          {ep.method}
                        </span>
                        <span className="font-mono text-slate-300">{ep.path}</span>
                        <span className="text-slate-500">{ep.description}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Timeline */}
              {blueprint.timeline && (
                <Card className="rounded-2xl bg-white/[0.05] p-5">
                  <h3 className="mb-2 text-sm font-medium text-slate-300">Timeline</h3>
                  <p className="text-sm leading-7 text-white">{blueprint.timeline}</p>
                </Card>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
