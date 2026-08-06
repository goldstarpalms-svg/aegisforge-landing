"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LoaderCircle, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/stores/auth";

export function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const signUp = useAuth((s) => s.signUp);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: err } = await signUp(email, password, name);
    if (err) {
      setError(err);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
    }
  }

  return (
    <Container className="flex min-h-[70vh] items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm space-y-8"
      >
        {success ? (
          <div className="space-y-4 text-center">
            <CheckCircle2 className="mx-auto size-10 text-cyan-400" />
            <h1 className="text-2xl font-semibold text-white">Check your email</h1>
            <p className="text-sm text-slate-400">
              We sent a verification link to <span className="text-white">{email}</span>.
              Click it to confirm your account.
            </p>
            <Link href="/auth/sign-in">
              <Button variant="primary" className="mt-4">Go to Sign In</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold text-white">Create your account</h1>
              <p className="text-sm text-slate-400">Start building with AegisForge</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <label className="space-y-2 text-sm text-slate-200">
                Full name
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ada Lovelace"
                  required
                  className="h-11 rounded-xl bg-white/5"
                />
              </label>
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
                  minLength={8}
                  className="h-11 rounded-xl bg-white/5"
                />
              </label>

              {error && <p className="text-sm text-red-400">{error}</p>}

              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={loading}
                className="w-full"
              >
                {loading ? <LoaderCircle className="size-4 animate-spin" /> : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link href="/auth/sign-in" className="text-cyan-300 hover:underline">
                Sign in
              </Link>
            </p>
          </>
        )}
      </motion.div>
    </Container>
  );
}
