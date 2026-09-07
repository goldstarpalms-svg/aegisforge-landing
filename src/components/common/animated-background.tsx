"use client";

import { motion, useReducedMotion } from "framer-motion";

const particles = [
  { left: "6%", top: "18%", size: 4, duration: 13 },
  { left: "15%", top: "72%", size: 3, duration: 16 },
  { left: "24%", top: "36%", size: 5, duration: 12 },
  { left: "31%", top: "58%", size: 2, duration: 11 },
  { left: "38%", top: "14%", size: 4, duration: 17 },
  { left: "45%", top: "78%", size: 3, duration: 15 },
  { left: "54%", top: "28%", size: 2, duration: 10 },
  { left: "61%", top: "66%", size: 4, duration: 18 },
  { left: "69%", top: "22%", size: 3, duration: 14 },
  { left: "76%", top: "84%", size: 2, duration: 12 },
  { left: "82%", top: "42%", size: 4, duration: 19 },
  { left: "89%", top: "12%", size: 3, duration: 13 },
];

export function AnimatedBackground() {
  const reduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#030712]"
    >
      {/* deep space base */}
      <div className="absolute inset-0 bg-[#02040a]" />

      {/* aurora nebulae */}
      <div className="absolute inset-0 bg-[radial-gradient(1100px_600px_at_18%_-8%,rgba(34,211,238,0.20),transparent_55%),radial-gradient(900px_500px_at_82%_10%,rgba(139,92,246,0.22),transparent_55%),radial-gradient(1000px_700px_at_50%_115%,rgba(56,189,248,0.12),transparent_55%)]" />

      {/* aurora ribbons */}
      <motion.div
        className="absolute -top-[20%] left-[8%] h-[34rem] w-[52rem] rounded-[100%] bg-cyan-400/18 blur-[110px]"
        animate={reduceMotion ? undefined : { x: [0, 60, -40, 0], y: [0, 40, -30, 0], rotate: [0, 20, -10, 0] }}
        transition={{ duration: 26, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute top-[4%] right-[-12%] h-[30rem] w-[46rem] rounded-[100%] bg-violet-500/20 blur-[120px]"
        animate={reduceMotion ? undefined : { x: [0, -70, 40, 0], y: [0, 30, -20, 0], rotate: [0, -18, 12, 0] }}
        transition={{ duration: 30, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-18%] left-[24%] h-[28rem] w-[42rem] rounded-[100%] bg-sky-400/14 blur-[110px]"
        animate={reduceMotion ? undefined : { x: [0, 40, -30, 0], y: [0, -30, 20, 0] }}
        transition={{ duration: 24, ease: "easeInOut", repeat: Infinity }}
      />

      {/* fine cyber grid */}
      <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_50%_20%,black,transparent_78%)] opacity-30">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.10)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.10)_1px,transparent_1px)] bg-[size:58px_58px]" />
      </div>

      {/* horizon gradient glow */}
      <motion.div
        className="absolute inset-x-0 bottom-0 h-[24rem] bg-[radial-gradient(120%_100%_at_50%_120%,rgba(34,211,238,0.16),transparent_60%)]"
        animate={reduceMotion ? undefined : { opacity: [0.5, 0.9, 0.5] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* floating particles */}
      {particles.map((particle, index) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          className="absolute rounded-full bg-white/60 shadow-[0_0_14px_rgba(180,230,255,0.85)]"
          style={{ left: particle.left, top: particle.top, width: particle.size, height: particle.size }}
          animate={
            reduceMotion
              ? undefined
              : { y: [0, -22, 5, 0], opacity: [0.2, 0.95, 0.4, 0.2], scale: [1, 1.4, 0.9, 1] }
          }
          transition={{ duration: particle.duration, repeat: Infinity, ease: "easeInOut", delay: index * 0.35 }}
        />
      ))}

      {/* scanning scanline for a 'monitor' feel */}
      <motion.div
        className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-cyan-300/25 to-transparent"
        animate={reduceMotion ? undefined : { top: ["0%", "100%", "0%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
      />

      {/* vignette */}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(2,4,10,0.1),rgba(2,4,10,0.62))]" />
    </div>
  );
}
