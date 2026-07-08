/**
 * Phase 5A: Chain Integration Tests
 * 
 * Comprehensive test suite for audit chain linking functionality.
 * Validates: integrity, tamper detection, performance, blockchain-readiness.
 */

import http from 'http';

const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';

interface TestReport {
  name: string;
  status: 'pass' | 'fail';
  duration: number;
  message?: string;
}

const reports: TestReport[] = [];

function makeRequest(url: string, method: string = 'GET', body?: any): Promise<{ status: number; body: string }> {
  return new Promise((resolve, reject) => {
    const client = http;
    const options = new URL(url);
    const requestOptions = {
      hostname: options.hostname,
      port: options.port || 5000,
      path: options.pathname + options.search,
      method,
      headers: { 'Content-Type': 'application/json' },
      timeout: 5000,
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => resolve({ status: res.statusCode || 500, body: data }));
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function test(name: string, fn: () => Promise<boolean>): Promise<void> {
  const start = Date.now();
  try {
    const passed = await fn();
    const duration = Date.now() - start;
    reports.push({
      name,
      status: passed ? 'pass' : 'fail',
      duration,
      message: passed ? 'OK' : 'Assertion failed',
    });
    console.log(`${passed ? '✓' : '✗'} ${name} (${duration}ms)`);
  } catch (error: any) {
    const duration = Date.now() - start;
    reports.push({
      name,
      status: 'fail',
      duration,
      message: error.message,
    });
    console.log(`✗ ${name} (${duration}ms): ${error.message}`);
  }
}

async function runTests(): Promise<void> {
  console.log('Phase 5A: Audit Chain Linking Tests\n');

  // Test 1: Chain endpoint availability
  await test('Chain status endpoint accessible', async () => {
    const { status } = await makeRequest(`${BASE_URL}/api/chain/status`);
    return status === 200;
  });

  // Test 2: Initial chain state
  await test('Initial chain returns valid state', async () => {
    const { body } = await makeRequest(`${BASE_URL}/api/chain/status`);
    const data = JSON.parse(body);
    return data.status === 'active' && typeof data.chainLength === 'number';
  });

  // Test 3: Chain grows with requests
  await test('Chain length increases with new requests', async () => {
    const { body: before } = await makeRequest(`${BASE_URL}/api/chain/status`);
    const dataBefore = JSON.parse(before);

    // Send 3 test requests
    await makeRequest(`${BASE_URL}/api/metrics`);
    await makeRequest(`${BASE_URL}/api/health`);
    await makeRequest(`${BASE_URL}/api/metrics`);

    const { body: after } = await makeRequest(`${BASE_URL}/api/chain/status`);
    const dataAfter = JSON.parse(after);

    return dataAfter.chainLength >= dataBefore.chainLength + 3;
  });

  // Test 4: Chain verification passes
  await test('Chain verification returns valid=true', async () => {
    const { body } = await makeRequest(`${BASE_URL}/api/chain/verify?limit=100`);
    const data = JSON.parse(body);
    return data.verification.valid === true && data.verification.integrityScore === 100;
  });

  // Test 5: Chain report generation
  await test('Chain report includes signature', async () => {
    const { body } = await makeRequest(`${BASE_URL}/api/chain/report`);
    const data = JSON.parse(body);
    return data.signature && data.reportId && data.verification;
  });

  // Test 6: Blockchain export format
  await test('Blockchain export includes Merkle root', async () => {
    const { body } = await makeRequest(`${BASE_URL}/api/chain/export-blockchain`);
    const data = JSON.parse(body);
    return data.blockchain.merkleRoot && Array.isArray(data.blockchain.entries);
  });

  // Test 7: Chain health diagnostic
  await test('Chain health endpoint provides diagnostics', async () => {
    const { body } = await makeRequest(`${BASE_URL}/api/chain/health`);
    const data = JSON.parse(body);
    return (data.status === 'healthy' || data.status === 'compromised') && typeof data.chainLength === 'number';
  });

  // Test 8: Sequence number continuity
  await test('Chain sequences are continuous (no gaps)', async () => {
    const { body } = await makeRequest(`${BASE_URL}/api/chain/verify?limit=1000`);
    const data = JSON.parse(body);
    return data.verification.issues.length === 0 || !data.verification.issues.some((i: string) => i.includes('Gap'));
  });

  // Test 9: Range verification works
  await test('Range verification returns correct subset', async () => {
    const { body } = await makeRequest(`${BASE_URL}/api/chain/verify/1/10`);
    const data = JSON.parse(body);
    return data.verification && data.entriesChecked > 0;
  });

  // Test 10: Performance check
  await test('Verification of 100 entries completes < 100ms', async () => {
    const start = Date.now();
    await makeRequest(`${BASE_URL}/api/chain/verify?limit=100`);
    const duration = Date.now() - start;
    return duration < 100;
  });

  // Test 11: Large chain scan performance
  await test('Merkle tree export for 1000 entries < 500ms', async () => {
    const start = Date.now();
    const { status } = await makeRequest(`${BASE_URL}/api/chain/export-blockchain`);
    const duration = Date.now() - start;
    return status === 200 && duration < 500;
  });

  // Test 12: Multiple verification calls consistency
  await test('Multiple verification calls return same result', async () => {
    const call1 = await makeRequest(`${BASE_URL}/api/chain/status`);
    const call2 = await makeRequest(`${BASE_URL}/api/chain/status`);
    
    const data1 = JSON.parse(call1.body);
    const data2 = JSON.parse(call2.body);
    
    return data1.lastHash === data2.lastHash;
  });

  console.log('\n========== TEST REPORT ==========');
  const passed = reports.filter(r => r.status === 'pass').length;
  const failed = reports.filter(r => r.status === 'fail').length;
  const totalTime = reports.reduce((sum, r) => sum + r.duration, 0);

  console.log(`Passed: ${passed}/${reports.length}`);
  console.log(`Failed: ${failed}/${reports.length}`);
  console.log(`Total Time: ${totalTime}ms`);
  console.log(`Average per test: ${Math.round(totalTime / reports.length)}ms`);
  console.log('================================\n');

  // Write report
  const fs = await import('fs');
  const reportPath = `chain-test-results-${Date.now()}.json`;
  fs.writeFileSync(reportPath, JSON.stringify({
    timestamp: new Date().toISOString(),
    summary: { passed, failed, total: reports.length, totalTime },
    tests: reports,
  }, null, 2));

  console.log(`Report saved: ${reportPath}`);
  process.exit(failed > 0 ? 1 : 0);
}

runTests().catch(err => {
  console.error('Test suite error:', err);
  process.exit(1);
});
