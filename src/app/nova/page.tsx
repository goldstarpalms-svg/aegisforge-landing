import { createMetadata } from "@/utils/metadata";
import dynamic from "next/dynamic";

export const metadata = createMetadata({
  title: "Nova Orchestrator",
  description: "Nova AI orchestrator — intent classification, agent routing, and workflow execution.",
  path: "/nova",
});

const NovaPage = dynamic(
  () => import("./nova-page").then((m) => m.NovaPage),
  {
    loading: () => (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-sm text-slate-400">Loading Nova...</div>
      </div>
    ),
  }
);

export default function Page() {
  return <NovaPage />;
}
