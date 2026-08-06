import { createMetadata } from "@/utils/metadata";
import { SignUpPage } from "./sign-up-page";

export const metadata = createMetadata({
  title: "Sign Up",
  description: "Create your AegisForge account.",
  path: "/auth/sign-up",
});

export default function Page() {
  return <SignUpPage />;
}
