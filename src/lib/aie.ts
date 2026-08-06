/**
 * Aegis Intelligence Engine (AIE)
 *
 * The heart of AegisForge.
 * Understands intent, remembers context, recommends next steps,
 * coordinates all platform modules.
 */

// --- Types ---

export interface UserIntent {
  primary: IntentCategory;
  secondary?: IntentCategory;
  confidence: number;
  entities: Record<string, string>;
  suggestedActions: SuggestedAction[];
}

export type IntentCategory =
  | "build"
  | "scan"
  | "blueprint"
  | "deploy"
  | "optimize"
  | "learn"
  | "debug"
  | "design"
  | "manage"
  | "explore";

export interface SuggestedAction {
  id: string;
  label: string;
  description: string;
  href: string;
  priority: number; // 1 = highest
  auto?: boolean; // should this happen automatically?
  module: ModuleName;
}

export type ModuleName =
  | "workspace"
  | "scanner"
  | "blueprint"
  | "nova"
  | "dashboard"
  | "deploy";

export interface AIEResponse {
  understood: boolean;
  intent: UserIntent;
  reply: string;
  actions: SuggestedAction[];
  contextUpdate: Partial<AIEContext>;
}

export interface AIEContext {
  currentPage: string;
  currentProjectId: string | null;
  currentConversationId: string | null;
  openFileIds: string[];
  recentActions: RecentAction[];
  userPreferences: UserPreferences;
}

export interface RecentAction {
  type: string;
  label: string;
  timestamp: Date;
  href?: string;
}

export interface UserPreferences {
  frequentModules: ModuleName[];
  lastWorkspaceQuery?: string;
  lastScannedDomain?: string;
  preferredTechStack?: string;
}

// --- Intent Patterns ---

const intentPatterns: Array<{
  patterns: RegExp[];
  category: IntentCategory;
  entities?: string[];
}> = [
  {
    patterns: [/build/i, /create/i, /make/i, /develop/i, /implement/i, /scaffold/i],
    category: "build",
    entities: ["app_type", "feature"],
  },
  {
    patterns: [/scan/i, /security/i, /vuln/i, /check.*secur/i, /analyze.*secur/i],
    category: "scan",
    entities: ["domain"],
  },
  {
    patterns: [/blueprint/i, /plan/i, /architect/i, /design.*system/i, /spec/i],
    category: "blueprint",
    entities: ["app_type"],
  },
  {
    patterns: [/deploy/i, /launch/i, /ship/i, /go live/i, /publish/i],
    category: "deploy",
    entities: ["target"],
  },
  {
    patterns: [/optim/i, /improv/i, /perform/i, /speed/i, /refactor/i],
    category: "optimize",
    entities: ["area"],
  },
  {
    patterns: [/learn/i, /teach/i, /explain/i, /how do/i, /what is/i, /tutorial/i],
    category: "learn",
    entities: ["topic"],
  },
  {
    patterns: [/debug/i, /fix/i, /error/i, /broken/i, /issue/i, /problem/i],
    category: "debug",
    entities: ["error_type"],
  },
  {
    patterns: [/design/i, /ui/i, /ux/i, /layout/i, /style/i, /theme/i],
    category: "design",
    entities: ["component"],
  },
  {
    patterns: [/manage/i, /organize/i, /track/i, /status/i, /overview/i],
    category: "manage",
    entities: ["resource"],
  },
  {
    patterns: [/show/i, /list/i, /explore/i, /browse/i, /what.*available/i],
    category: "explore",
    entities: ["scope"],
  },
];

// --- Industry/Domain Detection ---

const domainKeywords: Record<string, string[]> = {
  fintech: ["payment", "banking", "finance", "wallet", "transaction", "stripe", "plaid", "fintech"],
  ecommerce: ["store", "shop", "cart", "checkout", "product", "catalog", "ecommerce", "e-commerce"],
  saas: ["subscription", "pricing", "plan", "billing", "tenant", "saas", "multi-tenant"],
  healthcare: ["patient", "medical", "health", "ehr", "hipaa", "healthcare"],
  education: ["course", "student", "learning", "lms", "quiz", "education"],
  social: ["feed", "post", "follow", "like", "comment", "profile", "social"],
  productivity: ["task", "project", "kanban", "calendar", "todo", "collaboration"],
  ai: ["ml", "model", "training", "inference", "ai", "neural", "prediction"],
};

function detectDomain(input: string): string | null {
  const lower = input.toLowerCase();
  for (const [domain, keywords] of Object.entries(domainKeywords)) {
    if (keywords.some((kw) => lower.includes(kw))) return domain;
  }
  return null;
}

// --- The Engine ---

export class AegisIntelligenceEngine {
  private context: AIEContext;

  constructor(context: AIEContext) {
    this.context = context;
  }

  updateContext(partial: Partial<AIEContext>) {
    this.context = { ...this.context, ...partial };
  }

  getContext(): AIEContext {
    return { ...this.context };
  }

