import type { LucideIcon } from "lucide-react";
import {
  BookOpenText,
  BrainCircuit,
  Cloud,
  Code2,
  FolderKanban,
  GraduationCap,
  ShieldCheck,
  Sparkles,
  Telescope,
  Workflow,
} from "lucide-react";

export interface CounterMetric {
  value: number;
  label: string;
  suffix?: string;
  compact?: boolean;
}

export interface ModuleCard {
  title: string;
  description: string;
  icon: LucideIcon;
  accent: string;
}

export interface RoadmapPhase {
  phase: string;
  title: string;
  description: string;
  status: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const trustMetrics: CounterMetric[] = [
  { value: 5, label: "AI Agents", suffix: "" },
  { value: 12, label: "Security Checks", suffix: "" },
  { value: 15, label: "API Endpoints", suffix: "+" },
  { value: 4, label: "AI Providers", suffix: "" },
];

export const moduleCards: ModuleCard[] = [
  {
    title: "AI Workspace",
    description:
      "A calm environment where planning, reasoning, and creation happen inside one intelligent surface.",
    icon: Sparkles,
    accent: "from-cyan-400/25 via-sky-400/10 to-transparent",
  },
  {
    title: "Security Scanner",
    description:
      "Enterprise-grade security analysis with 12 concurrent checks, scoring, and remediation guidance.",
    icon: ShieldCheck,
    accent: "from-emerald-400/25 via-cyan-400/10 to-transparent",
  },
  {
    title: "Blueprint Engine",
    description:
      "AI-generated product blueprints from a single description — architecture, features, and roadmap.",
    icon: Telescope,
    accent: "from-violet-400/25 via-fuchsia-400/10 to-transparent",
  },
  {
    title: "Automation",
    description:
      "Intelligent flows for repetitive work, with human review where it matters most.",
    icon: Workflow,
    accent: "from-indigo-400/25 via-blue-400/10 to-transparent",
  },
  {
    title: "Projects",
    description:
      "Shared execution spaces where goals, tasks, progress, and context stay aligned.",
    icon: FolderKanban,
    accent: "from-amber-300/25 via-orange-300/10 to-transparent",
  },
  {
    title: "Developers",
    description:
      "APIs, programmable agents, and extensibility primitives for teams building on AegisForge.",
    icon: Code2,
    accent: "from-sky-300/25 via-cyan-300/10 to-transparent",
  },
  {
    title: "Cloud Deploy",
    description:
      "Distributed infrastructure designed for reliable access, sync, storage, and scale.",
    icon: Cloud,
    accent: "from-slate-300/20 via-white/10 to-transparent",
  },
  {
    title: "Growth Agent",
    description:
      "Analytics, optimization, and growth intelligence that learns from your deployment data.",
    icon: GraduationCap,
    accent: "from-rose-300/25 via-fuchsia-300/10 to-transparent",
  },
];

export const roadmapPhases: RoadmapPhase[] = [
  {
    phase: "Phase Zero",
    title: "Foundation",
    description:
      "Premium landing page, brand system, waitlist engine, security scanner, and AI blueprint generation.",
    status: "Live now",
  },
  {
    phase: "Phase One",
    title: "AI Platform",
    description:
      "Ship Nova orchestrator with intent routing, agent system, memory, and multi-provider AI support.",
    status: "Next",
  },
  {
    phase: "Phase Two",
    title: "Workspace",
    description:
      "Dashboard with project management, scan history, blueprint library, and deployment tracking.",
    status: "Planned",
  },
  {
    phase: "Phase Three",
    title: "Developer Ecosystem",
    description:
      "Open AegisForge to builders through APIs, automation primitives, and programmable extensions.",
    status: "Expanding",
  },
  {
    phase: "Phase Four",
    title: "Global Platform",
    description:
      "Scale AegisForge into a trusted worldwide AI operating system for teams, creators, and institutions.",
    status: "Long-term",
  },
];

export const heroSignals = [
  "Build software with one conversation",
  "AI agents that build, secure, and deploy",
  "From idea to live app in minutes",
];

export const homeFaqs: FaqItem[] = [
  {
    question: "What makes AegisForge different from a typical AI tool?",
    answer:
      "AegisForge is not another chatbot or code assistant. It is an AI operating system — one platform where intelligent agents build, secure, and deploy applications from a single conversation. You describe what you want; AegisForge decides which agents to activate and delivers working software.",
  },
  {
    question: "Who is AegisForge for in the first release?",
    answer:
      "Founders, operators, and technical teams who want to go from idea to live application without managing infrastructure, security, or deployment manually.",
  },
  {
    question: "Why start with a waitlist?",
    answer:
      "A curated waitlist helps us shape the product with care, learn from the right early users, and keep quality high while the platform evolves.",
  },
  {
    question: "Will AegisForge support developers as well as end users?",
    answer:
      "Yes. The roadmap includes a dedicated developer ecosystem with APIs, programmable workflows, and extensibility so teams can build on top of AegisForge over time.",
  },
];

export const technologyHighlights = [
  "Modular product architecture",
  "Motion with restraint",
  "Accessible interaction patterns",
  "A visual language that feels alive without becoming noisy",
];

export const blogThemes = [
  "Product thinking",
  "Design systems",
  "Intelligence infrastructure",
  "Future-of-work essays",
];

export const visionStory = [
  "Software keeps multiplying, yet the experience of building it remains fragmented. People move between design tools, code editors, security scanners, deployment platforms, and monitoring dashboards just to ship a single feature.",
  "AegisForge exists because building software should be as easy as describing an idea. We believe intelligent technology should act like an operating layer — automatically routing your intent to the right agents, building what you need, securing it, and deploying it without you manually choosing tools.",
  "The goal is not to make technology louder. The goal is to make human potential easier to amplify. One conversation, one platform, one intelligent system that handles the complexity so you can focus on what matters.",
];

export const footerNewsletterLabel =
  "Get product notes, launch updates, and early access signals.";

export const technologyPageIntro =
  "The AegisForge platform is built as an AI operating system: one orchestrator, five intelligent agents, and an expanding developer layer that turns natural language into live, secured, deployed software.";

export const blogPageIntro =
  "The AegisForge journal captures product ideas, technical decisions, and the philosophy behind building an AI operating system that ships software from conversation.";

export const aboutTags = [
  "AI Operating System",
  "Agent orchestration",
  "Security scanner",
  "Blueprint engine",
  "Cloud deployment",
  "Human amplification",
];

export const blogPreviewCards = [
  {
    title: "Why the future needs fewer interfaces, not more",
    description:
      "A product thesis on coherence, leverage, and the cost of fragmented software.",
    icon: BookOpenText,
  },
  {
    title: "Designing ambient intelligence with restraint",
    description:
      "How motion, layout, and systems thinking shape the feeling of trust in a modern product.",
    icon: BrainCircuit,
  },
];
