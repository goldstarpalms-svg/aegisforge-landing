import type { NavItem } from "@/types/navigation";

export const primaryNavigation: NavItem[] = [
  { label: "Vision", href: "/vision", description: "Why AegisForge exists" },
  { label: "Roadmap", href: "/roadmap", description: "How AegisForge ships" },
  {
    label: "Technology",
    href: "/technology",
    description: "Platform modules and systems",
  },
  { label: "Blog", href: "/blog", description: "Notes from the build" },
  { label: "FAQ", href: "/faq", description: "Answers and clarity" },
  { label: "Contact", href: "/contact", description: "Talk to the team" },
];

export const secondaryNavigation: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Waitlist", href: "/waitlist" },
];
