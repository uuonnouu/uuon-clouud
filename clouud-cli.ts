#!/usr/bin/env npx ts-node
/**
 * CLOUUD CLI
 * UUON Foundation Inc. — Phillip Aguilar Ruiz III
 * License: USAL-1.0
 *
 * Usage:
 *   npx ts-node clouud-cli.ts
 *   npx ts-node clouud-cli.ts "your question here"
 */

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { WorldMonitorAdapter } from './worldmonitor-adapter.ts';
import { OllamaGateway } from './ollama-gateway.ts';

// ── Terminal width ────────────────────────────────────────────────────────────

const WIDTH = Math.min(process.stdout.columns || 80, 100);
const DIVIDER = '─'.repeat(WIDTH);
const HALF = Math.floor(WIDTH / 2);

// ── Colors ────────────────────────────────────────────────────────────────────

const C = {
  reset:  '\x1b[0m',
  bold:   '\x1b[1m',
  dim:    '\x1b[2m',
  green:  '\x1b[32m',
  cyan:   '\x1b[36m',
  yellow: '\x1b[33m',
  white:  '\x1b[97m',
  gray:   '\x1b[90m',
  red:    '\x1b[31m',
};

// ── Word wrap ─────────────────────────────────────────────────────────────────
// Wraps text to maxWidth, preserving indentation prefix on continuation lines.

function wrap(text: string, maxWidth: number, indent = ''): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (test.length > maxWidth && current) {
      lines.push(current);
      current = indent + word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

// ── Strip markdown ────────────────────────────────────────────────────────────
// Converts markdown to clean plain text for terminal output.
// Preserves code blocks intact.

function stripMarkdown(text: string): string {
  const lines = text.split('\n');
  const out: string[] = [];
  let inCode = false;
  let codeLines: string[] = [];
  let codeLang = '';

  for (const line of lines) {
    // Code block start
    if (line.trim().startsWith('```')) {
      if (!inCode) {
        inCode = true;
        codeLang = line.trim().slice(3).trim();
        codeLines = [];
      } else {
        // Code block end — output as-is
        inCode = false;
        if (codeLang) out.push(`  [ ${codeLang.toUpperCase()} ]`);
        for (const cl of codeLines) out.push(`  ${cl}`);
        out.push('');
        codeLang = '';
      }
      continue;
    }

    if (inCode) {
      codeLines.push(line);
      continue;
    }

    // Strip markdown formatting
    let l = line
      .replace(/^\s*#{1,6}\s+/, '')          // headers
      .replace(/\*\*(.+?)\*\*/g, '$1')        // bold
      .replace(/\*(.+?)\*/g, '$1')            // italic
      .replace(/`(.+?)`/g, '$1')              // inline code
      .replace(/^\s*[-*]\s+/, '  - ')         // bullets
      .replace(/^\s*\d+\.\s+/, (m) => `  ${m.trim()} `) // numbered lists
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // links — keep label
      .replace(/_{1,2}(.+?)_{1,2}/g, '$1');   // underline/italic

    out.push(l);
  }

  return out.join('\n');
}

// ── Banner ────────────────────────────────────────────────────────────────────

function banner(wmAvailable: boolean, models: string[]) {
  const model   = process.env.OLLAMA_MODEL ?? 'clouud';
  const wmState = wmAvailable
    ? `${C.green}Live${C.reset}`
    : `${C.yellow}Offline${C.reset}`;
  const olState = models.length > 0
    ? `${C.green}${models.length} model(s)${C.reset}`
    : `${C.red}unavailable${C.reset}`;

  console.log('\n' + DIVIDER);
  console.log(`${C.bold}  CLOUUD  ${C.reset}${C.dim}by UUON Foundation Inc.${C.reset}`);
  console.log(DIVIDER);
  console.log(`  Model          ${C.cyan}${model}${C.reset}`);
  console.log(`  World context  ${wmState}`);
  console.log(`  Ollama         ${olState}`);
  console.log(DIVIDER);
  console.log(`${C.dim}  Ask anything. Type exit to quit.${C.reset}\n`);
}

// ── Print user question (right-aligned) ──────────────────────────────────────

function printQuestion(q: string) {
  console.log('');
  const label = 'You';
  const maxText = WIDTH - label.length - 4;
  const wrapped = wrap(q, maxText);
  for (const line of wrapped) {
    const pad = WIDTH - line.length - label.length - 3;
    console.log(' '.repeat(Math.max(0, pad)) + `${C.dim}${line}${C.reset}  ${C.cyan}${label}${C.reset}`);
  }
  console.log('');
}

// ── Print response (left-aligned, streaming) ─────────────────────────────────

function printResponseStart() {
  process.stdout.write(`${C.dim}CLOUUD${C.reset}\n\n`);
}

function printResponseChunk(chunk: string) {
  process.stdout.write(`${C.white}${chunk}${C.reset}`);
}

function printResponseEnd() {
  process.stdout.write('\n\n' + DIVIDER + '\n');
}

// ── Ask ───────────────────────────────────────────────────────────────────────

async function ask(question: string): Promise<void> {
  printQuestion(question);
  process.stdout.write(`${C.gray}  fetching context...${C.reset}\r`);

  printResponseStart();

  let buffer = '';
  let lineLen = 0;
  const maxLine = WIDTH - 2;

  try {
    for await (const chunk of OllamaGateway.ask(question)) {
      buffer += chunk;

      // Process buffer word by word for clean wrapping
      const parts = buffer.split(' ');
      buffer = parts.pop() ?? '';

      for (const word of parts) {
        // Handle newlines in the chunk
        const sublines = word.split('\n');
        for (let i = 0; i < sublines.length; i++) {
          const sub = sublines[i];
          if (i > 0) {
            printResponseChunk('\n');
            lineLen = 0;
          }
          if (lineLen + sub.length + 1 > maxLine && lineLen > 0) {
            printResponseChunk('\n');
            lineLen = 0;
          }
          if (sub) {
            printResponseChunk((lineLen > 0 ? ' ' : '') + sub);
            lineLen += sub.length + (lineLen > 0 ? 1 : 0);
          }
        }
      }
    }

    // Flush remaining buffer
    if (buffer.trim()) {
      printResponseChunk(' ' + buffer);
    }
  } catch (err) {
    process.stdout.write(`\n${C.red}  Error: ${String(err)}${C.reset}`);
  }

  printResponseEnd();
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const singleQ = process.argv.slice(2).join(' ').trim();

  const [wmAvailable, models] = await Promise.all([
    WorldMonitorAdapter.isAvailable(),
    OllamaGateway.listModels(),
  ]);

  banner(wmAvailable, models);

  if (singleQ) {
    await ask(singleQ);
    process.exit(0);
  }

  const rl = readline.createInterface({ input, output, terminal: true });

  while (true) {
    let question: string;
    try {
      question = await rl.question(`${C.gray}  Ask  ${C.reset}`);
    } catch {
      console.log('\n  Goodbye.\n');
      rl.close();
      break;
    }

    const q = question.trim();
    if (!q || q === 'exit' || q === 'quit') {
      console.log('\n  Goodbye.\n');
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
