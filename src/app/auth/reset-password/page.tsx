import { createMetadata } from "@/utils/metadata";
import { ResetPasswordPage } from "./reset-password-page";

export const metadata = createMetadata({
  title: "Reset Password",
  description: "Reset your AegisForge password.",
  path: "/auth/reset-password",
});

export default function Page() {
  return <ResetPasswordPage />;
}
