import type { NavItem } from "@/types/navigation";

export const primaryNavigation: NavItem[] = [
  { label: "Workspace", href: "/workspace", description: "AI workspace" },
  { label: "Scanner", href: "/scanner", description: "Security scanner" },
  { label: "Blueprint", href: "/blueprint", description: "AI blueprint engine" },
  { label: "Nova", href: "/nova", description: "AI orchestrator" },
  { label: "Vision", href: "/vision", description: "Why AegisForge exists" },
  { label: "Roadmap", href: "/roadmap", description: "How AegisForge ships" },
  {
    label: "Technology",
    href: "/technology",
    description: "Platform modules and systems",
  },
  { label: "FAQ", href: "/faq", description: "Answers and clarity" },
];

export const secondaryNavigation: NavItem[] = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Waitlist", href: "/waitlist" },
];
