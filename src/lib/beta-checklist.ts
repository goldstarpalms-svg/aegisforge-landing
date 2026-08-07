/**
 * AegisForge Beta Launch Checklist
 * Verifies all systems are operational before inviting beta users.
 */

export interface ChecklistItem {
  id: string;
  category: string;
  label: string;
  verify: () => Promise<{ pass: boolean; detail: string }>;
}

const BACKEND_URL =
  typeof window !== "undefined"
    ? (process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://aegisforge-backend.onrender.com")
    : "";

export const betaChecklist: ChecklistItem[] = [
  {
    id: "auth-backend",
    category: "Authentication",
    label: "Backend auth endpoints reachable",
    verify: async () => {
      try {
        const r = await fetch(`${BACKEND_URL}/auth/debug`, { signal: AbortSignal.timeout(15000) });
        const d = await r.json();
        return { pass: d.supabase_url_format_valid && d.supabase_key_set, detail: `URL valid: ${d.supabase_url_format_valid}, Key set: ${d.supabase_key_set}` };
      } catch (e) {
        return { pass: false, detail: `Fetch failed: ${e instanceof Error ? e.message : "unknown"}` };
      }
    },
  },
  {
    id: "auth-health",
    category: "Authentication",
    label: "Backend health check passes",
    verify: async () => {
      try {
        const r = await fetch(`${BACKEND_URL}/health`, { signal: AbortSignal.timeout(15000) });
        const d = await r.json();
        return { pass: d.status === "healthy", detail: `Status: ${d.status}, Version: ${d.version}` };
      } catch (e) {
        return { pass: false, detail: `Fetch failed: ${e instanceof Error ? e.message : "unknown"}` };
      }
    },
  },
  {
    id: "scanner-backend",
    category: "Security Scanner",
    label: "Scanner backend endpoint operational",
    verify: async () => {
      try {
        const r = await fetch(`${BACKEND_URL}/scan?domain=example.com`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: AbortSignal.timeout(30000),
        });
        return { pass: r.ok || r.status === 429, detail: `HTTP ${r.status}` };
      } catch (e) {
        return { pass: false, detail: `Fetch failed: ${e instanceof Error ? e.message : "unknown"}` };
      }
    },
  },
  {
    id: "waitlist-backend",
    category: "Waitlist",
    label: "Waitlist endpoint operational",
    verify: async () => {
      try {
        const r = await fetch(`${BACKEND_URL}/waitlist`, {
          method: "OPTIONS",
          signal: AbortSignal.timeout(15000),
        });
        return { pass: r.ok || r.status === 405, detail: `HTTP ${r.status}` };
      } catch (e) {
        return { pass: false, detail: `Fetch failed: ${e instanceof Error ? e.message : "unknown"}` };
      }
    },
  },
  {
    id: "mobile-viewport",
    category: "Mobile",
    label: "Viewport meta tag present",
    verify: async () => {
      const viewport = document.querySelector('meta[name="viewport"]');
      return { pass: !!viewport, detail: viewport ? "Present" : "Missing" };
    },
  },
  {
    id: "perf-load",
    category: "Performance",
    label: "Page load time under 5s",
    verify: async () => {
      const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
      const loadTime = nav?.loadEventEnd ? Math.round(nav.loadEventEnd - nav.startTime) : null;
      return { pass: loadTime !== null && loadTime < 5000, detail: loadTime ? `Load: ${loadTime}ms` : "Not measured" };
    },
  },
];

/**
 * Run all checklist items and return results
 */
export async function runBetaChecklist(): Promise<Array<ChecklistItem & { result: { pass: boolean; detail: string } }>> {
  const results: Array<ChecklistItem & { result: { pass: boolean; detail: string } }> = [];
  for (const item of betaChecklist) {
    try {
      const result = await item.verify();
      results.push({ ...item, result });
    } catch (e) {
      results.push({ ...item, result: { pass: false, detail: `Error: ${e instanceof Error ? e.message : "unknown"}` } });
    }
  }
  return results;
}
