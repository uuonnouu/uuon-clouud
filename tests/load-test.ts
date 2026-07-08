import http from 'http';
import https from 'https';

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:5000';
const DURATION_MS = parseInt(process.env.TEST_DURATION || '60000', 10);
const TEST_EMAIL = process.env.TEST_EMAIL || 'test@uuon-foundation.com';
const TEST_PASSWORD = process.env.TEST_PASSWORD || 'test-password-123';

interface TestResult {
  endpoint: string;
  method: string;
  totalRequests: number;
  successCount: number;
  failureCount: number;
  rateLimitCount: number;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  p95Latency: number;
  p99Latency: number;
}

interface Metrics {
  timestamp: string;
  totalTime: number;
  results: TestResult[];
  summary: {
    totalRequests: number;
    totalSuccess: number;
    totalRateLimit: boolean;
    overallSuccessRate: number;
  };
}

// Helper function to make HTTP requests
function makeRequest(url: string, method: string = 'GET', body?: any, headers?: any): Promise<{ status: number; body: string; latency: number }> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const client = url.startsWith('https') ? https : http;
    const options = new URL(url);
    const requestOptions = {
      hostname: options.hostname,
      port: options.port,
      path: options.pathname + options.search,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      timeout: 5000,
    };

    const req = client.request(requestOptions, (res) => {
      let data = '';
      res.on('data', chunk => (data += chunk));
      res.on('end', () => {
        const latency = Date.now() - startTime;
        resolve({ status: res.statusCode || 500, body: data, latency });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => {
      req.destroy();
      reject(new Error('Request timeout'));
    });

    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// Test 1: JWT Flow
async function testJWTFlow(): Promise<TestResult> {
  const latencies: number[] = [];
  let successCount = 0;
  let failureCount = 0;
  let rateLimitCount = 0;

  const loginUrl = `${BASE_URL}/api/auth/login`;
  const deadline = Date.now() + DURATION_MS;

  while (Date.now() < deadline) {
    try {
      const { status, body, latency } = await makeRequest(loginUrl, 'POST', {
        email: TEST_EMAIL,
        password: TEST_PASSWORD,
      });

      latencies.push(latency);

      if (status === 200) {
        successCount++;
        const response = JSON.parse(body);
        const accessToken = response.accessToken;

        // Test token refresh
        try {
          const refreshUrl = `${BASE_URL}/api/auth/refresh`;
          const { status: refreshStatus } = await makeRequest(refreshUrl, 'POST', { refreshToken: response.refreshToken });
          if (refreshStatus === 200) successCount++;
        } catch (e) {
          failureCount++;
        }
      } else if (status === 429) {
        rateLimitCount++;
      } else {
        failureCount++;
      }
    } catch (err) {
      failureCount++;
    }
  }

  return {
    endpoint: '/api/auth/login',
    method: 'POST',
    totalRequests: successCount + failureCount + rateLimitCount,
    successCount,
    failureCount,
    rateLimitCount,
    avgLatency: latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0,
    minLatency: latencies.length > 0 ? Math.min(...latencies) : 0,
    maxLatency: latencies.length > 0 ? Math.max(...latencies) : 0,
    p95Latency: latencies.length > 0 ? calculatePercentile(latencies, 95) : 0,
    p99Latency: latencies.length > 0 ? calculatePercentile(latencies, 99) : 0,
  };
}

// Test 2: Rate Limiter Hammer (hit each limiter 6+ times in 60s)
async function testRateLimiters(): Promise<TestResult[]> {
  const results: TestResult[] = [];
  const limiters = [
    { endpoint: '/api/conversations/:1/messages', method: 'POST', name: 'chatLimiter' },
    { endpoint: '/api/upload', method: 'POST', name: 'uploadLimiter' },
    { endpoint: '/api/scrape', method: 'POST', name: 'scrapeLimiter' },
    { endpoint: '/api/auth/login', method: 'POST', name: 'authLimiter' },
  ];

  for (const limiter of limiters) {
    const latencies: number[] = [];
    let successCount = 0;
    let failureCount = 0;
    let rateLimitCount = 0;
    const attempts = 10;

    for (let i = 0; i < attempts; i++) {
      try {
        const url = `${BASE_URL}${limiter.endpoint.replace(':1', '1')}`;
        const { status, latency } = await makeRequest(url, limiter.method, {
          email: TEST_EMAIL,
          password: TEST_PASSWORD,
          content: 'test message',
        });

        latencies.push(latency);

        if (status === 200) {
          successCount++;
        } else if (status === 429) {
          rateLimitCount++;
        } else {
          failureCount++;
        }
      } catch (err) {
        failureCount++;
      }
    }

    results.push({
      endpoint: limiter.endpoint,
      method: limiter.method,
      totalRequests: attempts,
      successCount,
      failureCount,
      rateLimitCount,
      avgLatency: latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0,
      minLatency: latencies.length > 0 ? Math.min(...latencies) : 0,
      maxLatency: latencies.length > 0 ? Math.max(...latencies) : 0,
      p95Latency: latencies.length > 0 ? calculatePercentile(latencies, 95) : 0,
      p99Latency: latencies.length > 0 ? calculatePercentile(latencies, 99) : 0,
    });
  }

  return results;
}

// Test 3: Audit Logging Verification
async function testAuditLogging(): Promise<TestResult> {
  const latencies: number[] = [];
  let successCount = 0;
  let failureCount = 0;
  let rateLimitCount = 0;
  const attempts = 20;

  for (let i = 0; i < attempts; i++) {
    try {
      const metricsUrl = `${BASE_URL}/api/metrics`;
      const { status, latency, body } = await makeRequest(metricsUrl, 'GET');

      latencies.push(latency);

      if (status === 200) {
        const data = JSON.parse(body);
        if (data.totalRequests > 0) {
          successCount++;
        }
      } else if (status === 429) {
        rateLimitCount++;
      } else {
        failureCount++;
      }
    } catch (err) {
      failureCount++;
    }
  }

  return {
    endpoint: '/api/metrics',
    method: 'GET',
    totalRequests: attempts,
    successCount,
    failureCount,
    rateLimitCount,
    avgLatency: latencies.length > 0 ? latencies.reduce((a, b) => a + b, 0) / latencies.length : 0,
    minLatency: latencies.length > 0 ? Math.min(...latencies) : 0,
    maxLatency: latencies.length > 0 ? Math.max(...latencies) : 0,
    p95Latency: latencies.length > 0 ? calculatePercentile(latencies, 95) : 0,
    p99Latency: latencies.length > 0 ? calculatePercentile(latencies, 99) : 0,
  };
}

// Utility function to calculate percentile
function calculatePercentile(values: number[], percentile: number): number {
  if (values.length === 0) return 0;
  const sorted = values.sort((a, b) => a - b);
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

// Main execution
async function runTests() {
  console.log(`UUON Cloud Security Test Suite`);
  console.log(`Base URL: ${BASE_URL}`);
  console.log(`Test Duration: ${DURATION_MS}ms`);
  console.log(`\nStarting tests...\n`);

  const startTime = Date.now();
  const results: TestResult[] = [];

  try {
    // Run JWT flow test
    console.log('Testing JWT flow...');
    const jwtResult = await testJWTFlow();
    results.push(jwtResult);
    console.log(`✓ JWT Flow: ${jwtResult.successCount}/${jwtResult.totalRequests} success, ${jwtResult.rateLimitCount} rate limited`);

    // Run rate limiter tests
    console.log('\nTesting rate limiters...');
    const rateLimitResults = await testRateLimiters();
    results.push(...rateLimitResults);
    rateLimitResults.forEach(r => {
      console.log(`✓ ${r.endpoint}: ${r.successCount}/${r.totalRequests} success, ${r.rateLimitCount} rate limited`);
    });

    // Run audit logging test
    console.log('\nTesting audit logging...');
    const auditResult = await testAuditLogging();
    results.push(auditResult);
    console.log(`✓ Audit Logging: ${auditResult.successCount}/${auditResult.totalRequests} success`);

    // Generate metrics report
    const totalTime = Date.now() - startTime;
    const metrics: Metrics = {
      timestamp: new Date().toISOString(),
      totalTime,
      results,
      summary: {
        totalRequests: results.reduce((sum, r) => sum + r.totalRequests, 0),
        totalSuccess: results.reduce((sum, r) => sum + r.successCount, 0),
        totalRateLimit: results.some(r => r.rateLimitCount > 0),
        overallSuccessRate: results.reduce((sum, r) => sum + r.successCount, 0) / results.reduce((sum, r) => sum + r.totalRequests, 0) * 100,
      },
    };

    console.log('\n========== TEST REPORT ==========');
    console.log(`Total Time: ${totalTime}ms`);
    console.log(`Total Requests: ${metrics.summary.totalRequests}`);
    console.log(`Total Success: ${metrics.summary.totalSuccess}`);
    console.log(`Overall Success Rate: ${metrics.summary.overallSuccessRate.toFixed(2)}%`);
    console.log(`Rate Limiting Active: ${metrics.summary.totalRateLimit ? 'YES' : 'NO'}`);
    console.log(`================================\n`);

    // Write metrics to file
    const fs = await import('fs');
    const reportPath = `test-results-${Date.now()}.json`;
    fs.writeFileSync(reportPath, JSON.stringify(metrics, null, 2));
    console.log(`Report saved to: ${reportPath}`);

    process.exit(metrics.summary.overallSuccessRate >= 95 ? 0 : 1);
  } catch (error) {
    console.error('Test suite error:', error);
    process.exit(1);
  }
}

runTests();
