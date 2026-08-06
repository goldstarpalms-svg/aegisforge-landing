import { createMetadata } from "@/utils/metadata";
import { ScannerPage } from "./scanner-page";

export const metadata = createMetadata({
  title: "Security Scanner",
  description:
    "Scan any domain for security vulnerabilities — HTTPS, headers, SSL, DNS, CDN, cookies, and technology detection.",
  path: "/scanner",
});

export default function Page() {
  return <ScannerPage />;
}
