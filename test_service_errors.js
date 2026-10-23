/**
 * NyayaSetu — eCourts Service Error Paths Unit Tests
 * Run with: node test_service_errors.js
 */

const assert = require('assert');
const {
  startSearch,
  refreshCaptcha,
  submitSearch,
  sessions,
  ipRequestLogs
} = require('./ecourts_service');

let passedCount = 0;
let totalCount = 0;

async function runAsyncTest(name, fn) {
  totalCount++;
  try {
    await fn();
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`\x1b[31m✘ [FAIL]\x1b[0m ${name}`);
    console.error(err);
  }
}

(async () => {
  console.log('=== Running eCourts Service Error Path Tests ===\n');

  // Test 1: INVALID_CNR error
  await runAsyncTest('Should reject invalid CNR with INVALID_CNR error (400)', async () => {
    try {
      await startSearch('SHORT', '127.0.0.1');
      assert.fail('Expected INVALID_CNR error');
    } catch (err) {
      assert.strictEqual(err.code, 'INVALID_CNR');
      assert.strictEqual(err.status, 400);
    }
  });

  // Test 2: SESSION_EXPIRED error on invalid sessionId
  await runAsyncTest('Should reject missing/expired session with SESSION_EXPIRED (410)', async () => {
    try {
      await submitSearch('non-existent-uuid-1234', '1234', '127.0.0.1');
      assert.fail('Expected SESSION_EXPIRED error');
    } catch (err) {
      assert.strictEqual(err.code, 'SESSION_EXPIRED');
      assert.strictEqual(err.status, 410);
    }
  });

  // Test 3: CAPTCHA_REQUIRED error when submitting empty captcha
  await runAsyncTest('Should reject empty captcha input with CAPTCHA_REQUIRED (400)', async () => {
    const dummyId = 'test-session-1';
    sessions.set(dummyId, {
      id: dummyId,
      cnr: 'MHNG010045212024',
      cookies: new Map(),
      appToken: '',
      lastRequestTime: 0,
      lock: Promise.resolve(),
      createdAt: Date.now()
    });

    try {
      await submitSearch(dummyId, '', '127.0.0.1');
      assert.fail('Expected CAPTCHA_REQUIRED error');
    } catch (err) {
      assert.strictEqual(err.code, 'CAPTCHA_REQUIRED');
      assert.strictEqual(err.status, 400);
    } finally {
      sessions.delete(dummyId);
    }
  });

  // Test 4: RATE_LIMITED error when exceeding 10 searches per minute
  await runAsyncTest('Should trigger RATE_LIMITED (429) when exceeding IP threshold', async () => {
    const testIp = '192.168.1.99';
    ipRequestLogs.delete(testIp);

    // Populate 10 requests
    for (let i = 0; i < 10; i++) {
      const timestamps = ipRequestLogs.get(testIp) || [];
      timestamps.push(Date.now());
      ipRequestLogs.set(testIp, timestamps);
    }

    try {
      await startSearch('MHNG010045212024', testIp);
      assert.fail('Expected RATE_LIMITED error');
    } catch (err) {
      assert.strictEqual(err.code, 'RATE_LIMITED');
      assert.strictEqual(err.status, 429);
    } finally {
      ipRequestLogs.delete(testIp);
    }
  });

  // Test 5: SESSION_EXPIRED on TTL expiry
  await runAsyncTest('Should reject expired session beyond 10-minute TTL', async () => {
    const expiredId = 'expired-session-1';
    sessions.set(expiredId, {
      id: expiredId,
      cnr: 'MHNG010045212024',
      cookies: new Map(),
      appToken: '',
      lastRequestTime: 0,
      lock: Promise.resolve(),
      createdAt: Date.now() - (11 * 60 * 1000) // 11 mins ago
    });

    try {
      await refreshCaptcha(expiredId, '127.0.0.1');
      assert.fail('Expected SESSION_EXPIRED error');
    } catch (err) {
      assert.strictEqual(err.code, 'SESSION_EXPIRED');
      assert.strictEqual(err.status, 410);
    } finally {
      sessions.delete(expiredId);
    }
  });

  console.log(`\nService Error Tests Completed: ${passedCount}/${totalCount} passed.`);
  if (passedCount !== totalCount) {
    process.exit(1);
  }
})();