  /**
   * Main entry point: process user input and return intelligent response
   */
  process(input: string): AIEResponse {
    const intent = this.classifyIntent(input);
    const domain = detectDomain(input);
    const actions = this.generateActions(intent, domain, input);
    const reply = this.generateReply(intent, domain, actions);
    const contextUpdate = this.inferContextUpdate(intent, input);

    return {
      understood: intent.confidence > 0.3,
      intent,
      reply,
      actions,
      contextUpdate,
    };
  }

  /**
   * Classify the user's intent from natural language
   */
  classifyIntent(input: string): UserIntent {
    const lower = input.toLowerCase();
    let bestCategory: IntentCategory = "explore";
    let bestConfidence = 0;
    const entities: Record<string, string> = {};

    for (const { patterns, category } of intentPatterns) {
      for (const pattern of patterns) {
        if (pattern.test(lower)) {
          const confidence = 0.7 + Math.random() * 0.25; // 0.7-0.95
          if (confidence > bestConfidence) {
            bestConfidence = confidence;
            bestCategory = category;
          }
        }
      }
    }

    // If no pattern matched, use context
    if (bestConfidence === 0) {
      bestCategory = this.inferFromContext();
      bestConfidence = 0.5;
    }

    // Extract domain as entity
    const domain = detectDomain(input);
    if (domain) {
      entities.domain = domain;
      entities.app_type = domain;
    }

    return {
      primary: bestCategory,
      confidence: bestConfidence,
      entities,
      suggestedActions: [],
    };
  }

