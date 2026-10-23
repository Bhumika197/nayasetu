/**
 * NyayaSetu — Document Drafter Unit Tests
 * Run with: node test_drafter.js
 */

const assert = require('assert');
const {
  PLEADING_TEMPLATES,
  escapeHtml,
  formatMultiline,
  generatePleadingHtml
} = require('./drafter_logic');

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

console.log('=== Running Document Drafter Unit Tests ===\n');

// 1. Template Metadata Completeness
runTest('Should expose all 5 legal templates with required metadata and labels', () => {
  const expectedKeys = ['sec138', 'rti', 'consumer', 'eviction', 'affidavit'];
  assert.strictEqual(Object.keys(PLEADING_TEMPLATES).length, 5);

  expectedKeys.forEach(key => {
    const tpl = PLEADING_TEMPLATES[key];
    assert.ok(tpl, `Template ${key} must exist`);
    assert.strictEqual(tpl.id, key);
    assert.ok(tpl.title && tpl.title.length > 5);
    assert.ok(tpl.badge && tpl.badge.length > 3);
    assert.ok(tpl.sealText && tpl.sealText.length > 3);
    assert.ok(tpl.labels.sender);
    assert.ok(tpl.labels.particulars);
    assert.ok(tpl.labels.grievance);
    assert.ok(tpl.labels.place);
    assert.ok(tpl.defaults.sender);
  });
});

// 2. Section 138 Notice Generation
runTest('Should generate Section 138 Statutory Demand Notice with mandatory cure period', () => {
  const html = generatePleadingHtml({
    type: 'sec138',
    sender: 'Dev Jain',
    recipient: 'Rajesh Sharma',
    particulars: 'Cheque #1001 for INR 50,000 on SBI',
    grievance: 'Returned unpaid with memo Funds Insufficient',
    place: 'Nagpur, Maharashtra',
    date: '23 October 2026'
  });

  assert.ok(html.includes('STATUTORY DEMAND NOTICE UNDER SECTION 138'));
  assert.ok(html.includes('15 (FIFTEEN) DAYS'));
  assert.ok(html.includes('Dev Jain'));
  assert.ok(html.includes('Rajesh Sharma'));
  assert.ok(html.includes('Cheque #1001 for INR 50,000 on SBI'));
  assert.ok(html.includes('Funds Insufficient'));
  assert.ok(html.includes('Nagpur, Maharashtra'));
  assert.ok(html.includes('Signature of Payee / Complainant'));
});

// 3. RTI Form A Application Generation
runTest('Should generate RTI Form A Application under Section 6(1) with 30-day mandate', () => {
  const html = generatePleadingHtml({
    type: 'rti',
    sender: 'Mansvi Khupse',
    recipient: 'PIO, Municipal Corporation, Nagpur',
    particulars: 'Tender No. 402/2026 road audit',
    grievance: 'Certified inspection logs and quality test reports',
    place: 'Nagpur, Maharashtra',
    date: '23 October 2026'
  });

  assert.ok(html.includes('FORM A — APPLICATION FOR SEEKING INFORMATION UNDER SECTION 6(1)'));
  assert.ok(html.includes('30 (thirty) days'));
  assert.ok(html.includes('Mansvi Khupse'));
  assert.ok(html.includes('PIO, Municipal Corporation, Nagpur'));
  assert.ok(html.includes('Court Fee Stamp'));
  assert.ok(html.includes('Citizen of India'));
});

// 4. Consumer Notice Generation
runTest('Should generate Consumer Grievance Notice under CPA 2019 with Section 35 reference', () => {
  const html = generatePleadingHtml({
    type: 'consumer',
    sender: 'Swati Kundu',
    recipient: 'Apex Electronics Pvt Ltd',
    particulars: 'Smart TV Invoice #892',
    grievance: 'Panel failed within 7 days, refund refused',
    place: 'Nagpur, Maharashtra'
  });

  assert.ok(html.includes('CONSUMER PROTECTION ACT, 2019'));
  assert.ok(html.includes('District Consumer Disputes Redressal Commission'));
  assert.ok(html.includes('Swati Kundu'));
  assert.ok(html.includes('Apex Electronics Pvt Ltd'));
  assert.ok(html.includes('Smart TV Invoice #892'));
});

