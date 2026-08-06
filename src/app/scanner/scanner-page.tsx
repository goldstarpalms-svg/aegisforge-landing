"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Globe,
  Download,
  Share2,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Info,
  LoaderCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Container } from "@/components/ui/container";
import { Input } from "@/components/ui/input";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ??
  "https://aegisforge-backend.onrender.com";

interface CheckResult {
  name: string;
  status: "pass" | "warn" | "fail" | "info";
  detail: string;
  confidence?: "high" | "medium" | "low";
}

interface ScanResult {
  domain: string;
  score: number;
  grade: string;
  checks: CheckResult[];
  timestamp: string;
  scan_id?: string;
}

const gradeColor = (grade: string) => {
  if (grade === "A+" || grade === "A") return "text-emerald-400";
  if (grade === "B") return "text-cyan-400";
  if (grade === "C") return "text-amber-400";
  if (grade === "D") return "text-orange-400";
  return "text-red-400";
};

const statusIcon = (status: string) => {
  switch (status) {
    case "pass":
      return <CheckCircle2 className="size-4 text-emerald-400" />;
    case "warn":
      return <AlertTriangle className="size-4 text-amber-400" />;
    case "fail":
      return <XCircle className="size-4 text-red-400" />;
    default:
      return <Info className="size-4 text-slate-400" />;
  }
};

const confidenceBadge = (c?: string) => {
  if (!c) return null;
  const color =
    c === "high"
      ? "bg-emerald-400/10 text-emerald-300"
      : c === "medium"
        ? "bg-amber-400/10 text-amber-300"
        : "bg-slate-400/10 text-slate-300";
  return (
    <span className={`ml-2 rounded-full px-2 py-0.5 text-[0.65rem] ${color}`}>
      {c}
    </span>
  );
};

