import crypto from "crypto";

const CULTURES = ["egyptian", "greek", "latin", "english"] as const;

type TetrahedronResult = {
  position: number;
  angle: number;
  culture: string;
  hash: string;
};

function processWithCulture(input: string, culture: string): string {
  switch (culture) {
    case "egyptian":
      return input;
    case "greek":
      return input.split("").map(c => c + c).join("");
    case "latin":
      return input.split("").map(c => c + c + c).join("");
    case "english":
      return input.split("").map(c => c + c + c + c).join("");
    default:
      return input;
  }
}

export function ellomental(content: string): {
  circleHash: string;
  tetrahedra: TetrahedronResult[];
  frequency: number;
  energy: number;
} {
  const tetrahedra: TetrahedronResult[] = [];

  for (let i = 0; i < 12; i++) {
    const angle = (i * 30) % 360;
    const culture = CULTURES[i % 4];
    const rotatedInput = content + String(angle) + culture;
    const processed = processWithCulture(rotatedInput, culture);
    const hash = crypto.createHash("sha256").update(processed).digest("hex").slice(0, 13);

    tetrahedra.push({ position: i, angle, culture, hash });
  }

  const circleSignature = tetrahedra.map(t => t.hash).join("");
  const circleHash = crypto.createHash("sha256").update(circleSignature).digest("hex");

  return {
    circleHash,
    tetrahedra,
    frequency: 12 * 13,
    energy: (12 * 13) ** 2,
  };
}

export function generateProvenanceHash(content: string): string {
  const signature = JSON.stringify({
    origin: "UUON-FOUNDATION-GCENTRIC-V1",
    founder: "Phillip Aguilar Ruiz III",
    system: "G°centric Lattice v1.0",
    timestamp: new Date().toISOString(),
    lattice: "33-point · Earth-grounded · 3-tier",
  });

  const { circleHash } = ellomental(content + signature);
  return circleHash;
}
