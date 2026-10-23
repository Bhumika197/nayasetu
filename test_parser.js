/**
 * NyayaSetu — eCourts Parser & Error Detection Unit Tests
 * Run with: node test_parser.js
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const {
  parseCaseDetails,
  isWrongCaptcha,
  isCaseNotFound
} = require('./ecourts_parser');

let passedCount = 0;
let totalCount = 0;

function runTest(name, fn) {
  totalCount++;
  try {
    fn();
    console.log(`\x1b[32m✔ [PASS]\x1b[0m ${name}`);
    passedCount++;
  } catch (err) {
    console.error(`\x1b[31m✘ [FAIL]\x1b[0m ${name}`);
    console.error(err);
  }
}

console.log('=== Running eCourts Parser & Detection Unit Tests ===\n');

// 1. Test complete fixture
runTest('Should accurately parse complete anonymized case HTML fixture', () => {
  const html = fs.readFileSync(path.join(__dirname, 'test_fixtures', 'fixture_success_1.html'), 'utf8');
  const result = parseCaseDetails(html, 'MHNG010045212024');

  assert.strictEqual(result.cnr, 'MHNG010045212024');
  assert.strictEqual(result.caseType, 'Regular Civil Suit (RCS)');
  assert.strictEqual(result.filingNumber, '142/2024');
  assert.strictEqual(result.filingDate, '14-02-2024');
  assert.strictEqual(result.registrationNumber, 'RCS/000142/2024');
  assert.strictEqual(result.registrationDate, '16-02-2024');
  assert.strictEqual(result.status, 'Pending');
  assert.strictEqual(result.nextHearingDate, '28-09-2026');
  assert.strictEqual(result.stage, 'Hearing on Temporary Injunction');
  assert.ok(result.courtAndJudge.includes('Shri R. K. Deshmukh'));
  assert.ok(result.petitioner.includes('Ramesh Kumar Verma'));
  assert.ok(result.respondent.includes('Vidarbha Trading Corporation'));

  assert.strictEqual(result.history.length, 3);
  assert.strictEqual(result.history[0].date, '20-02-2024');
  assert.strictEqual(result.history[0].purpose, 'Appearance of Parties');
  assert.strictEqual(result.history[0].businessOnDate, 'Summons issued to defendants');

  assert.strictEqual(result.history[2].date, '12-08-2026');
  assert.strictEqual(result.history[2].purpose, 'Hearing on Temporary Injunction');
  assert.strictEqual(result.history[2].businessOnDate, 'Arguments commenced on injunction application');
});

// 2. Test minimal / missing fields fixture (Defensive parsing)
runTest('Should parse minimal HTML defensively and return null for missing fields without crashing', () => {
  const html = fs.readFileSync(path.join(__dirname, 'test_fixtures', 'fixture_success_2.html'), 'utf8');
  const result = parseCaseDetails(html, 'MHNG019999992023');

  assert.strictEqual(result.cnr, 'MHNG019999992023');
  assert.strictEqual(result.caseType, 'Criminal Appeal');
  assert.strictEqual(result.filingNumber, '88/2023');
  assert.strictEqual(result.filingDate, '05-11-2023');
  assert.strictEqual(result.registrationNumber, 'CRA/88/2023');

  // Missing fields should safely be null
  assert.strictEqual(result.registrationDate, null);
  assert.strictEqual(result.nextHearingDate, null);
  assert.ok(result.status.includes('Disposed'));
  assert.strictEqual(result.stage, 'Disposed');
  assert.ok(result.courtAndJudge.includes('Additional Sessions Judge'));
  assert.ok(result.petitioner.includes('State of Maharashtra'));
  assert.ok(result.respondent.includes('Accused Person A'));

  // History table missing -> empty array
  assert.deepStrictEqual(result.history, []);
});

// 3. Test CASE_NOT_FOUND detection
runTest('Should correctly detect CASE_NOT_FOUND markers', () => {
  const notFoundHtml = fs.readFileSync(path.join(__dirname, 'test_fixtures', 'fixture_not_found.html'), 'utf8');
  assert.strictEqual(isCaseNotFound(notFoundHtml), true);

  assert.strictEqual(isCaseNotFound('This Case Code does not exists'), true);
  assert.strictEqual(isCaseNotFound('Record Not Found in database'), true);
  assert.strictEqual(isCaseNotFound('Invalid CNR number'), true);
  assert.strictEqual(isCaseNotFound(''), true);
  assert.strictEqual(isCaseNotFound(null), true);
  assert.strictEqual(isCaseNotFound('Regular Civil Suit No. 123'), false);
});

// 4. Test WRONG_CAPTCHA detection
runTest('Should correctly detect WRONG_CAPTCHA response', () => {
  const liveErrorJson = {
    status: 0,
    errormsg: "Invalid Captcha... ",
    div_captcha: "<div><img id='captcha_image' /></div>"
  };
  assert.strictEqual(isWrongCaptcha(liveErrorJson), true);

  assert.strictEqual(isWrongCaptcha({ errormsg: 'Captcha does not match' }), true);
  assert.strictEqual(isWrongCaptcha('Invalid Captcha entered'), true);
  assert.strictEqual(isWrongCaptcha({ status: 1, casetype_list: '<table></table>' }), false);
});

// 5. Defensive check against empty/invalid input
runTest('Should throw descriptive error when passing empty HTML to parseCaseDetails', () => {
  assert.throws(() => {
    parseCaseDetails('', 'MHNG010045212024');
  }, /EMPTY_HTML_RESPONSE/);

  assert.throws(() => {
    parseCaseDetails(null, 'MHNG010045212024');
  }, /EMPTY_HTML_RESPONSE/);
});

// 6. Test real live Katol District Court layout (4-column table + header)
runTest('Should accurately parse real Katol 4-column district court case layout (MHNG070012862013)', () => {
  const html = fs.readFileSync(path.join(__dirname, 'test_fixtures', 'fixture_real_katol.html'), 'utf8');
  const result = parseCaseDetails(html, 'MHNG070012862013');

  assert.strictEqual(result.cnr, 'MHNG070012862013');
  assert.strictEqual(result.caseType, 'S.C.C. - SUM CASE');
  assert.strictEqual(result.filingNumber, '800947/2013');
  assert.strictEqual(result.filingDate, '25-09-2013');
  assert.strictEqual(result.registrationNumber, '800947/2013');
  assert.strictEqual(result.registrationDate, '25-09-2013');
  assert.strictEqual(result.status, 'Disposed');
  assert.strictEqual(result.nextHearingDate, '11th December 2026');
  assert.strictEqual(result.stage, 'Dismissal Order');
  assert.ok(result.courtAndJudge.includes('Civil Judge Junior Division , Katol'));
  assert.ok(result.courtAndJudge.includes('Jt. Civil JudgeJr.Dn. J.M.F.C Katol'));
  assert.ok(result.petitioner.includes('Katol Nagri Sah. Patsanstha'));
  assert.ok(result.respondent.includes('Mahadevrao Nimbulkar'));
  assert.strictEqual(result.history.length, 2);
  assert.strictEqual(result.history[0].date, '11-12-2026');
  assert.strictEqual(result.history[0].purpose, 'Dismissal Order');
  assert.strictEqual(result.history[0].businessOnDate, '23-10-2026');
});

console.log(`\nTests Completed: ${passedCount}/${totalCount} passed.`);
if (passedCount !== totalCount) {
  process.exit(1);
}

