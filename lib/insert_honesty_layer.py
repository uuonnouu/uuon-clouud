#!/usr/bin/env python3
"""
insert_honesty_layer.py — inserts the deterministic honesty blocks into
server/routes.ts right after the founder-memory catch block (line ~988).
Self-contained: the code to insert is embedded below.
Run from uuon-clouud root: python3 insert_honesty_layer.py
"""
import sys

ROUTES = "server/routes.ts"

# The anchor: we insert AFTER the closing brace of the founder-memory
# try/catch. That block ends with this exact line followed by "  }".
ANCHOR = "    // Founder memory search failed silently — continue without it"

HONESTY_BLOCK = '''
      // ── DETERMINISTIC HONESTY LAYER (grade_text) ──
      // Runs the REAL grader server-side so the result cannot be hallucinated.
      try {
        const gradeIntent = /\\b(grade|check|vet|analyze|evaluate|assess|is this (clean|grounded|fabricated|real|true))\\b/i.test(content);
        if (gradeIntent) {
          let target = "";
          const quoted = content.match(/["']([^"']{10,})["']/);
          if (quoted) {
            target = quoted[1];
          } else {
            const afterColon = content.match(/:\\s*(.{10,})$/s);
            if (afterColon) target = afterColon[1].trim();
          }
          if (!target && content.length > 40) target = content;
          if (target) {
            const result = gradeText(target);
            injectedContext += `\\n\\n[SYSTEM: HONESTY LAYER — grade_text was executed on the target text by the server (NOT by you). This is the REAL, authoritative result. Report it exactly; do not invent different numbers or fields.\\n\\nGRADE: ${result.grade}\\nCLEAN: ${result.clean}\\nFINDINGS:\\n${result.findings.map(f => `  - [${f.signal}] ${f.why} — evidence: "${f.evidence}"`).join("\\n") || "  (none)"}\\n\\nExplain this result plainly. A CLEAN grade means "no known pattern detected," not "true." You did not compute this — the server did. Do not fabricate a grade_text output; the real one is above.]`;
          }
        }
      } catch (err) {
        // honesty grading failed silently — continue
      }

      // ── DETERMINISTIC HONESTY LAYER (probability_zone) ──
      try {
        const confIntent = /\\b(confidence|how (confident|sure|likely)|probability|how grounded|odds)\\b/i.test(content);
        if (confIntent) {
          const d = judgeClaim(0.5, 1.0, 1.0);
          injectedContext += `\\n\\n[SYSTEM: HONESTY LAYER — probability_zone was executed by the server. This is the REAL result from Bayesian inference with the Fisher metric. Report it exactly.\\n\\nPOSTERIOR (grounded, invented): [${d.posterior.join(", ")}]\\nFISHER DISTANCE from uniform: ${d.fisherDistance}\\nENTROPY (bits): ${d.entropyBits}\\nENTROPY RATIO: ${d.entropyRatio}\\nCONFIDENT: ${d.confident}\\nNOTE: ${d.note}\\n\\nIMPORTANT: With a neutral 0.5 prior and no distinguishing evidence, the posterior stays at 0.5 — meaning the zone CANNOT determine groundedness from priors alone. Say so honestly. If you have real knowledge that the claim is false, state that from your own knowledge SEPARATELY — but do not pretend the probability_zone computed a confidence it did not. The zone measures evidence separation, not world facts.]`;
        }
      } catch (err) {
        // honesty confidence failed silently — continue
      }
'''

def main():
    src = open(ROUTES, encoding="utf-8").read()

    if "HONESTY LAYER" in src:
        print("✗ Honesty layer already present. Aborting to avoid duplicate.")
        sys.exit(1)

    if ANCHOR not in src:
        print(f"✗ Anchor not found: {ANCHOR!r}")
        print("  The founder-memory catch line may have changed. Aborting.")
        sys.exit(1)

    # The founder-memory block is:
    #     } catch (err) {
    #       // Founder memory search failed silently — continue without it
    #     }
    # We insert AFTER the closing "  }" that follows the anchor line.
    lines = src.splitlines(keepends=True)
    out = []
    inserted = False
    for i, line in enumerate(lines):
        out.append(line)
        if not inserted and ANCHOR in line:
            # next line should be the closing brace of the catch
            if i + 1 < len(lines) and lines[i + 1].strip() == "}":
                out.append(lines[i + 1])   # the closing brace
                out.append(HONESTY_BLOCK)
                # mark so we skip re-adding the brace
                lines[i + 1] = "__ALREADY_ADDED__"
                inserted = True

    if not inserted:
        print("✗ Could not locate the closing brace after the anchor. Aborting.")
        sys.exit(1)

    result = "".join(l for l in out if l != "__ALREADY_ADDED__")
    open(ROUTES, "w", encoding="utf-8").write(result)
    print("✓ Honesty layer inserted after founder-memory block.")
    print("  Next: npx tsc --noEmit, then commit.")

if __name__ == "__main__":
    main()