export function ScannerPage() {
  const [domain, setDomain] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [activeCheck, setActiveCheck] = useState(-1);

  async function runScan() {
    const clean = domain.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
    if (!clean) return;

    setLoading(true);
    setError("");
    setResult(null);
    setActiveCheck(0);

    try {
      const res = await fetch(
        `${BACKEND_URL}/scan?domain=${encodeURIComponent(clean)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        },
      );

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.detail || `Scan failed (${res.status})`);
      }

      const data = await res.json();

      const checks: CheckResult[] = [];

      if (data.https_check) {
        checks.push({
          name: "HTTPS Redirect",
          status: data.https_check.https_enabled ? "pass" : "fail",
          detail: data.https_check.https_enabled
            ? "Properly redirects to HTTPS"
            : "Does not redirect to HTTPS",
          confidence: data.https_check.confidence,
        });
      }

      if (data.headers_check) {
        const headers = data.headers_check.headers || {};
        for (const [name, info] of Object.entries(headers)) {
          const h = info as { present?: boolean; value?: string };
          checks.push({
            name,
            status: h.present ? "pass" : "warn",
            detail: h.present ? `Set: ${h.value || "Present"}` : "Missing",
            confidence: (info as Record<string, unknown>).confidence as "high" | "medium" | "low" | undefined,
          });
        }
      }

      if (data.ssl_check) {
        checks.push({
          name: "SSL/TLS",
          status: data.ssl_check.valid ? "pass" : "fail",
          detail: data.ssl_check.valid
            ? `Valid · Expires ${data.ssl_check.expiry_date || "N/A"}`
            : data.ssl_check.error || "Invalid or unreachable",
          confidence: data.ssl_check.confidence,
        });
      }

      if (data.dns_check) {
        const dns = data.dns_check;
        checks.push({
          name: "DNS Security",
          status: dns.dmarc ? "pass" : dns.spf ? "warn" : "fail",
          detail:
            [
              dns.spf && "SPF ✓",
              dns.dkim && "DKIM ✓",
              dns.dmarc && "DMARC ✓",
              dns.dnssec && "DNSSEC ✓",
            ]
              .filter(Boolean)
              .join(" · ") || "No DNS security records found",
          confidence: dns.confidence,
        });
      }

      if (data.cdn_check) {
        checks.push({
          name: "CDN Detection",
          status: data.cdn_check.cdn ? "pass" : "info",
          detail: data.cdn_check.cdn
            ? `Detected: ${data.cdn_check.cdn}`
            : "No CDN detected",
          confidence: data.cdn_check.confidence,
        });
      }

      if (data.cookies_check) {
        const cc = data.cookies_check;
        checks.push({
          name: "Cookie Security",
          status:
            cc.secure && cc.httponly
              ? "pass"
              : cc.secure || cc.httponly
                ? "warn"
                : "fail",
          detail:
            [
              cc.secure && "Secure ✓",
              cc.httponly && "HttpOnly ✓",
              cc.samesite && "SameSite ✓",
            ]
              .filter(Boolean)
              .join(" · ") || "No secure cookie flags",
          confidence: cc.confidence,
        });
      }

      if (data.tech_check) {
        const techs = data.tech_check.technologies || [];
        checks.push({
          name: "Technology Stack",
          status: "info",
          detail: techs.length > 0 ? techs.join(", ") : "Not detected",
          confidence: data.tech_check.confidence,
        });
      }

      const score = data.score?.total_score ?? data.overall_score ?? 0;
      const grade =
        score >= 90
          ? "A+"
          : score >= 80
            ? "A"
            : score >= 70
              ? "B"
              : score >= 60
                ? "C"
                : score >= 40
                  ? "D"
                  : "F";

      setResult({
        domain: clean,
        score: Math.round(score),
        grade,
        checks,
        timestamp: new Date().toISOString(),
        scan_id: data.scan_id || data.id,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Scan failed");
    } finally {
      setLoading(false);
      setActiveCheck(-1);
    }
  }

  async function exportReport(format: "pdf" | "json" | "csv") {
    if (!result) return;
    try {
      const res = await fetch(
        `${BACKEND_URL}/scan/export?domain=${encodeURIComponent(result.domain)}&format=${format}`,
      );
      if (res.ok) {
        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `aegisforge-scan-${result.domain}.${format}`;
        a.click();
        URL.revokeObjectURL(url);
      }
    } catch {
      if (format === "json") {
        const blob = new Blob([JSON.stringify(result, null, 2)], {
          type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `aegisforge-scan-${result.domain}.json`;
        a.click();
        URL.revokeObjectURL(url);
      }
    }
  }

  const circumference = 2 * Math.PI * 54;
  const scoreOffset = result
    ? circumference - (result.score / 100) * circumference
    : circumference;

  return (
    <Container className="py-12">
      <div className="mx-auto max-w-3xl space-y-10">
        <div className="space-y-3 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-sm text-slate-300">
            <Shield className="size-4" />
            Enterprise Security Scanner
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
            Scan any domain
          </h1>
          <p className="text-lg text-slate-400">
            12 concurrent security checks · Weighted scoring · Confidence levels
            · PDF/JSON/CSV export
          </p>
        </div>

        <div className="flex gap-3">
          <Input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && runScan()}
            placeholder="Enter a domain (e.g. example.com)"
            className="h-12 rounded-full bg-white/6 px-5 font-mono"
          />
          <Button
            variant="primary"
            size="lg"
            onClick={runScan}
            disabled={loading || !domain}
            className="min-w-32 shrink-0 rounded-full"
          >
            {loading ? (
              <>
                <LoaderCircle className="size-4 animate-spin" />
                Scanning...
              </>
            ) : (
              <>
                <Globe className="size-4" />
                Scan
              </>
            )}
          </Button>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-2xl border border-red-300/20 bg-red-400/10 px-5 py-4 text-sm text-red-200"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {loading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-3"
            >
              {[
                "Checking HTTPS redirect...",
                "Analyzing security headers...",
                "Validating SSL/TLS certificate...",
                "Scanning DNS records...",
                "Detecting CDN...",
                "Analyzing cookies...",
                "Detecting technologies...",
                "Calculating score...",
              ].map((step, i) => (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.3 }}
                  className={`flex items-center gap-3 rounded-xl border px-4 py-3 text-sm ${
                    i <= activeCheck
                      ? "border-cyan-300/20 bg-cyan-400/5 text-cyan-200"
                      : "border-white/5 bg-white/[0.02] text-slate-500"
                  }`}
                >
                  {i <= activeCheck ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : (
                    <div className="size-4 rounded-full border border-slate-600" />
                  )}
                  {step}
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {result && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <Card className="flex items-center gap-8 rounded-[2rem] bg-white/[0.05] p-8">
                <div className="relative shrink-0">
                  <svg width="128" height="128" viewBox="0 0 128 128">
                    <circle
                      cx="64"
                      cy="64"
                      r="54"
                      fill="none"
                      stroke="rgba(255,255,255,0.06)"
                      strokeWidth="8"
                    />
                    <motion.circle
                      cx="64"
                      cy="64"
                      r="54"
                      fill="none"
                      stroke="url(#scoreGradient)"
                      strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={circumference}
                      initial={{ strokeDashoffset: circumference }}
                      animate={{ strokeDashoffset: scoreOffset }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      transform="rotate(-90 64 64)"
                    />
                    <defs>
                      <linearGradient
                        id="scoreGradient"
                        x1="0"
                        y1="0"
                        x2="1"
                        y2="1"
                      >
                        <stop stopColor="#22D3EE" />
                        <stop offset="1" stopColor="#818CF8" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span
                      className={`text-3xl font-bold ${gradeColor(result.grade)}`}
                    >
                      {result.grade}
                    </span>
                    <span className="text-xs text-slate-400">
                      {result.score}/100
                    </span>
                  </div>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-semibold text-white">
                    {result.domain}
                  </h2>
                  <p className="text-sm text-slate-400">
                    {result.checks.filter((c) => c.status === "pass").length}{" "}
                    passed ·{" "}
                    {result.checks.filter((c) => c.status === "warn").length}{" "}
                    warnings ·{" "}
                    {result.checks.filter((c) => c.status === "fail").length}{" "}
                    failures
                  </p>
                  <p className="text-xs text-slate-500">
                    Scanned {new Date(result.timestamp).toLocaleString()}
                    {result.scan_id && ` · ID: ${result.scan_id.slice(0, 8)}`}
                  </p>
                </div>
              </Card>

              <div className="space-y-3">
                <h3 className="text-lg font-medium text-white">
                  Security Checks
                </h3>
                {result.checks.map((check, i) => (
                  <motion.div
                    key={check.name}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-3"
                  >
                    {statusIcon(check.status)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center text-sm text-white">
                        {check.name}
                        {confidenceBadge(check.confidence)}
                      </div>
                      <p className="mt-0.5 text-xs text-slate-400">
                        {check.detail}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>

              <div className="flex flex-wrap gap-3">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => exportReport("pdf")}
                  className="gap-2"
                >
                  <Download className="size-3.5" /> PDF
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => exportReport("json")}
                  className="gap-2"
                >
                  <Download className="size-3.5" /> JSON
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => exportReport("csv")}
                  className="gap-2"
                >
                  <Download className="size-3.5" /> CSV
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="gap-2"
                >
                  <Share2 className="size-3.5" /> Share
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Container>
  );
}
