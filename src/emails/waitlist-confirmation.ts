import { siteConfig } from "@/config/site";

export function waitlistConfirmationEmail(name?: string) {
  const greeting = name ? `Hi ${name},` : "Hi there,";

  return {
    subject: `${siteConfig.name} waitlist confirmation`,
    text: `${greeting}\n\nYou're officially on the ${siteConfig.name} waitlist. We'll share thoughtful updates as we move closer to launch.\n\n${siteConfig.tagline}\n\n— The ${siteConfig.name} Team`,
  };
}
