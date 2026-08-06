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
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_80%_12%,rgba(139,92,246,0.2),transparent_18%),radial-gradient(circle_at_50%_100%,rgba(34,211,238,0.08),transparent_26%)]" />
      <motion.div
        className="absolute top-[-8%] left-[-8%] h-[32rem] w-[32rem] rounded-full bg-cyan-400/10 blur-3xl"
        animate={
          reduceMotion ? undefined : { x: [0, 28, -16, 0], y: [0, 34, -18, 0] }
        }
        transition={{ duration: 20, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute top-[6%] right-[-10%] h-[28rem] w-[28rem] rounded-full bg-violet-500/12 blur-3xl"
        animate={
          reduceMotion ? undefined : { x: [0, -30, 24, 0], y: [0, 26, -14, 0] }
        }
        transition={{ duration: 22, ease: "easeInOut", repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-[-14%] left-[18%] h-[30rem] w-[30rem] rounded-full bg-sky-400/8 blur-3xl"
        animate={
          reduceMotion ? undefined : { x: [0, 24, -10, 0], y: [0, -20, 14, 0] }
        }
        transition={{ duration: 24, ease: "easeInOut", repeat: Infinity }}
      />
      <div className="absolute inset-0 [mask-image:radial-gradient(circle_at_center,black,transparent_80%)] opacity-40">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(148,163,184,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(148,163,184,0.08)_1px,transparent_1px)] bg-[size:56px_56px]" />
      </div>
      {particles.map((particle, index) => (
        <motion.span
          key={`${particle.left}-${particle.top}`}
          className="absolute rounded-full bg-white/55 shadow-[0_0_12px_rgba(255,255,255,0.7)]"
          style={{
            left: particle.left,
            top: particle.top,
            width: particle.size,
            height: particle.size,
          }}
          animate={
            reduceMotion
              ? undefined
              : {
                  y: [0, -18, 4, 0],
                  opacity: [0.2, 0.9, 0.4, 0.2],
                  scale: [1, 1.3, 0.92, 1],
                }
          }
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.35,
          }}
        />
      ))}
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(3,7,18,0.16),rgba(3,7,18,0.7))]" />
    </div>
  );
}
