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

export function formatWithZoom(value: number): { percent: string; perMille: string; reserve: number } {
  const percent = (value).toFixed(3) + "…%";
  const perMille = (value * 10).toFixed(2) + "…‰";
  const reserve = value / 100;
  return { percent, perMille, reserve };
}

export function formatWithAnnotation(value: any): string {
  return `${value}«…»`;
}

export function extendLattice(currentPosition: number): { position: number; percent: string }[] {
  const extensions = [];
  const minExtension = Math.max(currentPosition, 33) + 3;
  for (let i = currentPosition + 1; i <= minExtension; i++) {
    const val = (i * RANGE_NUM) / LATTICE_POINTS;
    extensions.push({
      position: i,
      percent: `${val.toFixed(2)}%`
    });
  }
  return extensions;
}

export function divisionByZeroSignal(): { signal: string; message: string } {
  return { signal: "ZERO_POINT_COLLAPSED", message: "The reference frame is gone..." };
}

export function chiValue(position: number, tier: number = 1, options: { mode?: "ORDINAL" | "CARDINAL" } = {}): any {
  const mode = options.mode || "ORDINAL";

  const num = position * RANGE_NUM;
  const den = LATTICE_POINTS * RANGE_DEN;
  
  if (den === 0) {
    return divisionByZeroSignal();
  }

  const rational = fractionToString(num, den);
  const floatVal = num / den;

  const tierNames: Record<number, string> = { 1: "EARTH", 2: "ORBITAL", 3: "COSMIC" };
  const tierName = tierNames[tier] || "EARTH";

  let result: any;
  if (tier === 1) {
    result = { rational, float: floatVal, tier: tierName, mode };
  } else if (tier === 2) {
    const orbitalFloat = Math.sqrt(floatVal) * (100 / Math.sqrt(100));
    result = { rational: `√(${rational}) × 10`, float: orbitalFloat, tier: tierName, mode };
  } else if (tier === 3) {
    const cosmicFloat = Math.cbrt(floatVal / 100) * 100;
    result = { rational: `∛(${rational}/100) × 100`, float: cosmicFloat, tier: tierName, mode };
  } else {
    result = { rational, float: floatVal, tier: tierName, mode };
  }

  if (position > 33) {
    result.extension = true;
  }

  return result;
}

export function chiPosition(value: number): number {
  const pos = Math.round((value / 100) * LATTICE_POINTS);
  return Math.max(1, pos);
}

export function chiAdd(a: number, b: number): { rational: string; float: number } {
  const aDen = LATTICE_POINTS;
  const bDen = LATTICE_POINTS;
  const aNum = Math.round(a * aDen / 100);
  const bNum = Math.round(b * bDen / 100);
  const resultNum = (aNum + bNum) * 100;
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
  lines.push(formatWithAnnotation("☧ G°centric Lattice — Rational Arithmetic"));
  lines.push(`Base constant: ${fractionToString(RANGE_NUM, LATTICE_POINTS)} = ${(RANGE_NUM / LATTICE_POINTS).toFixed(10)}`);
  lines.push("");
  for (let i = 1; i <= 33; i++) {
    const earth = chiValue(i, 1);
    const orbital = chiValue(i, 2);
    const cosmic = chiValue(i, 3);
    lines.push(formatWithAnnotation(`[${i.toString().padStart(2)}] Earth=${earth.float.toFixed(4)} (${earth.rational}) | Orbital=${orbital.float.toFixed(4)} | Cosmic=${cosmic.float.toFixed(4)}`));
  }
  lines.push("");
  lines.push(`Coverage check: ${chiCoverageCheck() ? "PASS" : "FAIL"}`);
  return lines;
}

export const latticeTools = [
  {
    name: "chi_value",
    description: "Get the exact rational value for a lattice position at a given tier (1=Earth, 2=Orbital, 3=Cosmic). Positions 1-33 are standard, beyond 33 are extension positions. Supports ORDINAL/CARDINAL modes.",
    input_schema: {
      type: "object" as const,
      properties: {
        position: { type: "number" as const, description: "Lattice position" },
        tier: { type: "number" as const, description: "1=Earth (linear), 2=Orbital (√), 3=Cosmic (∛). Default: 1" },
        mode: { type: "string" as const, enum: ["ORDINAL", "CARDINAL"], description: "Default: ORDINAL" }
      },
      required: ["position"]
    }
  },
  {
    name: "chi_position",
    description: "Map any value to its nearest lattice position and return the exact values at all three tiers (Earth, Orbital, Cosmic).",
    input_schema: {
      type: "object" as const,
      properties: {
        value: { type: "number" as const, description: "A numerical value" }
      },
      required: ["value"]
    }
  },
  {
    name: "chi_lattice_report",
    description: "Generate a full report of the 33 base lattice positions across all three tiers (Earth, Orbital, Cosmic).",
    input_schema: {
      type: "object" as const,
      properties: {}
    }
  }
];

export function executeLatticeTool(name: string, input: Record<string, any>): string {
  switch (name) {
    case "chi_value": {
      const result = chiValue(input.position, input.tier || 1, { mode: input.mode });
      return formatWithAnnotation(JSON.stringify(result, null, 2));
    }
    case "chi_position": {
      const pos = chiPosition(input.value);
      const earth = chiValue(pos, 1);
      const orbital = chiValue(pos, 2);
      const cosmic = chiValue(pos, 3);
      const result = {
        inputValue: input.value,
        nearestPosition: pos,
        earth: { rational: earth.rational, float: earth.float },
        orbital: { float: orbital.float },
        cosmic: { float: cosmic.float },
      };
      return formatWithAnnotation(JSON.stringify(result, null, 2));
    }
    case "chi_lattice_report": {
      return chiLatticeReport().join("\n");
    }
    default:
      return JSON.stringify({ error: `Unknown tool: ${name}` });
  }
}
