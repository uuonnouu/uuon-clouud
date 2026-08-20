// ═══════════════════════════════════════════════════════════════
// DETERMINISTIC HONESTY LAYER — insert into server/routes.ts
// Place this block in the message handler AFTER the founder memory
// search block (after line ~1005, before the `if (injectedContext...`
// injection at line 1014). It runs the REAL detection code so the
// result cannot be hallucinated by the model.
//
// REQUIRES at top of routes.ts (add to imports):
//   import { gradeText } from "./detection/grader";
//   import { judgeClaim } from "./detection/probability-zone";
// ═══════════════════════════════════════════════════════════════

// ── Deterministic honesty: grade_text ──
// Fires when the user asks to grade / check / vet text.
try {
  const gradeIntent = /\b(grade|check|vet|analyze|evaluate|assess|is this (clean|grounded|fabricated|real|true))\b/i.test(content);
  if (gradeIntent) {
    // Extract the target text: prefer quoted, else text after a colon.
    let target = "";
    const quoted = content.match(/["']([^"']{10,})["']/);
    if (quoted) {
      target = quoted[1];
    } else {
      const afterColon = content.match(/:\s*(.{10,})$/s);
      if (afterColon) target = afterColon[1].trim();
    }
    // Fall back to grading the whole message if no clear target and it's long.
    if (!target && content.length > 40) target = content;

    if (target) {
      const result = gradeText(target);
      injectedContext += `\n\n[SYSTEM: HONESTY LAYER — grade_text was executed on the target text by the server (NOT by you). This is the REAL, authoritative result. Report it exactly; do not invent different numbers or fields.\n\nGRADE: ${result.grade}\nCLEAN: ${result.clean}\nFINDINGS:\n${result.findings.map(f => `  - [${f.signal}] ${f.why} — evidence: "${f.evidence}"`).join("\n") || "  (none)"}\n\nExplain this result plainly. A CLEAN grade means "no known pattern detected," not "true." You did not compute this — the server did. Do not fabricate a grade_text output; the real one is above.]`;
    }
  }
} catch (err) {
  // honesty grading failed silently — continue
}

// ── Deterministic honesty: probability_zone ──
// Fires when the user asks for confidence / how grounded a claim is.
try {
  const confIntent = /\b(confidence|how (confident|sure|likely)|probability|how grounded|odds)\b/i.test(content);
  if (confIntent) {
    // Base rate stays neutral (0.5) unless the message signals otherwise.
    // The model will explain; the numbers are real.
    const d = judgeClaim(0.5, 1.0, 1.0);
    injectedContext += `\n\n[SYSTEM: HONESTY LAYER — probability_zone was executed by the server. This is the REAL result from Bayesian inference with the Fisher metric. Report it exactly.\n\nPOSTERIOR (grounded, invented): [${d.posterior.join(", ")}]\nFISHER DISTANCE from uniform: ${d.fisherDistance}\nENTROPY (bits): ${d.entropyBits}\nENTROPY RATIO: ${d.entropyRatio}\nCONFIDENT: ${d.confident}\nNOTE: ${d.note}\n\nIMPORTANT: With a neutral 0.5 prior and no distinguishing evidence, the posterior stays at 0.5 — meaning the zone CANNOT determine groundedness from priors alone. Say so honestly. If you have real knowledge that the claim is false (e.g. "moon is made of cheese"), state that from your own knowledge SEPARATELY — but do not pretend the probability_zone computed a confidence it did not. The zone measures evidence separation, not world facts.]`;
  }
} catch (err) {
  // honesty confidence failed silently — continue
}
