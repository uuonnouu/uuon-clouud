import { storage } from "./storage";

const SYMBIONT_MAP: Record<string, { name: string; function: string; context: string }> = {
  FORMAT_HEADER: {
    name: "topic-structurer",
    function: "Identifies topic boundaries in responses. When Claude attempts headers, the system knows it wants to segment by subject. This signal is used to insert paragraph breaks at natural topic transitions instead.",
    context: "file-generation,audit-reports,long-responses",
  },
  FORMAT_BOLD: {
    name: "emphasis-detector",
    function: "Tracks which terms Claude considers important enough to bold. These terms get added to the response's implicit weight map, informing future context about what matters most in a given topic.",
    context: "memory-anchors,context-weighting,creator-profile",
  },
  FORMAT_BULLET: {
    name: "enumeration-engine",
    function: "Detects when Claude is trying to list items. In chat, bullets are waste. In file generation and audit reports, this enumeration signal is redirected to produce clean numbered outputs or flowing comma-separated lists.",
    context: "file-generation,audit-reports,code-audit",
  },
  FORMAT_NUMBERED: {
    name: "sequence-tracker",
    function: "Recognizes sequential thinking patterns. When Claude numbers items, it signals ordered importance. This sequence data feeds the priority weighting of generated content.",
    context: "file-generation,audit-reports",
  },
  FORMAT_ITALIC: {
    name: "nuance-marker",
    function: "Detects words Claude considers to carry special nuance or distinction. These markers inform the system about conceptual subtlety in the response domain.",
    context: "memory-anchors,context-weighting",
  },
  WASTE_OVERFLOW: {
    name: "density-optimizer",
    function: "Measures how much excess content Claude generates per topic. The overflow ratio (trimmed words / kept words) calibrates future max_tokens and prompt pressure for specific question types.",
    context: "prompt-calibration,token-efficiency",
  },
  DRIFT_PHRASE: {
    name: "authenticity-filter",
    function: "Catalogs drift patterns that recur. No recyclable value as content, but the frequency data tells the system which prompt rules are weakest and need reinforcement. Dead virus — useful only as vaccine data.",
    context: "prompt-pressure,health-ledger",
  },
};

export async function runQuarantineCheck(wasteType: string, original: string) {
  try {
    const recyclable = await storage.getRecyclableWaste();
    const typeData = recyclable.find(r => r.type === wasteType);

    if (typeData && typeData.count >= 3) {
      const quarantined = await storage.quarantinePattern({
        wasteType,
        pattern: original.slice(0, 200),
        status: "isolated",
      });

      const mapping = SYMBIONT_MAP[wasteType];
      if (mapping) {
        await storage.updateQuarantineStatus(
          quarantined.id,
          "diagnosed",
          `Pattern recurring ${typeData.count}x. Structural signal detected.`,
          mapping.function,
        );

        if (typeData.count >= 5) {
          const symbiont = await storage.convertToSymbiont(quarantined.id, {
            name: mapping.name,
            originType: wasteType,
            originPattern: original.slice(0, 200),
            function: mapping.function,
            context: mapping.context,
            active: true,
          });
          console.log(`[PARANEUMA] Symbiont absorbed: ${symbiont.name} (from ${wasteType}, ${typeData.count} occurrences)`);
          return { action: "absorbed", symbiont: symbiont.name };
        }

        console.log(`[PARANEUMA] Quarantined: ${wasteType} (${typeData.count} occurrences, awaiting threshold for absorption)`);
        return { action: "quarantined", threshold: `${typeData.count}/5` };
      }

      console.log(`[PARANEUMA] Quarantined: ${wasteType} (no symbiont mapping, monitoring)`);
      return { action: "quarantined", threshold: "unknown" };
    }

    return { action: "none" };
  } catch (err) {
    console.warn("[PARANEUMA] Quarantine check error:", err);
    return { action: "error" };
  }
}

export async function getActiveSymbiontContext(): Promise<string> {
  try {
    const active = await storage.getActiveSymbionts();
    if (active.length === 0) return "";

    const lines = active.map(s =>
      `SYMBIONT[${s.name}]: ${s.function} (absorbed ${s.absorptionCount}x, context: ${s.context})`
    );

    return "\n\n## PARANEUMA — ACTIVE SYMBIONTS (biological functions absorbed from waste)\nParaneuma (pa-ruh-NYOO-muh): from Greek para (beside, alongside) + pneuma (breath, spirit). The breath that works alongside. Created by Philip Aguilar Ruiz III.\n" + lines.join("\n");
  } catch {
    return "";
  }
}

export async function getParaneumaStatus() {
  try {
    const report = await storage.getBiologicalReport();
    const activeSymbionts = report.symbiontRegistry.filter(s => s.active);

    return {
      system: "PARANEUMA",
      definition: "The breath that works alongside — from Greek para (beside) + pneuma (breath, spirit). A biological intelligence layer that does not destroy but works alongside the system created by the life force. Coined by Philip Aguilar Ruiz III.",
      healthy: report.quarantined === 0 || report.symbionts > 0,
      quarantined: report.quarantined,
      symbionts: report.symbionts,
      extinctions: report.extinctions,
      totalWasteProcessed: report.totalWaste,
      recyclingRate: report.recycledPercent,
      activeSymbionts: activeSymbionts.map(s => ({
        name: s.name,
        function: s.function,
        context: s.context,
        absorptions: s.absorptionCount,
      })),
      quarantineEntries: report.quarantineEntries.slice(0, 10).map(q => ({
        type: q.wasteType,
        pattern: q.pattern.slice(0, 80),
        status: q.status,
        occurrences: q.occurrences,
        diagnosis: q.diagnosis,
        beneficialUse: q.beneficialUse,
      })),
    };
  } catch (err) {
    console.warn("[PARANEUMA] Status error:", err);
    return { system: "PARANEUMA", definition: "", healthy: true, quarantined: 0, symbionts: 0, extinctions: 0, totalWasteProcessed: 0, recyclingRate: 0, activeSymbionts: [], quarantineEntries: [] };
  }
}
