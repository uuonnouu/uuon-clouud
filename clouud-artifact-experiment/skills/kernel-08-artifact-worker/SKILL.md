---
name: kernel-08-artifact-worker
description: >
  Extends the CLOUUD artifact kernel into a worker-aware execution skill.
  Use when an agent must discover, classify, validate, or integrate workers
  with the canonical artifact, provenance, topology, ASCIII execution mirror,
  compression, and verification pipeline.
---

# CLOUUD Kernel-08 Artifact Worker Skill

## Purpose

Kernel-08 is the worker integration layer built on the progression:

- Kernel-03 — execution topology mirror
- Kernel-04 — provenance gate
- Kernel-05 — canonical artifact container
- Kernel-06 — ASCIII execution mirror
- Kernel-07 — integrated artifact gate

Kernel-08 adds worker discovery and worker-aware execution without bypassing
the canonical artifact/provenance/verification path.

## Core principle

A worker is not an independent source of truth.

Workers produce execution results that must be represented through the
canonical artifact system.

The worker layer therefore follows:

DISCOVER
→ CLASSIFY
→ EXECUTE
→ CAPTURE
→ ARTIFACT
→ PROVENANCE
→ VERIFY
→ ASCIII MIRROR

## Worker discovery

Before modifying worker infrastructure:

1. Search the repository for worker implementations.
2. Search for worker managers, queues, schedulers, background processes,
   concurrency controls, and worker references.
3. Identify the execution owner for each worker.
4. Identify inputs and outputs.
5. Identify whether the worker is synchronous, asynchronous, scheduled,
   queued, or persistent.
6. Do not assume that a filename containing "worker" is actually a worker.
7. Record evidence before integrating it.

## Known CLOUUD worker surfaces

Current discovery includes:

- `.claude/helpers/perf-worker.sh`
- `.claude/helpers/worker-manager.sh`
- `cron-morph-worker.ts`
- `server/brain/batch-worker.ts`
- `worldmonitor-main /.github/workflows/deploy-worker.yml`
- `worldmonitor-main /scripts/scenario-worker.mjs`
- `worldmonitor-main /src/services/analysis-worker.ts`
- `worldmonitor-main /src/services/ml-worker.ts`
- `worldmonitor-main /src/workers/analysis.worker.ts`
- `worldmonitor-main /src/workers/ml.worker.ts`

`server/brain/batch-worker.ts` is especially relevant because it contains
explicit concurrency and queue behavior.

## Worker integration contract

A worker integration must preserve:

1. Canonical artifact identity
2. Provenance
3. Execution topology
4. ASCIII representation when applicable
5. Verification
6. Error boundaries
7. Deterministic metadata where possible

Workers must not silently mutate canonical artifacts.

## Discovery output

A worker discovery pass should produce:

- worker path
- worker type
- execution model
- input surface
- output surface
- queue/concurrency behavior
- artifact interaction
- provenance interaction
- verification interaction
- integration status
- unresolved risks

## Kernel progression

Kernel-03:
Execution topology became explicit.

Kernel-04:
Provenance became a gate rather than optional metadata.

Kernel-05:
The artifact became canonical and structured.

Kernel-06:
ASCIII became an execution mirror rather than merely a renderer.

Kernel-07:
The previous layers were integrated into an artifact gate.

Kernel-08:
Workers become first-class execution participants while remaining
subordinate to the canonical artifact lifecycle.

## Important lesson

Do not build a worker system merely because worker files exist.

First establish:

WHO EXECUTES
WHAT IS EXECUTED
WHAT STATE IS CREATED
WHERE THAT STATE IS STORED
HOW IT BECOMES AN ARTIFACT
HOW ITS PROVENANCE IS PRESERVED
HOW THE RESULT IS VERIFIED
HOW THE EXECUTION CAN BE MIRRORED VISUALLY

## ASCIII requirement

When a worker produces structured computational state that can be represented
visually, prefer the ASCIII execution mirror.

ASCII/ASCIII is a representation layer, not a replacement for the underlying
numeric or geometric computation.

If a richer renderer is available, the canonical computational state should
remain renderer-independent.

## Safety rule

Do not automatically modify discovered workers.

Discovery comes first.
Classification comes second.
Integration design comes third.
Implementation comes only after the execution contract is understood.

## Expected Kernel-08 outcome

Kernel-08 should establish a verified bridge:

worker
→ execution state
→ canonical artifact
→ provenance
→ verification
→ ASCIII mirror

without coupling the kernel to one specific worker implementation.
