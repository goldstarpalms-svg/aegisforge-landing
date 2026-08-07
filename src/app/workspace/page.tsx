import { createMetadata } from "@/utils/metadata";
import dynamic from "next/dynamic";

export const metadata = createMetadata({
  title: "AI Workspace",
  description: "Build with AI — describe what you want and iterate with intelligent assistance.",
  path: "/workspace",
});

const WorkspacePage = dynamic(
  () => import("./workspace-page").then((m) => m.WorkspacePage),
  {
    loading: () => (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-sm text-slate-400">Loading workspace...</div>
      </div>
    ),
  }
);

export default function Page() {
  return <WorkspacePage />;
}
