"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/stores/auth";

export function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const signIn = useAuth((s) => s.signIn);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await signIn(email, password);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      window.location.href = "/dashboard";
    }
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-white">Welcome back</h1>
          <p className="text-sm text-slate-400">Sign in to your AegisForge account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="space-y-2 text-sm text-slate-200">
            Email
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="h-11 rounded-xl bg-white/5"
            />
          </label>
          <label className="space-y-2 text-sm text-slate-200">
            Password
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="h-11 rounded-xl bg-white/5"
            />
          </label>

          {error && (
            <p className="text-sm text-red-400">{error}</p>
          )}

          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={loading}
            className="w-full"
          >
            {loading ? <LoaderCircle className="size-4 animate-spin" /> : "Sign In"}
          </Button>
        </form>

        <div className="space-y-2 text-center text-sm text-slate-400">
          <Link href="/auth/reset-password" className="text-[#00F5A0] hover:underline">
            Forgot password?
          </Link>
          <p>
            Don&apos;t have an account?{" "}
            <Link href="/auth/sign-up" className="text-[#00F5A0] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </motion.div>
    </Container>
  );
}
