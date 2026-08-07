import { createMetadata } from "@/utils/metadata";
import dynamic from "next/dynamic";

export const metadata = createMetadata({
  title: "Security Scanner",
  description: "Enterprise-grade security scanner — 12 concurrent checks, weighted scoring, and export.",
  path: "/scanner",
});

const ScannerPage = dynamic(
  () => import("./scanner-page").then((m) => m.ScannerPage),
  {
    loading: () => (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-sm text-slate-400">Loading scanner...</div>
      </div>
    ),
  }
);

export default function Page() {
  return <ScannerPage />;
}
