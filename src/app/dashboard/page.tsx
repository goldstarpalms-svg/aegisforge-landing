import { createMetadata } from "@/utils/metadata";
import { DashboardPage } from "./dashboard-page";

export const metadata = createMetadata({
  title: "Dashboard",
  description: "Your AegisForge dashboard — projects, conversations, and quick actions.",
  path: "/dashboard",
});

export default function Page() {
  return <DashboardPage />;
}
