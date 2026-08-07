"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { LoaderCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/stores/auth";

export function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const resetPassword = useAuth((s) => s.resetPassword);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await resetPassword(email);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      setSent(true);
      setLoading(false);
    }
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-8 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        {sent ? (
          <div className="space-y-4 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", duration: 0.6 }}
            >
              <CheckCircle2 className="mx-auto size-10 text-cyan-400" />
            </motion.div>
            <h1 className="text-2xl font-semibold text-white">Check your email</h1>
            <p className="text-sm text-slate-400">
              We sent a password reset link to <span className="text-white font-medium">{email}</span>.
            </p>
            <Link href="/auth/sign-in">
              <Button variant="primary" className="mt-4">Back to Sign In</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold text-white">Reset your password</h1>
              <p className="text-sm text-slate-400">Enter your email and we&apos;ll send a reset link</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="space-y-2 text-sm text-slate-200" htmlFor="reset-email">
                Email
                <Input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  className="h-11 rounded-xl bg-white/5"
                />
              </label>

              <AnimatePresence>
                {error && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="text-sm text-red-400" role="alert"
                  >
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full gap-2"
              >
                {loading ? <LoaderCircle className="size-4 animate-spin" /> : "Send Reset Link"}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400">
              <Link href="/auth/sign-in" className="text-cyan-300 hover:underline">
                Back to Sign In
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </Container>
  );
}