// 5. Tenancy Notice Generation
runTest('Should generate Tenancy Eviction Notice under Section 106 TP Act with 30-day quit clause', () => {
  const html = generatePleadingHtml({
    type: 'eviction',
    sender: 'Bhoomi Reddy',
    recipient: 'Tenant R. K. Singh',
    particulars: 'Flat 401, Galaxy Heights, Nagpur',
    grievance: 'Default in rent for 4 months',
    place: 'Nagpur, Maharashtra'
  });

  assert.ok(html.includes('SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882'));
  assert.ok(html.includes('30 (THIRTY) DAYS'));
  assert.ok(html.includes('Flat 401, Galaxy Heights, Nagpur'));
  assert.ok(html.includes('peaceful and vacant possession'));
  assert.ok(html.includes('Landlord / Lessor'));
});

// 6. Sworn Affidavit Generation
runTest('Should generate General Sworn Affidavit with statutory verification and notarial block', () => {
  const html = generatePleadingHtml({
    type: 'affidavit',
    sender: 'Dev Jain, Age 22 Years',
    recipient: 'Before the Executive Magistrate, Nagpur',
    particulars: 'Loss of Marksheet',
    grievance: '1. Misplaced in transit.\n2. Not pledged anywhere.',
    place: 'Nagpur, Maharashtra'
  });

  assert.ok(html.includes('AFFIDAVIT / SOLEMN DECLARATION ON OATH'));
  assert.ok(html.includes('Dev Jain, Age 22 Years'));
  assert.ok(html.includes('VERIFICATION:'));
  assert.ok(html.includes('Executive Magistrate / Notary Public'));
  assert.ok(html.includes('DEPONENT'));
});

// 7. HTML Sanitization & Escaping
runTest('Should escape dangerous characters and prevent HTML injection', () => {
  const dangerousInput = '<script>alert("hacked")</script> & "quotes" <test>';
  const escaped = escapeHtml(dangerousInput);
  assert.ok(!escaped.includes('<script>'));
  assert.ok(escaped.includes('&lt;script&gt;'));
  assert.ok(escaped.includes('&amp;'));
  assert.ok(escaped.includes('&quot;quotes&quot;'));

  const multi = formatMultiline("Line 1\nLine 2");
  assert.strictEqual(multi, "Line 1<br>Line 2");

  // In generated HTML
  const html = generatePleadingHtml({
    type: 'sec138',
    sender: 'Dev <script>',
    particulars: 'Cheque <b>123</b>',
    grievance: 'Error & issue'
  });
  assert.ok(!html.includes('<script>'));
  assert.ok(html.includes('Dev &lt;script&gt;'));
  assert.ok(html.includes('Cheque &lt;b&gt;123&lt;/b&gt;'));
  assert.ok(html.includes('Error &amp; issue'));
});

// 8. DigiLocker e-KYC Verified Digital Stamp
runTest('Should conditionally attach DigiLocker e-KYC digital stamp when authenticated', () => {
  const unauthHtml = generatePleadingHtml({ type: 'sec138' });
  assert.ok(!unauthHtml.includes('pleading-digilocker-stamp'));

  const authHtml = generatePleadingHtml({
    type: 'sec138',
    dlUser: {
      name: 'Mansvi Khupse',
      maskedUid: 'XXXX-XXXX-9941',
      digilockerId: 'DL-IN-MK99',
      address: 'Nagpur, Maharashtra'
    }
  });

  assert.ok(authHtml.includes('pleading-digilocker-stamp'));
  assert.ok(authHtml.includes('DIGILOCKER e-KYC VERIFIED COMPLAINANT / LITIGANT'));
  assert.ok(authHtml.includes('Mansvi Khupse'));
  assert.ok(authHtml.includes('XXXX-XXXX-9941'));
  assert.ok(authHtml.includes('DL-IN-MK99'));
  assert.ok(authHtml.includes('Section 4 Aadhaar Act 2016'));
});

// 9. Defensive Handling of Null / Empty Input
runTest('Should handle null, undefined, or empty parameters defensively without crashing', () => {
  assert.doesNotThrow(() => {
    const html1 = generatePleadingHtml(null);
    assert.ok(html1.length > 50);

    const html2 = generatePleadingHtml({});
    assert.ok(html2.length > 50);

    const html3 = generatePleadingHtml({ type: 'unknown_type' });
    assert.ok(html3.length > 50);
  });
});

console.log(`\nTests Completed: ${passedCount}/${totalCount} passed.`);
if (passedCount !== totalCount) {
  process.exit(1);
}
