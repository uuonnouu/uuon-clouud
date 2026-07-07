/**
 * Founder API: Phillip Aguilar Ruiz III Context & Personalization
 * 
 * This layer enables:
 * 1. Persistent founder memory (preferences, decisions, patterns)
 * 2. Personalized reasoning (domain expertise, values, constraints)
 * 3. Mission enforcement (Phillip's anti-waste/anti-fraud/anti-gatekeeping vision)
 * 4. Context-aware responses (knows Phillip's background, work, constraints)
 */

/**
 * Founder Profile
 */
export interface FounderProfile {
  name: string;
  title: string;
  organization: string;
  bio: string;
  location: {
    current: string;
    origin: string;
  };
  background: {
    military: string;
    education: string;
    expertise: string[];
  };
  values: {
    mission: string; // anti-waste, anti-fraud, anti-gatekeeping
    earthZeroPoint: string;
    accountability: string;
  };
}

/**
 * Founder Memory: Persistent key-value store
 */
export interface FounderMemoryEntry {
  key: string; // unique identifier
  category: "preference" | "decision" | "insight" | "constraint" | "project" | "context";
  value: any;
  importance: number; // 1-10
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

/**
 * Founder Preferences
 */
export interface FounderPreferences {
  responseStyle: "direct" | "detailed" | "brief"; // how Phillip likes responses
  latticeDefaultTier: 1 | 2 | 3; // Earth, Orbital, Cosmic
  preferredLanguages: string[]; // ISO codes
  domainExpertise: string[]; // domains where Phillip is expert
  toolPreferences: {
    favorite: string[]; // tool names
    avoid: string[]; // tool names
  };
  privacyConstraints: string[]; // what data is sensitive
  collaborators: Array<{ name: string; domain: string }>;
  timeZone: string;
  workingHours?: { start: string; end: string };
}

/**
 * Mission Enforcement Rules
 */
export interface MissionRule {
  id: string;
  name: string;
  condition: string; // what triggers this rule
  action: "enforce" | "warn" | "suggest" | "block";
  details: string;
}

export const founderMissionRules: MissionRule[] = [
  {
    id: "no-hallucination",
    name: "Zero Hallucination",
    condition: "response contains unverified claim",
    action: "block",
    details: "Responses must cite sources or label speculation explicitly",
  },
  {
    id: "anti-waste",
    name: "Anti-Waste",
    condition: "response > 150 words without justified complexity",
    action: "warn",
    details: "Responses should be concise unless complexity demands detail",
  },
  {
    id: "anti-fraud",
    name: "Anti-Fraud",
    condition: "response contains contradictory or inconsistent claims",
    action: "block",
    details: "Consistency check: all claims must align with each other and known facts",
  },
  {
    id: "anti-gatekeeping",
    name: "Anti-Gatekeeping",
    condition: "response uses complex jargon without explanation",
    action: "warn",
    details: "Explain technical terms accessibly; don't hide knowledge behind gatekeeping language",
  },
  {
    id: "transparency",
    name: "Infrastructure Transparency",
    condition: "response omits dependency acknowledgment",
    action: "suggest",
    details: "Acknowledge underlying systems (Claude, OpenRouter, Ollama) when relevant",
  },
];

/**
 * Founder API: Main interface
 */
export class FounderAPI {
  private profile: FounderProfile = {
    name: "Phillip Aguilar Ruiz III",
    title: "Founder",
    organization: "UUON Foundation Inc.",
    bio: "US Army veteran. Mathematical visualization researcher. Creator of Clouud intelligence system.",
    location: {
      current: "Kassel, Germany",
      origin: "Yuma, Arizona",
    },
    background: {
      military: "United States Army veteran",
      education: "Self-taught mathematician and programmer",
      expertise: ["Mathematical visualization", "3D geometry", "AI reasoning systems", "Cryptography"],
    },
    values: {
      mission: "Reduce waste, oppose fraud, remove gatekeeping",
      earthZeroPoint: "The Earth is the only constant. All reasoning begins there.",
      accountability: "Every system must acknowledge its dependencies and limitations",
    },
  };

  private preferences: FounderPreferences = {
    responseStyle: "direct",
    latticeDefaultTier: 1,
    preferredLanguages: ["en", "es", "de"],
    domainExpertise: [
      "mathematical_visualization",
      "quantum_mechanics",
      "cryptography",
      "3d_geometry",
      "ai_systems",
    ],
    toolPreferences: {
      favorite: ["lunar_phase", "lattice_query", "dmension_explore"],
      avoid: [],
    },
    privacyConstraints: [],
    collaborators: [],
    timeZone: "Europe/Berlin",
  };

  private memory: Map<string, FounderMemoryEntry> = new Map();
  private memoryCounter = 0;

  /**
   * Get founder profile
   */
  getProfile(): FounderProfile {
    return this.profile;
  }

  /**
   * Get founder preferences
   */
  getPreferences(): FounderPreferences {
    return this.preferences;
  }

  /**
   * Store memory
   */
  rememberEntry(
    category: FounderMemoryEntry["category"],
    value: any,
    importance: number = 5,
    notes?: string
  ): { id: string; stored: FounderMemoryEntry } {
    const id = `mem_${++this.memoryCounter}`;
    const entry: FounderMemoryEntry = {
      key: id,
      category,
      value,
      importance,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes,
    };

    this.memory.set(id, entry);

    return { id, stored: entry };
  }

  /**
   * Recall memory
   */
  recall(category?: FounderMemoryEntry["category"]): FounderMemoryEntry[] {
    const entries = Array.from(this.memory.values());

    if (category) {
      return entries.filter((e) => e.category === category);
    }

    return entries.sort((a, b) => b.importance - a.importance);
  }

