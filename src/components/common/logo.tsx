import Link from "next/link";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  href?: string;
}

export function Logo({ className, href = "/" }: LogoProps) {
  return (
    <Link
      href={href}
      className={cn("inline-flex items-center gap-3", className)}
    >
      <span className="flex size-10 items-center justify-center rounded-2xl bg-slate-950 ring-1 ring-white/10">
        <svg
          aria-hidden="true"
          viewBox="0 0 56 56"
          className="size-8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M14 40V16L28 32L42 16V40"
            stroke="url(#logo-gradient)"
            strokeWidth="4.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M14 40L28 24L42 40"
            stroke="rgba(226,232,240,0.85)"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <defs>
            <linearGradient
              id="logo-gradient"
              x1="14"
              y1="16"
              x2="42"
              y2="42"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#22D3EE" />
              <stop offset="0.52" stopColor="#818CF8" />
              <stop offset="1" stopColor="#C084FC" />
            </linearGradient>
          </defs>
        </svg>
      </span>
      <div className="flex flex-col leading-none">
        <span className="text-lg font-semibold tracking-[0.18em] text-white">
          AegisForge
        </span>
        <span className="text-xs tracking-[0.22em] text-slate-400 uppercase">
          AI Operating System
        </span>
      </div>
    </Link>
  );
}
