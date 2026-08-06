"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { WaitlistResponse } from "@/types/waitlist";

interface WaitlistFormProps {
  compact?: boolean;
}

const initialState: WaitlistResponse = {
  ok: false,
  message: "",
};

export function WaitlistForm({ compact = false }: WaitlistFormProps) {
  const [status, setStatus] = useState<WaitlistResponse>(initialState);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setStatus(initialState);

    const payload = {
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      company: String(formData.get("company") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as WaitlistResponse;
      setStatus(result);
    } catch {
      setStatus({
        ok: false,
        message: "Something went wrong. Please try again in a moment.",
      });
    } finally {
      setLoading(false);
    }
  }

  function StatusMessage() {
    return (
      <AnimatePresence initial={false}>
        {status.message ? (
          <motion.div
            key={status.message}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
              status.ok
                ? "border-cyan-300/20 bg-cyan-400/10 text-cyan-100"
                : "border-rose-300/20 bg-rose-400/10 text-rose-100"
            }`}
          >
            {status.ok ? (
              <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
            ) : (
              <div className="mt-1 size-2 shrink-0 rounded-full bg-current" />
            )}
            <span>{status.message}</span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );
  }

  if (compact) {
    return (
      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(new FormData(event.currentTarget));
        }}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Input
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder="Enter your email"
            aria-label="Email address"
            className="h-12 rounded-full bg-white/6 px-5"
          />
          <Button
            type="submit"
            variant="primary"
            className="min-w-[10.5rem] rounded-full sm:min-w-44"
          >
            {loading ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Joining...
              </>
            ) : (
              "Join Waitlist"
            )}
          </Button>
        </div>
        <p className="text-xs tracking-[0.22em] text-slate-400 uppercase">
          Product updates · launch signals · early access
        </p>
        <StatusMessage />
      </form>
    );
  }

  return (
    <Card className="space-y-6 rounded-[2rem] bg-white/[0.05]">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-white">
          Request early access
        </h2>
        <p className="text-sm leading-7 text-slate-300">
          Tell us who you are and what kind of intelligent workflow you want
          AegisForge to unlock for you.
        </p>
      </div>

      <form
        className="space-y-4"
        onSubmit={(event) => {
          event.preventDefault();
          void handleSubmit(new FormData(event.currentTarget));
        }}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2 text-sm text-slate-200">
            <span>Full name</span>
            <Input
              name="fullName"
              autoComplete="name"
              placeholder="Ada Lovelace"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            <span>Work email</span>
            <Input
              type="email"
              name="email"
              autoComplete="email"
              required
              placeholder="you@company.com"
            />
          </label>
        </div>

        <label className="space-y-2 text-sm text-slate-200">
          <span>Company or team</span>
          <Input
            name="company"
            autoComplete="organization"
            placeholder="AegisForge Labs"
          />
        </label>

        <label className="space-y-2 text-sm text-slate-200">
          <span>What do you want AegisForge to help you do?</span>
          <textarea
            name="message"
            rows={5}
            className="text-foreground placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-[1.5rem] border border-white/10 bg-white/5 px-4 py-3 text-sm transition focus-visible:ring-2 focus-visible:outline-none"
            placeholder="Create faster, automate repetitive work, learn with more clarity, collaborate across teams..."
          />
        </label>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <LoaderCircle className="size-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Join the waitlist"
          )}
        </Button>

        <StatusMessage />
      </form>
    </Card>
  );
}
