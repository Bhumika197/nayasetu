/**
 * NyayaSetu — Court Pleading Drafter Module
 * Authentic Indian Statutory Pleading Templates, Sanitization & Preview Engine
 * Compliant with:
 * - Section 138 / 142 Negotiable Instruments Act, 1881 & Sec 318(4) Bharatiya Nyaya Sanhita (BNS) 2023
 * - Right to Information Act, 2005 (Section 6(1) Form A)
 * - Consumer Protection Act, 2019 (Sections 2(7), 2(11) & Section 35)
 * - Transfer of Property Act, 1882 (Section 106 Quit Notice)
 * - Oaths Act, 1969 & Bharatiya Sakshya Adhiniyam, 2023 (Sec 65B)
 */

function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatMultiline(str) {
  return escapeHtml(str).replace(/\n/g, '<br>');
}

const PLEADING_TEMPLATES = {
  sec138: {
    id: 'sec138',
    title: 'Statutory Demand Notice (Section 138 NI Act)',
    badge: '15-Day Cure Notice (NI Act)',
    sealText: 'LEGAL<br>NOTICE<br>SEC 138',
    statute: 'Section 138 & 142 Negotiable Instruments Act, 1881 & Sec 318(4) BNS 2023',
    labels: {
      sender: 'Payee / Complainant (Creditor) Name:',
      recipient: 'Respondent / Drawer / Accused Name & Address:',
      particulars: 'Cheque Particulars (Number, Date, Bank, Amount):',
      grievance: 'Dishonour Reason & Bank Memo Facts:',
      place: 'Territorial Station (City, State):'
    },
    placeholders: {
      sender: 'Enter Payee / Complainant (Creditor) Name',
      recipient: 'Enter Respondent / Drawer / Accused Name & Address',
      particulars: 'Enter Cheque Particulars (Number, Date, Bank, Amount)',
      grievance: 'Enter Dishonour Reason from Bank Memo & Facts of Non-Payment',
      place: 'Enter Territorial Station (City, State)'
    },
    defaults: {
      sender: '[Payee / Complainant (Creditor) Name]',
      recipient: '[Respondent / Drawer / Accused Name & Address]',
      particulars: '[Cheque Particulars: Cheque No., Date, Drawee Bank & Amount]',
      grievance: '[Dishonour Reason as per Bank Return Memo & Failure to Discharge Debt]',
      place: '[Territorial Station (City, State)]'
    }
  },
  rti: {
    id: 'rti',
    title: 'RTI Form A Application (RTI Act, 2005)',
    badge: '30-Day Mandate (RTI Act)',
    sealText: 'RTI ACT<br>2005<br>FORM A',
    statute: 'Section 6(1) Right to Information Act, 2005',
    labels: {
      sender: 'Applicant Citizen Name:',
      recipient: 'Public Information Officer (PIO) & Department:',
      particulars: 'Subject Matter / Tender / Scheme Particulars:',
      grievance: 'Specific Information & Certified Records Sought:',
      place: 'Place & Address for Correspondence:'
    },
    placeholders: {
      sender: 'Enter Applicant Citizen Name',
      recipient: 'Enter Public Information Officer (PIO) & Department Address',
      particulars: 'Enter Subject Matter / File / Tender / Scheme Particulars',
      grievance: 'Enter Specific Information & Certified Records Sought (Numbered)',
      place: 'Enter Place & Address for Correspondence'
    },
    defaults: {
      sender: '[Applicant Citizen Name]',
      recipient: '[The Public Information Officer (PIO), Department Name & Address]',
      particulars: '[Subject Matter / File / Reference / Tender Particulars]',
      grievance: '1. [Certified copies of the primary sanction records / work order].\n2. [Inspection reports, log sheets, and quality assurance certificates].\n3. [Action taken on representations and penalties levied, if any].',
      place: '[Place & Address for Correspondence]'
    }
  },
  consumer: {
    id: 'consumer',
    title: 'Consumer Grievance Notice (CPA, 2019)',
    badge: '15-Day Notice (CPA 2019)',
    sealText: 'CONSUMER<br>NOTICE<br>CPA 2019',
    statute: 'Sections 2(7), 2(11) & Section 35 Consumer Protection Act, 2019',
    labels: {
      sender: 'Consumer / Complainant Name:',
      recipient: 'Opposite Party (Seller / Service Provider / Company):',
      particulars: 'Product / Service Details, Invoice No. & Price:',
      grievance: 'Defect / Deficiency in Service & Inaction:',
      place: 'Territorial Station (City, State):'
    },
    placeholders: {
      sender: 'Enter Consumer / Complainant Name',
      recipient: 'Enter Opposite Party (Seller / Service Provider) Name & Address',
      particulars: 'Enter Product / Service Details, Tax Invoice No. & Consideration Paid',
      grievance: 'Enter Facts of Defect in Goods or Deficiency in Service',
      place: 'Enter Territorial Station (City, State)'
    },
    defaults: {
      sender: '[Consumer / Complainant Name]',
      recipient: '[Opposite Party (Seller / Manufacturer / Service Provider) Name & Address]',
      particulars: '[Product / Service Details, Model / Invoice No., Date & Consideration Paid]',
      grievance: '[Material defect in product or deficiency in service, notice of defect served, and failure or refusal to rectify, replace or refund].',
      place: '[Territorial Station (City, State)]'
    }
  },
  eviction: {
    id: 'eviction',
    title: 'Tenancy Termination Notice (TP Act, 1882)',
    badge: '30-Day Quit Notice (TP Act)',
    sealText: 'LEGAL<br>NOTICE<br>T.P. ACT',
    statute: 'Section 106 Transfer of Property Act, 1882',
    labels: {
      sender: 'Landlord / Property Owner (Lessor) Name:',
      recipient: 'Tenant / Lessee Name & Address:',
      particulars: 'Demised Premises & Lease Agreement Details:',
      grievance: 'Ground for Termination & Default Particulars:',
      place: 'Execution Station (City, State):'
    },
    placeholders: {
      sender: 'Enter Landlord / Property Owner (Lessor) Name',
      recipient: 'Enter Tenant / Lessee Name & Address',
      particulars: 'Enter Demised Premises Address & Lease Agreement Details',
      grievance: 'Enter Ground for Termination (e.g. Arrears of Rent / Material Breach)',
      place: 'Enter Execution Station (City, State)'
    },
    defaults: {
      sender: '[Landlord / Property Owner (Lessor) Name]',
      recipient: '[Tenant / Lessee Name & Address]',
      particulars: '[Demised Premises Full Address, Lease Agreement Date & Monthly Rent]',
      grievance: '[Grounds for determination including default in rent, unauthorized alteration, or expiry of tenancy term].',
      place: '[Execution Station (City, State)]'
    }
  },
  affidavit: {
    id: 'affidavit',
    title: 'General Sworn Affidavit (Oaths Act, 1969)',
    badge: 'Notarial Sworn Declaration',
    sealText: 'SWORN<br>AFFIDAVIT<br>NOTARIAL',
    statute: 'Oaths Act, 1969 & Bharatiya Sakshya Adhiniyam, 2023',
    labels: {
      sender: 'Deponent (Affiant) Full Name & Age:',
      recipient: 'Attesting Authority / Jurisdiction (Optional):',
      particulars: 'Subject Matter / Purpose of Affidavit:',
      grievance: 'Affirmations / Statements on Oath (Numbered):',
      place: 'Station of Oath / Notarial Station:'
    },
    placeholders: {
      sender: 'Enter Deponent Full Name, Age & Residential Address',
      recipient: 'Enter Attesting Authority / Notary Public Jurisdiction',
      particulars: 'Enter Subject Matter / Purpose of Affidavit',
      grievance: 'Enter Affirmations / Statements on Oath (Numbered)',
      place: 'Enter Station of Oath / Notarial Station'
    },
    defaults: {
      sender: '[Deponent Full Name, S/o or D/o Parent Name, Age & Residential Address]',
      recipient: '[Before the Executive Magistrate / Notary Public, Competent Jurisdiction]',
      particulars: '[Subject Matter / Purpose of Declaration on Oath]',
      grievance: '1. That I am the deponent herein, a citizen of India and fully conversant with the facts stated herein.\n2. [State factual affirmation / declaration clearly and concisely].\n3. That the contents hereof are true and correct to the best of my knowledge and belief.',
      place: '[Station of Oath (City, State)]'
    }
  }
};

