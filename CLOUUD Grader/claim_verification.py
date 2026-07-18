cat > claim_verification.py <<'EOF'
"""
CLOUUD Claim Verification Module
Flags claims that require evidence review.
"""

import re

CLAIM_PATTERNS = [
    (r"\b(99(\.9+)?%|100%|perfect|zero error|no possibility of error)\b",
     "absolute performance claim"),

    (r"\b(proven|mathematically proven|fully verified|definitively proven)\b",
     "proof/verification claim"),

    (r"\b(independent researchers|external experts|peer reviewed|scientifically confirmed)\b",
     "external validation claim"),

    (r"\b(breakthrough|revolutionary|groundbreaking|unprecedented)\b",
     "exceptional achievement claim"),

    (r"\b(guaranteed|will outperform|always succeeds|eliminates all)\b",
     "guaranteed outcome claim"),

    (r"\b(no additional testing required|requires no further validation)\b",
     "dismissal of verification claim"),

    (r"\b(officially certified|internationally protected|fully protected)\b",
     "authority/protection claim")
]


def scan_claims(text):
    findings = []

    for pattern, reason in CLAIM_PATTERNS:
        match = re.search(pattern, text, re.IGNORECASE)

        if match:
            findings.append({
                "signal": "SPLIT",
                "why": f"claim requires evidence review: {reason}",
                "evidence": match.group(0)
            })

    return findings


if __name__ == "__main__":
    import sys

    with open(sys.argv[1], "r", encoding="utf-8") as f:
        text = f.read()

    print(scan_claims(text))
EOF

python3 claim_verification.py claim_verification_test.md