  /**
   * Update preference
   */
  setPreference<K extends keyof FounderPreferences>(key: K, value: FounderPreferences[K]): void {
    this.preferences[key] = value;

    this.rememberEntry(
      "preference",
      { key, value },
      8,
      `Updated founder preference: ${String(key)}`
    );
  }

  /**
   * Check mission compliance
   */
  checkMissionCompliance(responseContent: string): {
    compliant: boolean;
    violations: MissionRule[];
    warnings: MissionRule[];
  } {
    const violations: MissionRule[] = [];
    const warnings: MissionRule[] = [];

    for (const rule of founderMissionRules) {
      const ruleTriggered = this.evaluateRule(rule, responseContent);

      if (ruleTriggered) {
        if (rule.action === "block") {
          violations.push(rule);
        } else if (rule.action === "warn") {
          warnings.push(rule);
        }
      }
    }

    return {
      compliant: violations.length === 0,
      violations,
      warnings,
    };
  }

  /**
   * Evaluate if a rule is triggered
   */
  private evaluateRule(rule: MissionRule, responseContent: string): boolean {
    switch (rule.id) {
      case "no-hallucination":
        // Check for unverified claims (simplified)
        return responseContent.includes("[unverified]") || responseContent.includes("invent");

      case "anti-waste":
        // Check for excessive length
        return responseContent.split(/\s+/).length > 200;

      case "anti-fraud":
        // Check for contradictions (simplified)
        return this.detectContradictions(responseContent);

      case "anti-gatekeeping":
        // Check for unexplained jargon
        return /\b(algorithm|tensor|embeddings|latency|throughput)\b/.test(responseContent);

      default:
        return false;
    }
  }

  /**
   * Detect contradictions in response
   */
  private detectContradictions(text: string): boolean {
    // Simplified contradiction detection
    const hasAffirmAndDeny = text.includes("is") && text.includes("is not");
    return hasAffirmAndDeny;
  }

  /**
   * Build personalized system prompt
   */
  buildPersonalizedPrompt(domain: string, context?: string): string {
    const profile = this.profile;
    const prefs = this.preferences;
    const memories = this.recall("preference");

    return `
[CLOUUD PERSONALIZED FOR PHILLIP AGUILAR RUIZ III]

Founder: ${profile.name}
Organization: ${profile.organization}
Location: ${profile.location.current} (originally ${profile.location.origin})
Military: ${profile.background.military}
Mission: ${profile.values.mission}

---

PERSONAL CONTEXT FOR THIS SESSION:
Domain: ${domain}
${context ? `Additional context: ${context}` : ""}

---

FOUNDER PREFERENCES:
- Response style: ${prefs.responseStyle}
- Default lattice tier: ${["Earth", "Orbital", "Cosmic"][prefs.latticeDefaultTier - 1]}
- Languages: ${prefs.preferredLanguages.join(", ")}
- Domain expertise: ${prefs.domainExpertise.join(", ")}
- Favorite tools: ${prefs.toolPreferences.favorite.join(", ")}

---

STORED PREFERENCES & MEMORIES (${memories.length} entries):
${memories
  .slice(0, 5)
  .map((m) => `- [${m.category}] ${typeof m.value === "string" ? m.value : JSON.stringify(m.value)}`)
  .join("\n")}

---

MISSION ENFORCEMENT:
This response will be checked against 5 mission rules:
${founderMissionRules.map((r) => `1. ${r.name}: ${r.details}`).join("\n")}

---

TIME: ${new Date().toLocaleString("en-DE", { timeZone: prefs.timeZone })} (${prefs.timeZone})

---

FOUNDER VALUES:
"${profile.values.earthZeroPoint}"

Start reasoning from Earth. Return to Earth. The Earth is always right.
`;
  }

  /**
   * Log action for audit trail
   */
  logAction(action: string, details: Record<string, any>): void {
    this.rememberEntry(
      "decision",
      { action, details },
      7,
      `Founder action: ${action}`
    );
  }

  /**
   * Export all founder data (for backup/migration)
   */
  exportFounderData(): {
    profile: FounderProfile;
    preferences: FounderPreferences;
    memories: FounderMemoryEntry[];
  } {
    return {
      profile: this.profile,
      preferences: this.preferences,
      memories: Array.from(this.memory.values()),
    };
  }

  /**
   * Import founder data
   */
  importFounderData(data: {
    profile?: FounderProfile;
    preferences?: FounderPreferences;
    memories?: FounderMemoryEntry[];
  }): void {
    if (data.profile) {
      this.profile = data.profile;
    }
    if (data.preferences) {
      this.preferences = data.preferences;
    }
    if (data.memories) {
      for (const mem of data.memories) {
        this.memory.set(mem.key, mem);
      }
    }
  }
}

/**
 * Database schema
 */
export const founderAPISchema = {
  founder_memory: `
    CREATE TABLE IF NOT EXISTS founder_memory (
      id VARCHAR(255) PRIMARY KEY,
      category VARCHAR(100) NOT NULL,
      value JSONB NOT NULL,
      importance INTEGER DEFAULT 5,
      notes TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  founder_preferences: `
    CREATE TABLE IF NOT EXISTS founder_preferences (
      id SERIAL PRIMARY KEY,
      key VARCHAR(255) UNIQUE NOT NULL,
      value JSONB NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
  founder_audit_log: `
    CREATE TABLE IF NOT EXISTS founder_audit_log (
      id SERIAL PRIMARY KEY,
      action VARCHAR(255) NOT NULL,
      details JSONB NOT NULL,
      timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `,
};

export default {
  FounderAPI,
  founderMissionRules,
};
