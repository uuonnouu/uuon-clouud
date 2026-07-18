# Lunar Phase Constant — k Definition

**Date:** 2026-06-26  
**Status:** Derived constant, not approximation — protocol-level definition

---

## The Only Valid System Constant

```
k = 1 / 29.530588853 = 0.033863192691683...
```

**k** = phase increment per day (system frequency)  
**29.530588853** = synodic lunar period (system period)

These are two expressions of the same thing. Only `k` expressed as the full reciprocal is stable under iteration.

---

## What 0.034 Actually Is

| Value | What it is | Use |
|-------|-----------|-----|
| `29.530588853` | System period | Source of truth |
| `0.033863192691683...` | System frequency (k) | Internal computation |
| `0.034` | UI approximation (lossy) | Display only — never iterate |

**0.034 is NOT k. It is a truncated encoding of k.**

---

## Why 0.034 Breaks Over Time

```
k' = 0.034
k' × 29.530588853 = 1.0030...

Error per cycle: +0.0030
After 100 cycles: 0.30 cycle error = ~9 days off
```

This is systematic drift — it accumulates silently. Any system iterating with 0.034 instead of k will appear correct short-term and fail long-term.

---

## Correct Implementation (JS)

```js
const PERIOD = 29.530588853;        // system period — source of truth
const K = 1 / PERIOD;              // 0.033863192691683... — never hardcode 0.034

function lunarPhase(daysSinceRef) {
  return (daysSinceRef * K) % 1;   // phase in [0, 1)
}

// Drive angle from phase:
const theta = 2 * Math.PI * lunarPhase(t);
```

**Rule:** `K` is always computed as `1 / PERIOD`. Never hardcode `0.034`.

---

## Layer Definitions (Protocol)

```
Layer 1 — Physics:    k = 1/29.530588853     (iterate this)
Layer 2 — Display:    k ≈ 0.034              (show this to humans, never feed back in)
```

---

## Where This Applies in UUON Systems

- **Clouud world clock** — startup phase calculation must use Layer 1
- **temporal_fractal_engine.html** — replace animation time `t` with `lunarPhase(t)` for drift-free cosmic timing
- **quantum_engine.html** — phase drivers (`phase = k*nx - om*t`) can be synchronized to real lunar phase
- **:Brain timestamps** — all notes carry `lunar_phase: k × days_since_ref` at write time
- **Any iterative simulation** — orbital, tidal, biological cycle models

---

## Links
- [[World Clock Sync]]
- [[Temporal Fractal Engine]]
- [[UUON Foundation]]
- [[G°centric Framework]]
