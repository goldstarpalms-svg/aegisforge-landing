import { createMetadata } from "@/utils/metadata";
import { BlueprintPage } from "./blueprint-page";

export const metadata = createMetadata({
  title: "Blueprint",
  description:
    "Describe your idea in one sentence and get a complete product blueprint — architecture, features, tech stack, and timeline.",
  path: "/blueprint",
});

export default function Page() {
  return <BlueprintPage />;
}
