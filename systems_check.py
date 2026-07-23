import os
import json

SKILLS_FILE = "skills.md"
REPORT_FILE = "repo_report.json"

# ----------------------------
# LOAD FILES
# ----------------------------
def load_skills():
    if not os.path.exists(SKILLS_FILE):
        print("No skills.md found")
        return []

    with open(SKILLS_FILE, "r", encoding="utf-8") as f:
        lines = f.readlines()

    # clean markdown -> usable skills
    skills = [
        line.strip("- \n")
        for line in lines
        if line.strip().startswith("-")
    ]

    return skills


def load_report():
    if not os.path.exists(REPORT_FILE):
        print("No repo_report.json found")
        return None

    with open(REPORT_FILE, "r", encoding="utf-8") as f:
        return json.load(f)


# ----------------------------
# CHECK ENGINE
# ----------------------------
def run_checks(skills, report):
    print("\n=== SYSTEM CHECKS ===\n")

    if not report:
        print("Missing repo report — run analyze_repo.py first")
        return

    usable = set(report.get("usable", []))
    internal = set(report.get("internal", []))

    # 1. Skill coverage check
    print("SKILL COVERAGE:")
    for s in skills:
        matched = any(s.lower() in u.lower() for u in usable)

        if matched:
            print(f"[OK] {s}")
        else:
            print(f"[MISSING] {s}")

    # 2. Entrypoint sanity check
    entrypoints = report.get("entrypoints", [])
    print("\nENTRYPOINTS:")
    if entrypoints:
        for e in entrypoints:
            print(f"[FOUND] {e}")
    else:
        print("[WARNING] No entrypoints detected")

    # 3. System health
    print("\nSYSTEM HEALTH:")
    total = report["summary"]["total_files"]
    usable_count = report["summary"]["usable_count"]

    ratio = usable_count / total if total else 0

    print(f"Usable ratio: {ratio:.2f}")

    if ratio > 0.6:
        print("[HEALTHY]")
    elif ratio > 0.3:
        print("[DEGRADED]")
    else:
        print("[BROKEN / INCOMPLETE]")


# ----------------------------
# MAIN
# ----------------------------
if __name__ == "__main__":
    skills = load_skills()
    report = load_report()
    run_checks(skills, report)