import { createMetadata } from "@/utils/metadata";
import dynamic from "next/dynamic";

export const metadata = createMetadata({
  title: "Blueprint Engine",
  description: "AI-powered blueprint engine — describe your app and get a complete architecture plan.",
  path: "/blueprint",
});

const BlueprintPage = dynamic(
  () => import("./blueprint-page").then((m) => m.BlueprintPage),
  {
    loading: () => (
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="text-sm text-slate-400">Loading blueprint engine...</div>
      </div>
    ),
  }
);

export default function Page() {
  return <BlueprintPage />;
}
