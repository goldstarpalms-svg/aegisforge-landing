import { createMetadata } from "@/utils/metadata";
import { WorkspacePage } from "./workspace-page";

export const metadata = createMetadata({
  title: "AI Workspace",
  description: "Build software with AI — chat, create projects, save conversations, and iterate on your ideas.",
  path: "/workspace",
});

export default function Page() {
  return <WorkspacePage />;
}
