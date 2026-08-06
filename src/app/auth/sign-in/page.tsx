import { createMetadata } from "@/utils/metadata";
import { SignInPage } from "./sign-in-page";

export const metadata = createMetadata({
  title: "Sign In",
  description: "Sign in to your AegisForge account.",
  path: "/auth/sign-in",
});

export default function Page() {
  return <SignInPage />;
}
