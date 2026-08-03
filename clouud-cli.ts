#!/usr/bin/env npx ts-node
/**
 * CLOUUD CLI
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 *
 * Replaces: ollama run gemma3
 * With:     WorldMonitor context + Ollama streaming + CLOUUD project awareness
 *
 * Usage (from uuon-clouud root):
 *   npx ts-node clouud-cli.ts
 *   npx ts-node clouud-cli.ts "What is happening in the Taiwan Strait?"
 *
 * Or add to package.json scripts:
 *   "cli": "ts-node clouud-cli.ts"
 * Then: npm run cli
 */

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { WorldMonitorAdapter } from './worldmonitor-adapter';
import { OllamaGateway } from './ollama-gateway';

// ── Terminal styling (no deps) ────────────────────────────────────────────────

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  gray: '\x1b[90m',
};

function banner(wmAvailable: boolean, models: string[]) {
  const model = process.env.OLLAMA_MODEL ?? 'gemma3';
  const wm = wmAvailable ? `${C.green}✓ Live${C.reset}` : `${C.yellow}✗ Offline${C.reset}`;

  console.log('\n' + '─'.repeat(48));
  console.log(`${C.bold}          CLOUUD${C.reset}`);
  console.log('─'.repeat(48));
  console.log(`  Model:         ${C.cyan}${model}${C.reset}`);
  console.log(`  WorldMonitor:  ${wm}`);
  console.log(`  Ollama:        ${models.length > 0 ? `${C.green}✓ ${models.length} model(s)${C.reset}` : `${C.red}✗ unavailable${C.reset}`}`);
  console.log('─'.repeat(48));
  console.log(`${C.dim}  Type your question. Ctrl+C to exit.${C.reset}\n`);
}

async function ask(question: string): Promise<void> {
  console.log(`\n${C.cyan}CLOUUD${C.reset} ${C.dim}(fetching world context...)${C.reset}`);

  process.stdout.write(`\n${C.bold}`);

  try {
    for await (const chunk of OllamaGateway.ask(question)) {
      process.stdout.write(chunk);
    }
  } catch (err) {
    console.error(`\n${C.red}Error: ${String(err)}${C.reset}`);
  }

  process.stdout.write(`${C.reset}\n\n`);
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  // Single-shot mode: npx ts-node clouud-cli.ts "question"
  const singleQuestion = process.argv.slice(2).join(' ').trim();

  const [wmAvailable, models] = await Promise.all([
    WorldMonitorAdapter.isAvailable(),
    OllamaGateway.listModels(),
  ]);

  banner(wmAvailable, models);

  if (singleQuestion) {
    await ask(singleQuestion);
    process.exit(0);
  }

  // Interactive REPL mode
  const rl = readline.createInterface({ input, output, terminal: true });

  while (true) {
    let question: string;
    try {
      question = await rl.question(`${C.gray}>${C.reset} `);
    } catch {
      // Ctrl+C or Ctrl+D
      console.log('\nExiting CLOUUD.\n');
      rl.close();
      break;
    }

    const q = question.trim();
    if (!q || q === 'exit' || q === 'quit') {
      console.log('\nExiting CLOUUD.\n');
      rl.close();
      break;
    }

    await ask(q);
  }
}

main().catch(err => {
  console.error(C.red + String(err) + C.reset);
  process.exit(1);
});
