"use client";

import { motion } from "framer-motion";

/** Skeleton loader for cards/blocks */
export function SkeletonCard({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse rounded-2xl border border-white/5 bg-white/[0.03] p-5 ${className}`}>
      <div className="flex items-center gap-3 mb-4">
        <div className="size-10 rounded-xl bg-white/10" />
        <div className="flex-1 space-y-2">
          <div className="h-3 w-3/4 rounded bg-white/10" />
          <div className="h-2 w-1/2 rounded bg-white/5" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-2 w-full rounded bg-white/5" />
        <div className="h-2 w-5/6 rounded bg-white/5" />
        <div className="h-2 w-2/3 rounded bg-white/5" />
      </div>
    </div>
  );
}

/** Skeleton for a list item */
export function SkeletonRow({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse flex items-center gap-3 rounded-xl bg-white/[0.02] px-4 py-3 ${className}`}>
      <div className="size-8 rounded-lg bg-white/10" />
      <div className="flex-1 space-y-1.5">
        <div className="h-2.5 w-2/3 rounded bg-white/10" />
        <div className="h-2 w-1/3 rounded bg-white/5" />
      </div>
      <div className="h-5 w-16 rounded-full bg-white/5" />
    </div>
  );
}

/** Skeleton for the prompt bar */
export function SkeletonPrompt({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse space-y-3 ${className}`}>
      <div className="h-24 w-full rounded-2xl border border-white/5 bg-white/[0.03]" />
      <div className="flex gap-2">
        <div className="h-8 w-24 rounded-full bg-white/5" />
        <div className="h-8 w-28 rounded-full bg-white/5" />
      </div>
    </div>
  );
}

/** Animated dots for inline loading */
export function LoadingDots({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex gap-1 ${className}`}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block size-1.5 rounded-full bg-current"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </span>
  );
}

/** Full-page loading state */
export function PageLoader({ message = "Loading" }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4">
      <motion.div
        className="size-10 rounded-xl border-2 border-cyan-400/30 border-t-cyan-400"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      />
      <p className="text-sm text-slate-400">
        {message}
        <LoadingDots className="ml-1 text-cyan-400" />
      </p>
    </div>
  );
}

/** Empty state component */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  action?: { label: string; onClick: () => void };
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center gap-3 py-12 text-center ${className}`}
    >
      <div className="flex size-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]">
        <Icon className="size-6 text-slate-400" />
      </div>
      <h3 className="text-sm font-medium text-white">{title}</h3>
      <p className="max-w-xs text-xs text-slate-500">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-1 rounded-full border border-cyan-400/20 bg-cyan-400/5 px-4 py-2 text-xs text-cyan-200 transition-colors hover:bg-cyan-400/10"
        >
          {action.label}
        </button>
      )}
    </motion.div>
  );
}

/** Error state with retry */
export function ErrorState({
  title = "Something went wrong",
  description = "An unexpected error occurred.",
  retry,
  className = "",
}: {
  title?: string;
  description?: string;
  retry?: { label: string; onRetry: () => void };
  className?: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-400/10 bg-red-400/5 px-6 py-8 text-center ${className}`}
    >
      <div className="size-10 rounded-xl bg-red-400/10 flex items-center justify-center">
        <span className="text-lg">⚠</span>
      </div>
      <h3 className="text-sm font-medium text-red-200">{title}</h3>
      <p className="max-w-xs text-xs text-red-300/70">{description}</p>
      {retry && (
        <button
          onClick={retry.onRetry}
          className="mt-1 rounded-full border border-red-400/20 bg-red-400/10 px-4 py-2 text-xs text-red-200 transition-colors hover:bg-red-400/15"
        >
          {retry.label}
        </button>
      )}
    </motion.div>
  );
}
