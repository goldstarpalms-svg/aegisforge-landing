import { HomePage } from "@/features/home/home-page";
import { createMetadata } from "@/utils/metadata";

export const metadata = createMetadata({
  title: "AegisForge | One intelligent platform for the future",
  description:
    "The future does not need more apps. It needs one intelligent platform for creation, learning, automation, research, and collaboration.",
  path: "/",
});

export default function IndexPage() {
  return <HomePage />;
}
