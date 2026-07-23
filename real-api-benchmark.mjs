// real-api-benchmark.mjs
// Genuine latency benchmark — no simulated/placeholder data.
// Hits real, live endpoints repeatedly and computes real percentiles.

const ROUNDS = 20;

function percentile(sortedArr, p) {
  const idx = Math.ceil((p / 100) * sortedArr.length) - 1;
  return sortedArr[Math.max(0, idx)];
}

async function benchmark(name, url, options = {}) {
  console.log(`\n=== ${name} ===`);
  const results = [];
  for (let i = 0; i < ROUNDS; i++) {
    const start = performance.now();
    try {
      const res = await fetch(url, options);
      await res.text();
      results.push({ ok: res.ok, status: res.status, ms: performance.now() - start });
    } catch (e) {
      results.push({ ok: false, status: 0, ms: performance.now() - start, error: e.message });
    }
    await new Promise(r => setTimeout(r, 250));
  }
  const successful = results.filter(r => r.ok);
  const failed = results.filter(r => !r.ok);
  const times = successful.map(r => r.ms).sort((a, b) => a - b);
  if (times.length === 0) {
    console.log(`  ALL ${ROUNDS} REQUESTS FAILED.`);
    failed.slice(0, 3).forEach(f => console.log(`    sample: status=${f.status} ${f.error || ''}`));
    return null;
  }
  const avg = times.reduce((a, b) => a + b, 0) / times.length;
  const s = {
    name, successCount: successful.length, failCount: failed.length,
    avgMs: avg.toFixed(1), p50Ms: percentile(times, 50).toFixed(1),
    p95Ms: percentile(times, 95).toFixed(1), p99Ms: percentile(times, 99).toFixed(1),
  };
  console.log(`  Success: ${s.successCount}/${ROUNDS}  avg=${s.avgMs}ms  p50=${s.p50Ms}ms  p95=${s.p95Ms}ms  p99=${s.p99Ms}ms`);
  return s;
}

async function main() {
  console.log('REAL API BENCHMARK — live requests, no simulated data\n');
  const results = [];
  results.push(await benchmark('Newton API — derive x^2', 'https://newton.vercel.app/api/v2/derive/x^2'));
  results.push(await benchmark('uuon.world /api/tracking/batch', 'https://uuon.world/api/tracking/batch', {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ events: [] }),
  }));
  console.log('\n=== SUMMARY ===');
  results.filter(Boolean).forEach(r => console.log(`${r.name}: avg=${r.avgMs}ms p95=${r.p95Ms}ms (${r.successCount} successful)`));
}
main();
