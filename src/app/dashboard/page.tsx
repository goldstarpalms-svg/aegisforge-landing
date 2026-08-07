import { createMetadata } from "@/utils/metadata";
import dynamic from "next/dynamic";

export const metadata = createMetadata({
  title: "Dashboard",
  description: "Your AegisForge dashboard — projects, conversations, and quick actions.",
  path: "/dashboard",
});

const DashboardPage = dynamic(
  () => import("./dashboard-page").then((m) => m.DashboardPage),
  {
    loading: () => (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-sm text-slate-400">Loading dashboard...</div>
      </div>
    ),
  }
);

export default function Page() {
  return <DashboardPage />;
}
