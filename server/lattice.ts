const LATTICE_POINTS = 33;
const RANGE_NUM = 100;
const RANGE_DEN = 1;

function fractionToString(num: number, den: number): string {
  const g = gcd(Math.abs(num), Math.abs(den));
  return `${num / g}/${den / g}`;
}

function gcd(a: number, b: number): number {
  while (b !== 0) {
    [a, b] = [b, a % b];
  }
  return a;
}

export function chiValue(position: number, tier: number = 1): { rational: string; float: number; tier: string } {
  if (position < 1 || position > 33) {
    throw new Error(`Position must be 1–33, got ${position}`);
  }

  const num = position * RANGE_NUM;
  const den = LATTICE_POINTS * RANGE_DEN;
  const rational = fractionToString(num, den);
  const floatVal = num / den;

  const tierNames: Record<number, string> = { 1: "EARTH", 2: "ORBITAL", 3: "COSMIC" };
  const tierName = tierNames[tier] || "EARTH";

  if (tier === 1) {
    return { rational, float: floatVal, tier: tierName };
  } else if (tier === 2) {
    const orbitalFloat = Math.sqrt(floatVal) * (100 / Math.sqrt(100));
    return { rational: `√(${rational}) × 10`, float: orbitalFloat, tier: tierName };
  } else if (tier === 3) {
    const cosmicFloat = Math.cbrt(floatVal / 100) * 100;
    return { rational: `∛(${rational}/100) × 100`, float: cosmicFloat, tier: tierName };
  }

  return { rational, float: floatVal, tier: tierName };
}

export function chiPosition(value: number): number {
  const pos = Math.round((value / 100) * LATTICE_POINTS);
  return Math.max(1, Math.min(33, pos));
}

export function chiAdd(a: number, b: number): { rational: string; float: number } {
  const aDen = LATTICE_POINTS;
  const bDen = LATTICE_POINTS;
  const aNum = Math.round(a * aDen / 100) * 100;
  const bNum = Math.round(b * bDen / 100) * 100;
  const resultNum = aNum + bNum;
  const resultDen = aDen;
  return {
    rational: fractionToString(resultNum, resultDen),
    float: resultNum / resultDen
  };
}

export function chiCoverageCheck(): boolean {
  let totalNum = 0;
  for (let i = 1; i <= 33; i++) {
    totalNum += i * RANGE_NUM;
  }
  const totalFloat = totalNum / (LATTICE_POINTS * RANGE_DEN);
  return Math.abs(totalFloat - ((33 * 34 / 2) * 100 / 33)) < 0.01;
}

export function chiLatticeReport(): string[] {
  const lines: string[] = [];
  lines.push("☧ G°centric Lattice — Rational Arithmetic");
  lines.push(`Base constant: ${fractionToString(RANGE_NUM, LATTICE_POINTS)} = ${(RANGE_NUM / LATTICE_POINTS).toFixed(10)}`);
  lines.push("");
  for (let i = 1; i <= 33; i++) {
    const earth = chiValue(i, 1);
    const orbital = chiValue(i, 2);
    const cosmic = chiValue(i, 3);
    lines.push(`[${i.toString().padStart(2)}] Earth=${earth.float.toFixed(4)} (${earth.rational}) | Orbital=${orbital.float.toFixed(4)} | Cosmic=${cosmic.float.toFixed(4)}`);
  }
  lines.push("");
  lines.push(`Coverage check: ${chiCoverageCheck() ? "PASS" : "FAIL"}`);
  return lines;
}

export const latticeTools = [
  {
    name: "chi_value",
    description: "Get the exact rational value for a lattice position (1–33) at a given tier (1=Earth, 2=Orbital, 3=Cosmic). Use this for ANY mathematical calculation involving the G°centric lattice.",
    input_schema: {
      type: "object" as const,
      properties: {
        position: { type: "number" as const, description: "Lattice position (1–33)" },
        tier: { type: "number" as const, description: "1=Earth (linear), 2=Orbital (√), 3=Cosmic (∛). Default: 1" }
      },
      required: ["position"]
    }
  },
  {
    name: "chi_position",
    description: "Map any value (0–100) to its nearest lattice position (1–33) and return the exact values at all three tiers (Earth, Orbital, Cosmic).",
    input_schema: {
      type: "object" as const,
      properties: {
        value: { type: "number" as const, description: "A value from 0 to 100" }
      },
      required: ["value"]
    }
  },
  {
    name: "chi_lattice_report",
    description: "Generate a full report of all 33 lattice positions across all three tiers (Earth, Orbital, Cosmic).",
    input_schema: {
      type: "object" as const,
      properties: {}
    }
  }
];

export function executeLatticeTool(name: string, input: Record<string, any>): string {
  switch (name) {
    case "chi_value": {
      const result = chiValue(input.position, input.tier || 1);
      return JSON.stringify(result, null, 2);
    }
    case "chi_position": {
      const pos = chiPosition(input.value);
      const earth = chiValue(pos, 1);
      const orbital = chiValue(pos, 2);
      const cosmic = chiValue(pos, 3);
      return JSON.stringify({
        inputValue: input.value,
        nearestPosition: pos,
        earth: { rational: earth.rational, float: earth.float },
        orbital: { float: orbital.float },
        cosmic: { float: cosmic.float },
      }, null, 2);
    }
    case "chi_lattice_report": {
      return chiLatticeReport().join("\n");
    }
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
