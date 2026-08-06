"use client";

import { motion, useReducedMotion } from "framer-motion";
import {
  BrainCircuit,
  Cloud,
  Code2,
  FolderKanban,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Telescope,
} from "lucide-react";

import { cn } from "@/lib/utils";

const orbitNodes = [
  { label: "Research", icon: Telescope, x: 120, y: 110, delay: 0.1 },
  { label: "Learning", icon: GraduationCap, x: 262, y: 70, delay: 0.2 },
  { label: "Developers", icon: Code2, x: 405, y: 118, delay: 0.3 },
  { label: "Cloud", icon: Cloud, x: 434, y: 282, delay: 0.4 },
  { label: "Projects", icon: FolderKanban, x: 345, y: 412, delay: 0.5 },
  { label: "Security", icon: ShieldCheck, x: 172, y: 428, delay: 0.6 },
  { label: "Workspace", icon: Sparkles, x: 86, y: 292, delay: 0.7 },
  { label: "Reasoning", icon: BrainCircuit, x: 144, y: 212, delay: 0.8 },
];

const floatingLabels = [
  { title: "Intent", value: "Mapped", className: "left-0 top-14" },
  { title: "Memory", value: "Persistent", className: "right-2 top-10" },
  { title: "Actions", value: "Composable", className: "left-6 bottom-10" },
  { title: "Signals", value: "Live", className: "right-0 bottom-20" },
];

export function EcosystemVisual() {
  const reduceMotion = useReducedMotion();

  return (
    <div className="relative mx-auto aspect-square w-full max-w-[34rem]">
      <div className="absolute inset-0 rounded-[2rem] border border-white/10 bg-white/[0.04] shadow-[0_40px_120px_-40px_rgba(2,8,23,0.95)] backdrop-blur-2xl" />
      <div className="absolute inset-3 rounded-[1.75rem] border border-white/8 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.12),transparent_22%),linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))]" />

      <motion.div
        className="absolute inset-[11%] rounded-full border border-cyan-300/10"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 26, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-[20%] rounded-full border border-violet-300/10"
        animate={reduceMotion ? undefined : { rotate: -360 }}
        transition={{ duration: 32, ease: "linear", repeat: Infinity }}
      />
      <motion.div
        className="absolute inset-[30%] rounded-full border border-white/8"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 22, ease: "linear", repeat: Infinity }}
      />

      <svg
        viewBox="0 0 520 520"
        className="absolute inset-0 h-full w-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="aegisforge-line"
            x1="88"
            y1="88"
            x2="440"
            y2="440"
          >
            <stop stopColor="#22D3EE" stopOpacity="0.95" />
            <stop offset="0.5" stopColor="#818CF8" stopOpacity="0.8" />
            <stop offset="1" stopColor="#C084FC" stopOpacity="0.35" />
          </linearGradient>
          <radialGradient
            id="aegisforge-core"
            cx="0"
            cy="0"
            r="1"
            gradientUnits="userSpaceOnUse"
            gradientTransform="translate(260 260) rotate(90) scale(160)"
          >
            <stop stopColor="#60A5FA" stopOpacity="0.26" />
            <stop offset="0.6" stopColor="#818CF8" stopOpacity="0.16" />
            <stop offset="1" stopColor="#020617" stopOpacity="0" />
          </radialGradient>
        </defs>

        <circle cx="260" cy="260" r="154" fill="url(#aegisforge-core)" />

        {orbitNodes.map((node) => (
          <g key={node.label}>
            <path
              d={`M260 260 Q ${node.x} ${node.y} ${node.x} ${node.y}`}
              stroke="url(#aegisforge-line)"
              strokeOpacity="0.28"
              strokeWidth="1.5"
              strokeDasharray="4 7"
            />
            <motion.circle
              cx={node.x}
              cy={node.y}
              r="6"
              fill="#E2E8F0"
              animate={
                reduceMotion
                  ? undefined
                  : {
                      scale: [1, 1.4, 1],
                      opacity: [0.55, 1, 0.55],
                    }
              }
              transition={{
                duration: 3.2,
                repeat: Infinity,
                delay: node.delay,
                ease: "easeInOut",
              }}
            />
          </g>
        ))}
      </svg>

      <div className="absolute inset-0">
        {orbitNodes.map((node) => {
          const Icon = node.icon;

          return (
            <motion.div
              key={node.label}
              className="absolute flex -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-3"
              style={{
                left: `${(node.x / 520) * 100}%`,
                top: `${(node.y / 520) * 100}%`,
              }}
              animate={
                reduceMotion
                  ? undefined
                  : {
                      y: [0, -6, 0],
                    }
              }
              transition={{
                duration: 4.8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: node.delay,
              }}
            >
              <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-slate-950/70 text-cyan-200 shadow-[0_0_30px_rgba(34,211,238,0.16)] backdrop-blur-xl">
                <Icon className="size-5" />
              </div>
              <span className="text-[0.64rem] font-medium tracking-[0.28em] text-slate-300 uppercase">
                {node.label}
              </span>
            </motion.div>
          );
        })}
      </div>

      <motion.div
        className="absolute top-1/2 left-1/2 flex h-40 w-40 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/12 bg-slate-950/70 text-center shadow-[0_0_80px_rgba(96,165,250,0.22)] backdrop-blur-2xl"
        animate={reduceMotion ? undefined : { scale: [1, 1.03, 1] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="space-y-2">
          <p className="text-[0.7rem] tracking-[0.34em] text-cyan-200 uppercase">
            AegisForge Core
          </p>
          <p className="px-5 text-lg font-semibold text-white">
            One intelligent platform.
          </p>
        </div>
      </motion.div>

      {floatingLabels.map((item, index) => (
        <motion.div
          key={item.title}
          className={cn(
            "absolute rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 backdrop-blur-xl",
            item.className,
          )}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, index % 2 === 0 ? -8 : 8, 0],
                }
          }
          transition={{
            duration: 6 + index,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <p className="text-[0.62rem] tracking-[0.28em] text-slate-500 uppercase">
            {item.title}
          </p>
          <p className="mt-1 text-sm font-medium text-white">{item.value}</p>
        </motion.div>
      ))}
    </div>
  );
}