  /**
   * Generate suggested actions based on intent, domain, and context
   */
  generateActions(
    intent: UserIntent,
    domain: string | null,
    input: string,
  ): SuggestedAction[] {
    const actions: SuggestedAction[] = [];

    switch (intent.primary) {
      case "build": {
        actions.push({
          id: "blueprint",
          label: "Generate Blueprint",
          description: "AI creates a full product blueprint for your idea",
          href: `/blueprint?q=${encodeURIComponent(input)}`,
          priority: 1,
          auto: true,
          module: "blueprint",
        });
        actions.push({
          id: "workspace",
          label: "Open AI Workspace",
          description: "Start building with AI assistance",
          href: `/workspace?q=${encodeURIComponent(input)}`,
          priority: 2,
          module: "workspace",
        });
        actions.push({
          id: "auth-rec",
          label: "Set Up Authentication",
          description: "Most apps need auth — add it early",
          href: "/workspace?q=Add%20authentication%20with%20Supabase%20Auth",
          priority: 3,
          module: "workspace",
        });
        actions.push({
          id: "scan-rec",
          label: "Security Scan Later",
          description: "Scan your deployment once it's live",
          href: "/scanner",
          priority: 5,
          module: "scanner",
        });
        if (domain) {
          actions.push({
            id: "project",
            label: `Create ${domain} Project`,
            description: `Auto-configure for ${domain} best practices`,
            href: `/workspace?q=Build%20a%20${domain}%20app%20with%20best%20practices`,
            priority: 1,
            auto: true,
            module: "workspace",
          });
        }
        break;
      }

      case "scan": {
        const domainMatch = input.match(/([\w-]+\.)+[\w-]+/);
        const scanDomain = domainMatch ? domainMatch[0] : "";
        actions.push({
          id: "scan",
          label: "Run Security Scan",
          description: scanDomain ? `Scan ${scanDomain} now` : "Enter a domain to scan",
          href: scanDomain ? `/scanner?domain=${scanDomain}` : "/scanner",
          priority: 1,
          auto: !!scanDomain,
          module: "scanner",
        });
        actions.push({
          id: "blueprint-sec",
          label: "Review Security Architecture",
          description: "Plan your security before deploying",
          href: "/blueprint?q=Security%20architecture%20for%20my%20application",
          priority: 2,
          module: "blueprint",
        });
        break;
      }

      case "blueprint": {
        actions.push({
          id: "blueprint-gen",
          label: "Generate Blueprint",
          description: "AI designs your system architecture",
          href: `/blueprint?q=${encodeURIComponent(input)}`,
          priority: 1,
          auto: true,
          module: "blueprint",
        });
        actions.push({
          id: "workspace-build",
          label: "Start Building from Blueprint",
          description: "Take the blueprint into the workspace",
          href: `/workspace?q=${encodeURIComponent(input)}`,
          priority: 2,
          module: "workspace",
        });
        break;
      }

      case "deploy": {
        actions.push({
          id: "deploy",
          label: "Deploy Application",
          description: "Ship your app to production",
          href: "/workspace?q=Help%20me%20deploy%20my%20application",
          priority: 1,
          module: "workspace",
        });
        actions.push({
          id: "pre-deploy-scan",
          label: "Pre-Deployment Security Scan",
          description: "Scan before going live",
          href: "/scanner",
          priority: 2,
          module: "scanner",
        });
        break;
      }

      case "debug": {
        actions.push({
          id: "workspace-debug",
          label: "Debug in AI Workspace",
          description: "Paste your error and get help",
          href: `/workspace?q=${encodeURIComponent(input)}`,
          priority: 1,
          auto: true,
          module: "workspace",
        });
        break;
      }

      case "learn": {
        actions.push({
          id: "workspace-learn",
          label: "Learn in AI Workspace",
          description: "Interactive explanation with examples",
          href: `/workspace?q=${encodeURIComponent(input)}`,
          priority: 1,
          auto: true,
          module: "workspace",
        });
        break;
      }

      default: {
        actions.push({
          id: "workspace",
          label: "Open AI Workspace",
          description: "Describe what you need",
          href: `/workspace?q=${encodeURIComponent(input)}`,
          priority: 1,
          module: "workspace",
        });
      }
    }

    return actions.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Generate a natural language reply
   */
  generateReply(
    intent: UserIntent,
    domain: string | null,
    actions: SuggestedAction[],
  ): string {
    const topAction = actions[0];
    const autoActions = actions.filter((a) => a.auto);

    switch (intent.primary) {
      case "build":
        if (domain) {
          return `I see you want to build a ${domain} application. I've prepared a blueprint and workspace for you.${autoActions.length > 0 ? " I can start automatically — just confirm." : ""}`;
        }
        return `I'll help you build that. I've set up the AI workspace and can generate a blueprint first if you'd like a plan.`;

      case "scan":
        return `Let's run a security scan. I can check HTTPS, headers, SSL, DNS, and more. ${topAction?.auto ? "I've pre-filled the domain for you." : "Enter the domain you want to scan."}`;

      case "blueprint":
        return `I'll generate a complete product blueprint — architecture, features, tech stack, pages, and API design. This gives you a solid plan before writing code.`;

      case "deploy":
        return `Before deploying, I recommend a security scan to catch any issues. Then I'll help you ship to production.`;

      case "debug":
        return `Paste the error or describe the issue in the workspace. I'll analyze it and suggest a fix.`;

      case "learn":
        return `Great question. Let me explain that in the workspace with examples and step-by-step guidance.`;

      default:
        return `I'm here to help. I can build, scan, blueprint, deploy, or explain — just tell me what you need.`;
    }
  }

  /**
   * Infer context updates from the current interaction
   */
  inferContextUpdate(intent: UserIntent, input: string): Partial<AIEContext> {
    const update: Partial<AIEContext> = {
      recentActions: [
        {
          type: intent.primary,
          label: input.slice(0, 60),
          timestamp: new Date(),
        },
        ...(this.context.recentActions || []).slice(0, 19),
      ],
    };

    return update;
  }

  /**
   * Fallback: infer intent from current page/context
   */
  private inferFromContext(): IntentCategory {
    const page = this.context.currentPage;
    if (page.includes("scanner")) return "scan";
    if (page.includes("blueprint")) return "blueprint";
    if (page.includes("workspace")) return "build";
    if (page.includes("dashboard")) return "manage";
    return "explore";
  }

  /**
   * Get smart suggestions for the dashboard
   */
  getDashboardSuggestions(): SuggestedAction[] {
    const suggestions: SuggestedAction[] = [];
    const { recentActions, userPreferences } = this.context;

    // Continue where left off
    if (recentActions.length > 0) {
      const last = recentActions[0];
      suggestions.push({
        id: "continue",
        label: `Continue: ${last.label}`,
        description: "Pick up where you left off",
        href: last.href || "/workspace",
        priority: 1,
        module: "workspace",
      });
    }

    // Frequency-based suggestions
    const moduleCounts: Record<string, number> = {};
    for (const action of recentActions) {
      moduleCounts[action.type] = (moduleCounts[action.type] || 0) + 1;
    }

    if ((moduleCounts["build"] || 0) > 2) {
      suggestions.push({
        id: "proj-suggest",
        label: "Create a New Project",
        description: "You've been building a lot — start something fresh",
        href: "/workspace",
        priority: 2,
        module: "workspace",
      });
    }

    if ((moduleCounts["scan"] || 0) > 0) {
      suggestions.push({
        id: "scan-followup",
        label: "Follow Up on Security",
        description: "Check if past issues are resolved",
        href: "/scanner",
        priority: 3,
        module: "scanner",
      });
    }

    // Always suggest blueprint for new users
    if (recentActions.length < 3) {
      suggestions.push({
        id: "first-blueprint",
        label: "Try the Blueprint Engine",
        description: "Describe an app and see AI generate a full plan",
        href: "/blueprint",
        priority: 2,
        module: "blueprint",
      });
    }

    return suggestions.sort((a, b) => a.priority - b.priority);
  }
}

// --- Singleton ---

let engineInstance: AegisIntelligenceEngine | null = null;

export function getAIE(context?: AIEContext): AegisIntelligenceEngine {
  if (!engineInstance || context) {
    engineInstance = new AegisIntelligenceEngine(
      context || {
        currentPage: "",
        currentProjectId: null,
        currentConversationId: null,
        openFileIds: [],
        recentActions: [],
        userPreferences: {
          frequentModules: [],
        },
      },
    );
  }
  return engineInstance;
}
