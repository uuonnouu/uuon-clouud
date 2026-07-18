"""
homophone_inventory.py — static layer (OBS-001 §5).
Entries PARAMETERIZE the event log; they never enter it.
Priors here are similarity scores COMPUTED BY THE METRIC at load
time — no hand-entered numbers. Frequency-based chance rates are
a separate, future measurement (needs a named corpus).
"""
from linguistics.phonetic_layer import similarity

# (label, ipa_a, ipa_b, note) — IPA is the input; scores are derived.
PAIRS = [
    ("phil/fill",    "fɪl",      "fɪl",      "perfect homophone; observer-name collision, discount"),
    ("phil/feel",    "fɪl",      "fiːl",     "one-vowel distance; cross-checks German viel [fiːl]"),
    ("a.i./a-eye",   "eɪaɪ",     "eɪaɪ",     "perfect decomposition; AI puns are cheap collisions"),
    ("night/knight", "naɪt",     "naɪt",     "silent letters vanish in IPA; diphthong = 1 segment"),
    ("cents/sense",  "sɛnts",    "sɛns",     "phonemic near; phonetic identical w/ epenthetic [t]"),
    ("uuon/one",     "wʌn",      "wʌn",      "founder name; homophonic respelling of one/won; perfect homophone, discount"),
    ("right/rite",   "raɪt",     "raɪt",     "perfect triple w/ write; high prior, discount"),
]

def build_inventory():
    inv = {}
    for label, a, b, note in PAIRS:
        s = similarity(a, b)
        inv[label] = {"ipa": [a, b], "prior_similarity": s["similarity"],
                      "segments": [s["segments_a"], s["segments_b"]],
                      "note": note, "metric": s["metric"]}
    return inv

def inventory_prior(ipa: str, inv=None):
    """Max similarity of a candidate against the standing inventory.
    High value = cheap collision = discount before declaring a hit."""
    inv = inv or build_inventory()
    best, best_label = 0.0, None
    for label, e in inv.items():
        for known in e["ipa"]:
            s = similarity(ipa, known)["similarity"]
            if s > best:
                best, best_label = s, label
    return {"prior": best, "nearest_entry": best_label}
