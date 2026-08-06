import { createMetadata } from "@/utils/metadata";
import { NovaPage } from "./nova-page";

export const metadata = createMetadata({
  title: "Nova",
  description:
    "Build software with one conversation. Nova routes your intent to the right AI agents and delivers results.",
  path: "/nova",
});

export default function Page() {
  return <NovaPage />;
}
