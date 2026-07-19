"""Gate test. Fails loudly if the pinned metric does not reproduce
the OBS-001 canonical instance. No commit on failure."""
import sys, json
sys.path.insert(0, ".")
from linguistics.phonetic_layer import score_pair, tokenize
from linguistics.homophone_inventory import build_inventory

fails = []

# Canonical instance: makes cents / makes sense
r = score_pair("meɪks sɛnts", "meɪks sɛns",
               phonetic_a="meɪks sɛnts", phonetic_b="meɪks sɛnts")
if len(r["phonemic"]["segments_a"]) != 9: fails.append("cents != 9 segments")
if len(r["phonemic"]["segments_b"]) != 8: fails.append("sense != 8 segments")
if r["phonemic"]["similarity"] != 0.889:  fails.append(f"phonemic {r['phonemic']['similarity']} != 0.889")
if r["phonetic"]["similarity"] != 1.0:    fails.append(f"phonetic {r['phonetic']['similarity']} != 1.0")

# Diphthong discipline: eye = one segment, night = knight
if tokenize("aɪ") != ["aɪ"]:              fails.append("diphthong split into chars")
inv = build_inventory()
if inv["night/knight"]["prior_similarity"] != 1.0: fails.append("night/knight != 1.0")
if inv["phil/feel"]["prior_similarity"]  != 0.667: fails.append(f"phil/feel {inv['phil/feel']['prior_similarity']} != 0.667")

print(json.dumps({"canonical": r["phonemic"]["similarity"],
                  "phonetic": r["phonetic"]["similarity"],
                  "inventory_entries": len(inv),
                  "failures": fails}, indent=1, ensure_ascii=False))
if fails: sys.exit(1)
print("GATE PASSED — metric reproduces canonical instance.")
