"use client";

import Link from "next/link";
import { Menu, X, Brain } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import { Logo } from "@/components/common/logo";
import { Button } from "@/components/ui/button";
import { Container } from "@/components/ui/container";
import { primaryNavigation } from "@/config/navigation";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    let lastY = window.scrollY;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 24);

      if (currentY > lastY + 12 && currentY > 120) {
        setHidden(true);
      } else if (currentY < lastY - 8) {
        setHidden(false);
      }

      lastY = currentY;
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <motion.header
      animate={{ y: hidden && !open ? -120 : 0 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <Container className="pt-3 sm:pt-4">
        <div
          className={cn(
            "mx-auto flex h-14 sm:h-[4.5rem] items-center justify-between gap-3 sm:gap-4 rounded-2xl sm:rounded-full border border-transparent px-3 sm:px-5 transition duration-300",
            scrolled
              ? "border-white/10 bg-slate-950/65 shadow-[0_20px_80px_-30px_rgba(2,8,23,0.95)] backdrop-blur-2xl"
              : "bg-transparent",
          )}
        >
          <Logo />

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
            {primaryNavigation.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/5 hover:text-white",
                    active && "bg-white/10 text-white",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden items-center gap-2 lg:flex">
            <Button asChild variant="ghost" className="rounded-full px-4 text-sm text-slate-300">
              <Link href="/dashboard">Dashboard</Link>
            </Button>
            <Button asChild variant="primary" className="rounded-full px-5">
              <Link href="/auth/sign-up">Get Started</Link>
            </Button>
          </div>

          {/* Mobile: show Dashboard icon + hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <Link
              href="/dashboard"
              className="rounded-full p-2 text-slate-400 hover:bg-white/5 hover:text-white"
              aria-label="Dashboard"
            >
              <Brain className="size-5" />
            </Link>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-full"
              aria-expanded={open}
              aria-label="Open menu"
              onClick={() => setOpen((value) => !value)}
            >
              {open ? <X className="size-5" /> : <Menu className="size-5" />}
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {open ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="mt-2 sm:mt-3 overflow-hidden rounded-2xl sm:rounded-[1.75rem] border border-white/10 bg-slate-950/85 shadow-[0_24px_80px_-36px_rgba(2,8,23,0.95)] backdrop-blur-2xl lg:hidden"
            >
              <Container className="flex flex-col gap-1 px-3 py-4 sm:px-4 sm:py-5">
                {primaryNavigation.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl sm:rounded-2xl border border-transparent px-4 py-3 text-base sm:text-sm font-medium text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white min-h-[44px] flex items-center",
                      pathname === item.href &&
                        "border-white/10 bg-white/5 text-white",
                    )}
                    onClick={() => setOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
                <Link
                  href="/dashboard"
                  className="rounded-xl sm:rounded-2xl border border-transparent px-4 py-3 text-base sm:text-sm font-medium text-slate-300 transition hover:border-white/10 hover:bg-white/5 hover:text-white min-h-[44px] flex items-center"
                  onClick={() => setOpen(false)}
                >
                  Dashboard
                </Link>
                <Button asChild variant="primary" className="mt-2 rounded-full min-h-[44px]">
                  <Link href="/auth/sign-up" onClick={() => setOpen(false)}>
                    Get Started
                  </Link>
                </Button>
              </Container>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Container>
    </motion.header>
  );
}
