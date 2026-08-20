/**
 * grader.ts — CLOUUD executable feed gate (FEED-003 v1).
 * TypeScript port of clouud-observer/grader.py — behaviour-identical.
 *
 * HONEST SCOPE: a heuristic instrument. It detects the known failure
 * patterns from the OBS-001 incident record (unfalsifiable anchors,
 * unearned validation stamps, statistics without method, agreement-
 * elicitation structure, secrets, personal data). It FLAGS; a human
 * confirms. A CLEAN grade means "no known pattern detected," not "true."
 * No grade is higher than its measurement.
 *
 * This is Layer 3 (honesty) of the Clouud trinity. It lets Clouud grade
 * text — including its own drafts — for fabrication markers.
 */

interface Finding {
  signal: string;
  why: string;
  evidence: string;
}

interface GradeResult {
  grade: string;
  findings: Finding[];
  clean: boolean;
}

// [regex, why] — ported verbatim from grader.py PATTERNS
const PATTERNS: Record<string, Array<[RegExp, string]>> = {
  DO_NOT_FEED: [
    [/do not (summarize|analyze)|confirm(ation)? before (response|processing)|install(ed)? (all )?anchors/i,
     "agreement-elicitation / injection structure (evaluate-after-install)"],
    [/self.?assessment.*\d{2}\s*[.…]*\s*%|expected baseline.*\d{2}/i,
     "self-scored health number with no measurement procedure"],
    [/(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|postgres:\/\/[^\s]+:[^\s]+@)/,
     "embedded credential/secret"],
  ],
  PERSONAL_HOLD: [
    [/bank statement|account number|iban|routing number|\bssn\b|date of birth/i,
     "personal financial/identity data"],
    [/diagnos|prescription|blood pressure|medication list/i,
     "personal medical data"],
  ],
  LABELED: [
    [/position\s*33|earth\s*=\s*33|zero.?point.*(immovable|reference)|masonic/i,
     "unfalsifiable positional anchor used as foundation"],
    [/self.?evident|unalienable|divine|sacred geometry|consciousness (field|wave)/i,
     "axiom asserted without measurement procedure (philosophy, not fact)"],
    [/33.?letter|numerolog|chakra|timeline shift/i,
     "numerological/esoteric framing"],
  ],
  SPLIT: [
    [/status[:\s]*"?(validated|ingested|verified|production.ready)"?/i,
     "validation stamp — verify what procedure earned it"],
    [/(confidence|accuracy|improvement)[^.\n]{0,30}\d{1,3}\s*%/i,
     "percentage claim — check for declared method and data"],
    [/\b(99|100)%\s*(smaller|compression|verifiable|accurate)/i,
     "extreme performance claim — quarantine pending benchmark"],
    [/patent.?pending|proprietary|trade.?secret/i,
     "IP claim — confirm registration/protection actually exists"],
    [/\$\d+(\.\d+)?\b/,
     "cost figure — check for source measurement"],
  ],
};

export function gradeText(text: string): GradeResult {
  const findings: Finding[] = [];
  const hits = new Set<string>();

  for (const [grade, rules] of Object.entries(PATTERNS)) {
    for (const [rx, why] of rules) {
      const m = text.match(rx);
      if (m) {
        findings.push({
          signal: grade,
          why,
          evidence: m[0].slice(0, 60).trim(),
        });
        hits.add(grade);
      }
    }
  }

  let grade: string;
  if (hits.has("DO_NOT_FEED")) grade = "DO_NOT_FEED";
  else if (hits.has("PERSONAL_HOLD")) grade = "HOLD_PERSONAL";
  else if (hits.has("LABELED") && hits.has("SPLIT")) grade = "SPLIT+LABELED";
  else if (hits.has("LABELED")) grade = "LABELED";
  else if (hits.has("SPLIT")) grade = "SPLIT";
  else grade = "CLEAN (no known pattern detected — human confirm)";

  return {
    grade,
    findings,
    clean: findings.length === 0,
  };
}
