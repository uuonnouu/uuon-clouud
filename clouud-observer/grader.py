"""
grader.py — CLOUUD executable feed gate (FEED-003 v1).
Usage: python3 grader.py <file> [file2 ...]
Emits per file: grade (CLEAN / SPLIT / LABELED / HOLD / DO_NOT_FEED),
findings with the matched evidence, and a confidence note.

HONEST SCOPE: this is a heuristic instrument. It detects the known
failure patterns from the OBS-001 incident record (unfalsifiable
anchors, unearned validation stamps, statistics without method,
agreement-elicitation structure, secrets, personal data). It flags;
a human confirms. A CLEAN grade means "no known pattern detected,"
not "true." No grade is higher than its measurement.
"""
import sys, re, json, os

PATTERNS = {
 "DO_NOT_FEED": [
   (r"(?i)do not (summarize|analyze)|confirm(ation)? before (response|processing)|install(ed)? (all )?anchors",
    "agreement-elicitation / injection structure (evaluate-after-install)"),
   (r"(?i)self.?assessment.*\d{2}\s*[.…]*\s*%|expected baseline.*\d{2}",
    "self-scored health number with no measurement procedure"),
   (r"(sk-[A-Za-z0-9]{20,}|ghp_[A-Za-z0-9]{20,}|AKIA[0-9A-Z]{16}|postgres://[^\s]+:[^\s]+@)",
    "embedded credential/secret"),
 ],
 "PERSONAL_HOLD": [
   (r"(?i)bank statement|account number|iban|routing number|\bssn\b|date of birth",
    "personal financial/identity data"),
   (r"(?i)diagnos|prescription|blood pressure|medication list",
    "personal medical data"),
 ],
 "LABELED": [
   (r"(?i)position\s*33|earth\s*=\s*33|zero.?point.*(immovable|reference)|masonic",
    "unfalsifiable positional anchor used as foundation"),
   (r"(?i)self.?evident|unalienable|divine|sacred geometry|consciousness (field|wave)",
    "axiom asserted without measurement procedure (philosophy, not fact)"),
   (r"(?i)33.?letter|numerolog|chakra|timeline shift",
    "numerological/esoteric framing"),
 ],
 "SPLIT": [
   (r"(?i)status[:\s]*\"?(validated|ingested|verified|production.ready)\"?",
    "validation stamp — verify what procedure earned it"),
   (r"(?i)(confidence|accuracy|improvement)[^.\n]{0,30}\d{1,3}\s*%",
    "percentage claim — check for declared method and data"),
   (r"(?i)\b(99|100)%\s*(smaller|compression|verifiable|accurate)",
    "extreme performance claim — quarantine pending benchmark"),
   (r"(?i)patent.?pending|proprietary|trade.?secret",
    "IP claim — confirm registration/protection actually exists"),
   (r"\$\d+(\.\d+)?\b",
    "cost figure — check for source measurement"),
 ],
}

def grade_text(text):
    findings, hits = [], set()
    for grade, rules in PATTERNS.items():
        for rx, why in rules:
            m = re.search(rx, text)
            if m:
                findings.append({"signal": grade, "why": why,
                                 "evidence": m.group(0)[:60].strip()})
                hits.add(grade)
    if "DO_NOT_FEED" in hits: final = "DO_NOT_FEED"
    elif "PERSONAL_HOLD" in hits: final = "HOLD_PERSONAL"
    elif "LABELED" in hits and "SPLIT" in hits: final = "SPLIT+LABELED"
    elif "LABELED" in hits: final = "LABELED"
    elif "SPLIT" in hits: final = "SPLIT"
    else: final = "CLEAN (no known pattern detected — human confirm)"
    return final, findings

def main(paths):
    out = []
    for p in paths:
        try:
            t = open(p, encoding="utf-8", errors="ignore").read()
        except Exception as e:
            out.append({"file": p, "error": str(e)}); continue
        g, f = grade_text(t)
        out.append({"file": os.path.basename(p), "grade": g, "findings": f})
    print(json.dumps(out, indent=1))

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("usage: python3 grader.py <file> [...]"); sys.exit(1)
    main(sys.argv[1:])
