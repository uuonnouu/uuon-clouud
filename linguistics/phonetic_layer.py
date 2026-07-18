"""
phonetic_layer.py — CLOUUD linguistic layer, v1.
Metric ID: ipa_segment_levenshtein_v1 (pinned per OBS-001 §3).

Diphthongs, affricates, and long vowels are SINGLE segments.
This is the fix: character-level comparison inflates distances
("eye" = 2 chars but 1 segment /aI/). Segment-level matches how
the ear parses, which is the layer felt coincidences track.

Two layers, kept distinct (OBS-001):
  phonemic  = dictionary citation form
  phonetic  = surface form as produced (epenthesis etc.)
Callers pass both; both scores are logged.
"""

# Multi-char segments, longest-match-first. Declared, not learned.
MULTI = [
    "aɪ", "aʊ", "eɪ", "oʊ", "ɔɪ", "ɪə", "eə", "ʊə", "əʊ",   # diphthongs
    "tʃ", "dʒ",                                              # affricates
    "iː", "uː", "ɑː", "ɔː", "ɜː",                            # long vowels
]
STRIP = set("ˈˌ ./[]")  # stress marks, spaces, slashes, brackets

def tokenize(ipa: str):
    """IPA string -> list of segments. Greedy longest match."""
    s = "".join(ch for ch in ipa if ch not in STRIP)
    out, i = [], 0
    while i < len(s):
        for m in MULTI:
            if s.startswith(m, i):
                out.append(m); i += len(m); break
        else:
            out.append(s[i]); i += 1
    return out

def levenshtein(a, b):
    """Standard DP over segment lists."""
    m, n = len(a), len(b)
    prev = list(range(n + 1))
    for i in range(1, m + 1):
        cur = [i] + [0] * n
        for j in range(1, n + 1):
            cur[j] = min(prev[j] + 1, cur[j-1] + 1,
                         prev[j-1] + (a[i-1] != b[j-1]))
        prev = cur
    return prev[n]

def similarity(ipa_a: str, ipa_b: str) -> dict:
    """Returns segments, distance, and normalized similarity.
    similarity = 1 - distance / max(len_a, len_b). Reproducible."""
    ta, tb = tokenize(ipa_a), tokenize(ipa_b)
    if not ta or not tb:
        return {"segments_a": ta, "segments_b": tb,
                "distance": None, "similarity": 0.0,
                "metric": "ipa_segment_levenshtein_v1"}
    d = levenshtein(ta, tb)
    return {"segments_a": ta, "segments_b": tb, "distance": d,
            "similarity": round(1 - d / max(len(ta), len(tb)), 3),
            "metric": "ipa_segment_levenshtein_v1"}

def score_pair(phonemic_a, phonemic_b, phonetic_a=None, phonetic_b=None):
    """Dual-layer score. Phonetic defaults to phonemic if no surface
    form is supplied — logged as such, never silently upgraded."""
    out = {"phonemic": similarity(phonemic_a, phonemic_b)}
    if phonetic_a and phonetic_b:
        out["phonetic"] = similarity(phonetic_a, phonetic_b)
        out["phonetic_source"] = "declared_surface_form"
    else:
        out["phonetic"] = out["phonemic"]
        out["phonetic_source"] = "defaulted_to_phonemic"
    return out