/**
 * Generates court-ready HTML for a given legal pleading template
 * @param {Object} params - User form parameters
 * @param {string} params.type - One of 'sec138', 'rti', 'consumer', 'eviction', 'affidavit'
 * @param {string} params.sender - Applicant/Payee/Deponent name
 * @param {string} params.recipient - Opposite party/PIO/Authority
 * @param {string} params.particulars - Transaction/Tender/Demised premises particulars
 * @param {string} params.grievance - Facts/Default/Statements
 * @param {string} params.place - Territorial city/station
 * @param {string} [params.date] - Optional override date
 * @param {Object} [params.dlUser] - Optional verified DigiLocker e-KYC user object
 * @returns {string} Sanitized HTML string ready for injection into #pleadingPaper
 */
function generatePleadingHtml(params) {
  params = params || {};
  const type = params.type || 'sec138';
  const tpl = PLEADING_TEMPLATES[type] || PLEADING_TEMPLATES.sec138;

  const sender = (params.sender && params.sender.trim()) || (tpl.defaults && tpl.defaults.sender) || '[Applicant / Complainant Name]';
  const recipient = (params.recipient && params.recipient.trim()) || (tpl.defaults && tpl.defaults.recipient) || '[Opposite Party / Respondent Name & Address]';
  const particulars = (params.particulars && params.particulars.trim()) || (tpl.defaults && tpl.defaults.particulars) || '[Matter / Transaction Particulars]';
  const grievance = (params.grievance && params.grievance.trim()) || (tpl.defaults && tpl.defaults.grievance) || '[Facts of Grievance & Statutory Violation]';
  const place = (params.place && params.place.trim()) || (tpl.defaults && tpl.defaults.place) || '[Territorial Station (City, State)]';
  const date = params.date || new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' });

  const safeSender = escapeHtml(sender);
  const formattedSender = formatMultiline(sender);
  const formattedRecipient = formatMultiline(recipient);
  const formattedParticulars = formatMultiline(particulars);
  const formattedGrievance = formatMultiline(grievance);
  const safePlace = escapeHtml(place);
  const safeRecipient = escapeHtml(recipient);

  let bodyHtml = '';

  if (type === 'sec138') {
    bodyHtml = `
      <div class="pleading-seal">${tpl.sealText}</div>
      <div class="pleading-header">
        STATUTORY DEMAND NOTICE UNDER SECTION 138 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881
      </div>
      <div style="text-align: right; margin-bottom: 12px; font-size: 11px;">
        <strong>SPEED POST / REGISTERED POST A.D.</strong><br>
        Date: ${date} | Station: ${safePlace}
      </div>
      <p><strong>TO:</strong><br>${formattedRecipient}<br><em>(DRAWER / OPPOSITE PARTY)</em></p>
      <p style="margin-top: 8px;"><strong>FROM:</strong><br>${formattedSender}<br><em>(PAYEE / SENDER)</em></p>
      <p style="margin-top: 10px;"><strong>SUBJECT:</strong> STATUTORY DEMAND NOTICE UNDER SECTION 138 READ WITH SECTION 142 OF THE NEGOTIABLE INSTRUMENTS ACT, 1881 AND SECTION 318(4) OF BHARATIYA NYAYA SANHITA, 2023.</p>
      <p style="margin-top: 10px;"><strong>SIR / MADAM,</strong></p>
      <p style="margin-top: 6px;">Under instructions and authority from myself / client, I hereby serve upon you this mandatory Statutory Notice:</p>
      <ol style="padding-left: 20px; margin-top: 6px; line-height: 1.6;">
        <li>That towards the discharge of your existing legally enforceable debt and liability, you issued in favour of the Payee: <em>${formattedParticulars}</em>.</li>
        <li>That the said cheque was presented for encashment in due course, but was returned unpaid and dishonoured by the bank with memo stating: <em>${formattedGrievance}</em>.</li>
        <li>That your failure to maintain sufficient balance and arrange payment constitutes a criminal offence under Section 138 of the Negotiable Instruments Act, 1881.</li>
      </ol>
      <div style="margin-top: 12px; background: #fffde7; border: 1px solid #ffe082; padding: 10px; border-radius: 4px;">
        <strong>MANDATORY STATUTORY DEMAND:</strong><br>
        You are hereby called upon to pay the entire outstanding sum within <strong>15 (FIFTEEN) DAYS</strong> from the date of receipt of this statutory notice, failing which a criminal complaint under Section 138 of the Negotiable Instruments Act, 1881 shall be instituted against you before the Competent Judicial Magistrate First Class (JMFC) Court at your sole risk, costs, and consequences.
      </div>
      <div style="margin-top: 35px; display: flex; justify-content: space-between;">
        <div>Station: ${safePlace}<br>Date: ${date}</div>
        <div style="text-align: right;">_______________________________<br><strong>${safeSender}</strong><br>(Signature of Payee / Complainant)</div>
      </div>
    `;
  } else if (type === 'rti') {
    bodyHtml = `
      <div class="pleading-seal">${tpl.sealText}</div>
      <div class="pleading-header">
        FORM A — APPLICATION FOR SEEKING INFORMATION UNDER SECTION 6(1) OF THE RTI ACT, 2005
      </div>
      <div style="text-align: right; margin-bottom: 12px; font-size: 11px;">Date: ${date} | Place: ${safePlace}</div>
      <p><strong>TO:</strong><br>The Public Information Officer (PIO),<br>${formattedRecipient}</p>
      <p style="margin-top: 8px;"><strong>1. Name of Applicant:</strong> ${safeSender}</p>
      <p><strong>2. Address for Correspondence:</strong> ${safePlace}</p>
      <p><strong>3. Citizenship:</strong> Citizen of India (Right Guaranteed under Section 3 of RTI Act)</p>
      <p style="margin-top: 8px;"><strong>4. Particulars of Information Sought:</strong><br><strong>Subject Matter / Reference:</strong> <em>${formattedParticulars}</em></p>
      <div style="background: #f8fafc; border: 1px solid #cbd5e1; padding: 10px; margin-top: 6px; border-radius: 4px; line-height: 1.6;">
        <strong>Specific Information / Records Requested:</strong><br>${formattedGrievance}
      </div>
      <p style="margin-top: 8px;"><strong>5. Statutory Period:</strong> As per Section 7(1) of the RTI Act, 2005, the requested information/copies are required to be provided within <strong>30 (thirty) days</strong> of receipt of this application.</p>
      <p style="margin-top: 8px;"><strong>6. Application Fee:</strong> Statutory fee of Rs. 10/- paid via Court Fee Stamp / Postal Order No. <strong>IPO-89142-2026</strong> enclosed herewith.</p>
      <p style="margin-top: 8px;"><strong>7. Declaration:</strong> I state that the information sought falls strictly within the definition of Section 2(f) and 2(j) of the RTI Act, 2005 and does not fall within any exemption specified under Section 8 or 9 of the Act.</p>
      <div style="margin-top: 35px; display: flex; justify-content: space-between;">
        <div>Enclosure: Statutory Fee Stamp / IPO Rs. 10/-</div>
        <div style="text-align: right;">_______________________________<br><strong>${safeSender}</strong><br>(Signature of Citizen Applicant)</div>
      </div>
    `;
  } else if (type === 'consumer') {
    bodyHtml = `
      <div class="pleading-seal">${tpl.sealText}</div>
      <div class="pleading-header">
        LEGAL NOTICE FOR DEFICIENCY OF SERVICE & UNFAIR TRADE PRACTICE UNDER CONSUMER PROTECTION ACT, 2019
      </div>
      <div style="text-align: right; margin-bottom: 12px; font-size: 11px;">Date: ${date} | SPEED POST / REGD. POST A.D.</div>
      <p><strong>TO (OPPOSITE PARTY):</strong><br>${formattedRecipient}</p>
      <p style="margin-top: 8px;"><strong>FROM (CONSUMER):</strong><br>${formattedSender} (${safePlace})</p>
      <p style="margin-top: 10px;"><strong>SUBJECT:</strong> STATUTORY NOTICE UNDER SECTIONS 2(7), 2(11) AND SECTION 35 OF THE CONSUMER PROTECTION ACT, 2019 REGARDING DEFECT IN GOODS AND DEFICIENCY OF SERVICE.</p>
      <p style="margin-top: 8px;"><strong>FACTS OF TRANSACTION & GRIEVANCE:</strong></p>
      <ol style="padding-left: 20px; line-height: 1.6;">
        <li>That the Complainant purchased / engaged services: <em>${formattedParticulars}</em> for valuable consideration.</li>
        <li>That the product / service supplied by you suffered from serious defects / deficiency: <em>${formattedGrievance}</em>.</li>
        <li>That despite prompt complaints and lodging of warranty tickets, you have failed to repair, replace or refund the amount.</li>
      </ol>
      <div style="margin-top: 10px; background: #fffde7; border: 1px solid #ffe082; padding: 10px; border-radius: 4px;">
        <strong>STATUTORY DEMAND:</strong><br>
        You are hereby called upon to rectify the defect, provide full replacement or refund the invoice consideration of <strong>${formattedParticulars}</strong> along with Rs. 25,000/- towards damages for mental agony and harassment within <strong>15 (FIFTEEN) DAYS</strong> of receipt, failing which a formal Consumer Complaint shall be filed before the competent District Consumer Disputes Redressal Commission under Section 35 of the Consumer Protection Act, 2019.
      </div>
      <div style="margin-top: 35px; display: flex; justify-content: space-between;">
        <div>Station: ${safePlace}<br>Date: ${date}</div>
        <div style="text-align: right;">_______________________________<br><strong>${safeSender}</strong><br>(Consumer / Complainant)</div>
      </div>
    `;
  } else if (type === 'eviction') {
    bodyHtml = `
      <div class="pleading-seal">${tpl.sealText}</div>
      <div class="pleading-header">
        NOTICE OF TERMINATION OF TENANCY UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882
      </div>
      <div style="text-align: right; margin-bottom: 12px; font-size: 11px;">Date: ${date} | Station: ${safePlace} | REGD. POST A.D.</div>
      <p><strong>TO (TENANT / LESSEE):</strong><br>${formattedRecipient}</p>
      <p style="margin-top: 8px;"><strong>FROM (LANDLORD / LESSOR):</strong><br>${formattedSender} (${safePlace})</p>
      <p style="margin-top: 10px;"><strong>SUBJECT:</strong> NOTICE DETERMINING MONTHLY TENANCY UNDER SECTION 106 OF THE TRANSFER OF PROPERTY ACT, 1882.</p>
      <p style="margin-top: 8px;"><strong>DEMISED PREMISES:</strong> <em>${formattedParticulars}</em></p>
      <p style="margin-top: 8px;"><strong>STATEMENT OF FACTS & BREACH:</strong></p>
      <p style="line-height: 1.6;">You are a monthly tenant in the aforementioned premises. You have committed material breaches of tenancy covenants: <em>${formattedGrievance}</em>.</p>
      <div style="margin-top: 10px; background: #fffde7; border: 1px solid #ffe082; padding: 10px; border-radius: 4px;">
        <strong>NOTICE TO VACATE (QUIT NOTICE):</strong><br>
        Take notice that your tenancy in respect of the demised premises is hereby determined and terminated upon the expiration of <strong>30 (THIRTY) DAYS</strong> from the date of receipt of this notice. You are hereby called upon to quit, vacate, and deliver peaceful and vacant possession of the premises to the undersigned, failing which an eviction suit shall be filed against you in the competent Civil Court with mesne profits and damages at your cost.
      </div>
      <div style="margin-top: 35px; display: flex; justify-content: space-between;">
        <div>Station: ${safePlace}<br>Date: ${date}</div>
        <div style="text-align: right;">_______________________________<br><strong>${safeSender}</strong><br>(Landlord / Lessor)</div>
      </div>
    `;
  } else {
    // Default: General Sworn Affidavit
    const attestingHeader = safeRecipient && safeRecipient.trim().length > 0
      ? safeRecipient.toUpperCase()
      : `BEFORE THE EXECUTIVE MAGISTRATE / NOTARY PUBLIC AT ${safePlace.toUpperCase()}`;

    bodyHtml = `
      <div class="pleading-seal">${tpl.sealText}</div>
      <div class="pleading-header">
        ${attestingHeader}
      </div>
      <div style="text-align: center; font-weight: bold; margin-bottom: 15px; font-size: 13.5px; text-decoration: underline;">
        AFFIDAVIT / SOLEMN DECLARATION ON OATH
      </div>
      <p style="line-height: 1.8;">
        I, <strong>${safeSender}</strong>, residing at ${safePlace}, do hereby solemnly affirm and state on oath as under:
      </p>
      <div style="margin-top: 8px; line-height: 1.8;">
        <p><strong>MATTER / PURPOSE:</strong> <em>${formattedParticulars}</em></p>
        <div style="padding-left: 10px; margin-top: 6px; line-height: 1.8;">
          ${formattedGrievance}
        </div>
      </div>
      <div style="margin-top: 18px; border-top: 1px solid #000000; padding-top: 10px;">
        <strong>VERIFICATION:</strong><br>
        Verified at <strong>${safePlace}</strong> on this <strong>${date}</strong> that the contents of the above affidavit are true and correct to my personal knowledge and belief. No part of it is false and nothing material has been concealed therefrom.
      </div>
      <div style="margin-top: 35px; display: flex; justify-content: space-between;">
        <div>
          Solemnly affirmed &amp; signed before me:<br><br>
          ____________________________________<br>
          <strong>Executive Magistrate / Notary Public</strong><br>
          (With Notarial Seal &amp; Registration Stamp)
        </div>
        <div style="text-align: right;">
          <br><br>
          _______________________________<br>
          <strong>DEPONENT (${safeSender})</strong>
        </div>
      </div>
    `;
  }

  // Append DigiLocker verified digital stamp if user is authenticated
  if (params.dlUser) {
    const dlUser = params.dlUser;
    bodyHtml += `
      <div class="pleading-digilocker-stamp">
        <div class="stamp-icon">✓</div>
        <div class="stamp-text">
          <strong>DIGILOCKER e-KYC VERIFIED COMPLAINANT / LITIGANT</strong>
          Verified Litigant: ${escapeHtml(dlUser.name)} &bull; Masked Token: ${escapeHtml(dlUser.maskedUid || dlUser.bciReg || 'Verified')} &bull; Digital Locker ID: ${escapeHtml(dlUser.digilockerId || 'DL-IN-001')}<br>
          <span style="font-size: 10.5px; color: #15803d;">Statutory Validation: Section 4 Aadhaar Act 2016 &bull; Section 65B Bharatiya Sakshya Adhiniyam 2023 &bull; SHA-256 Validated e-KYC</span>
        </div>
      </div>
    `;
  }

  return bodyHtml.trim();
}

// UMD / CommonJS Export
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    PLEADING_TEMPLATES,
    escapeHtml,
    formatMultiline,
    generatePleadingHtml
  };
} else if (typeof window !== 'undefined') {
  window.NyayaDrafter = {
    PLEADING_TEMPLATES,
    escapeHtml,
    formatMultiline,
    generatePleadingHtml
  };
}
