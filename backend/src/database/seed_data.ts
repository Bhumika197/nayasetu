export interface SeedDataSource {
  id: string;
  source_name: string;
  source_type: string;
  publisher: string;
  jurisdiction: string;
  categories: string[];
  official_url: string;
  license_or_reuse_notes: string;
  publication_date: string;
  authority_level: number;
}

export interface SeedLegalSource {
  id: string;
  source_title: string;
  source_type: string;
  issuing_authority: string;
  jurisdiction: string;
  publication_date: string;
  official_url: string;
  provisions: {
    section_number: string;
    section_title: string;
    content_text: string;
    explanation: string;
  }[];
}

export interface SeedJudgment {
  id: string;
  court: string;
  case_title: string;
  case_identifier: string;
  judgment_date: string;
  citation: string;
  source_url: string;
  case_summary: string;
  holding: string;
  full_text_extract: string;
  legal_topics: string[];
}

export interface SeedGovRecord {
  id: string;
  scheme_name: string;
  topic: string;
  title: string;
  details_text: string;
  official_url: string;
  state_or_region: string;
}

export const SEED_DATA_SOURCES: SeedDataSource[] = [
  {
    id: "ds-pmfby-001",
    source_name: "Pradhan Mantri Fasal Bima Yojana (PMFBY) Operational Guidelines",
    source_type: "scheme_guidelines",
    publisher: "Ministry of Agriculture and Farmers Welfare, Govt of India",
    jurisdiction: "National",
    categories: ["agricultural_insurance", "government_benefits"],
    official_url: "https://pmfby.gov.in",
    license_or_reuse_notes: "Official Government of India Scheme Circular",
    publication_date: "2023-01-15",
    authority_level: 5,
  },
  {
    id: "ds-cpa-002",
    source_name: "Consumer Protection Act 2019 & National Consumer Helpline (NCH)",
    source_type: "statute",
    publisher: "Department of Consumer Affairs, Govt of India",
    jurisdiction: "National",
    categories: ["consumer_dispute"],
    official_url: "https://consumerhelpline.gov.in",
    license_or_reuse_notes: "Statutory Law of India (Act No. 35 of 2019)",
    publication_date: "2019-08-09",
    authority_level: 5,
  },
  {
    id: "ds-rti-003",
    source_name: "Right to Information Act 2005 Portal & Guidelines",
    source_type: "statute",
    publisher: "Department of Personnel and Training (DoPT), Govt of India",
    jurisdiction: "National",
    categories: ["rti_request", "public_service_grievance"],
    official_url: "https://rtionline.gov.in",
    license_or_reuse_notes: "Statutory Law of India (Act No. 22 of 2005)",
    publication_date: "2005-06-21",
    authority_level: 5,
  },
  {
    id: "ds-pmkisan-004",
    source_name: "PM-KISAN Samman Nidhi Operational Modalities",
    source_type: "scheme_guidelines",
    publisher: "Ministry of Agriculture and Farmers Welfare, Govt of India",
    jurisdiction: "National",
    categories: ["government_benefits", "agricultural_insurance"],
    official_url: "https://pmkisan.gov.in",
    license_or_reuse_notes: "Direct Benefit Transfer Scheme Rules",
    publication_date: "2023-04-01",
    authority_level: 4,
  },
  {
    id: "ds-nalsa-005",
    source_name: "National Legal Services Authority (NALSA) Free Legal Aid Guidelines",
    source_type: "government_portal",
    publisher: "Supreme Court of India / NALSA",
    jurisdiction: "National",
    categories: ["legal_aid", "civil_dispute", "family_dispute"],
    official_url: "https://nalsa.gov.in",
    license_or_reuse_notes: "Legal Services Authorities Act 1987 statutory regulations",
    publication_date: "2022-09-10",
    authority_level: 5,
  },
];

export const SEED_LEGAL_SOURCES: SeedLegalSource[] = [
  {
    id: "leg-cpa-2019",
    source_title: "The Consumer Protection Act, 2019",
    source_type: "Central Act",
    issuing_authority: "Parliament of India",
    jurisdiction: "India",
    publication_date: "2019-08-09",
    official_url: "https://www.indiacode.nic.in/handle/123456789/15256",
    provisions: [
      {
        section_number: "Section 2(11)",
        section_title: "Deficiency in Service",
        content_text: "Deficiency means any fault, imperfection, shortcoming or inadequacy in the quality, nature and manner of performance which is required to be maintained by or under any law for the time being in force or has been undertaken to be performed by a person in pursuance of a contract or otherwise in relation to any service.",
        explanation: "Applies to insurance companies delaying claim settlement, e-commerce sellers refusing refunds, and builders delaying possession.",
      },
      {
        section_number: "Section 35",
        section_title: "Manner of Filing Consumer Complaint",
        content_text: "A complaint, in relation to any goods sold or delivered or agreed to be sold or delivered or any service provided or agreed to be provided, may be filed with a District Commission by the consumer to whom such goods are sold or delivered or service provided.",
        explanation: "Citizens can file disputes online via the e-Daakhil portal or through the National Consumer Helpline INGRAM portal.",
      },
    ],
  },
  {
    id: "leg-rti-2005",
    source_title: "The Right to Information Act, 2005",
    source_type: "Central Act",
    issuing_authority: "Parliament of India",
    jurisdiction: "India",
    publication_date: "2005-06-21",
    official_url: "https://www.indiacode.nic.in/handle/123456789/2065",
    provisions: [
      {
        section_number: "Section 6(1)",
        section_title: "Request for Obtaining Information",
        content_text: "A person, who desires to obtain any information under this Act, shall make a request in writing or through electronic means in English or Hindi or in the official language of the area in which the application is being made, accompanying such fee as may be prescribed, to the Central Public Information Officer or State Public Information Officer.",
        explanation: "Every Indian citizen has a statutory right to request public records from government departments without giving a reason.",
      },
      {
        section_number: "Section 7(1)",
        section_title: "Disposal of Request within Statutory Timelines",
        content_text: "The Central Public Information Officer or State Public Information Officer shall, as expeditiously as possible, and in any case within thirty days of the receipt of the request, either provide the information on payment of such fee as may be prescribed or reject the request for any of the reasons specified in sections 8 and 9. Provided that where the information sought for concerns the life or liberty of a person, the same shall be provided within forty-eight hours.",
        explanation: "Information must be supplied within 30 days. If the timeline is breached, it is deemed a refusal and allows an immediate First Appeal under Section 19.",
      },
      {
        section_number: "Section 19(1)",
        section_title: "First Appeal",
        content_text: "Any person who, does not receive a decision within the time specified in sub-section (1) or clause (a) of sub-section (3) of section 7, or is aggrieved by a decision of the Central Public Information Officer or State Public Information Officer, may within thirty days from the expiry of such period or from the receipt of such a decision prefer an appeal to such officer who is senior in rank to the Public Information Officer.",
        explanation: "File a First Appeal within 30 days if the PIO does not reply or provides incomplete records.",
      },
    ],
  },
];

export const SEED_JUDGMENTS: SeedJudgment[] = [
  {
    id: "judg-001",
    court: "Supreme Court of India",
    case_title: "National Insurance Co. Ltd. v. Harsolia Motors",
    case_identifier: "Civil Appeal No. 5352 of 2007",
    judgment_date: "2023-04-13",
    citation: "(2023) 8 SCC 362",
    source_url: "https://main.sci.gov.in/judgments",
    case_summary: "The Supreme Court examined whether delayed and unjustified repudiation of an insurance claim constitutes deficiency in service.",
    holding: "Held that an insurance policy is taken for indemnification against loss and not to generate commercial profit; an arbitrary rejection or inordinate delay by an insurance company constitutes actionable deficiency of service under consumer protection law.",
    full_text_extract: "An insurance contract is entered into to cover the risk of loss, and the claim made thereunder is for indemnification. Delay in settlement or repudiation on hyper-technical grounds amounts to deficiency in service.",
    legal_topics: ["agricultural_insurance", "consumer_dispute"],
  },
  {
    id: "judg-002",
    court: "Supreme Court of India",
    case_title: "Central Board of Secondary Education v. Aditya Bandopadhyay",
    case_identifier: "Civil Appeal No. 6454 of 2011",
    judgment_date: "2011-08-09",
    citation: "(2011) 8 SCC 497",
    source_url: "https://main.sci.gov.in/judgments",
    case_summary: "Right of citizens to inspect public evaluation records and answer keys under the Right to Information Act.",
    holding: "The Supreme Court affirmed that an examinee has the legal right to inspect evaluated answer books under Section 2(j) of the RTI Act; fiduciary relationships cannot be used routinely to deny inspection of government-held records.",
    full_text_extract: "The RTI Act seeks to promote transparency and accountability in the working of every public authority. Section 8 exemptions must be construed strictly and not as general pretexts to conceal public records.",
    legal_topics: ["rti_request", "education"],
  },
  {
    id: "judg-003",
    court: "National Consumer Disputes Redressal Commission (NCDRC)",
    case_title: "Agriculture Insurance Company of India Ltd. v. Rameshwar & Ors.",
    case_identifier: "Revision Petition No. 1120 of 2019",
    judgment_date: "2021-03-24",
    citation: "2021 (2) CPJ 145 (NC)",
    source_url: "https://cms.nic.in/ncdrc",
    case_summary: "Dispute over unadjusted PMFBY crop insurance claims following localized flood devastation.",
    holding: "The NCDRC held that where a farmer reports localized crop loss within the prescribed window, the joint loss assessment committee and insurer cannot sit over the claim indefinitely. The insurer was ordered to pay the full insured sum with 9% interest.",
    full_text_extract: "Under PMFBY guidelines, once a farmer intimates damage, the burden lies on the insurance company to conduct timely survey. Failure to survey cannot prejudice the farmer's entitlement to compensation.",
    legal_topics: ["agricultural_insurance"],
  },
];

export const SEED_GOV_RECORDS: SeedGovRecord[] = [
  {
    id: "rec-pmfby-01",
    scheme_name: "Pradhan Mantri Fasal Bima Yojana",
    topic: "agricultural_insurance",
    title: "Procedure for Reporting Localized Calamity and Hailstorm Crop Loss",
    details_text: "Farmers must report localized calamity (hailstorm, landslide, inundation, cloudburst) within 72 hours of the occurrence through the Crop Insurance App, toll-free helpline (14447), or to the local agriculture officer. A joint survey by the insurance company and state agriculture department must be completed within 10 days.",
    official_url: "https://pmfby.gov.in",
    state_or_region: "National",
  },
  {
    id: "rec-pmfby-02",
    scheme_name: "Pradhan Mantri Fasal Bima Yojana",
    topic: "agricultural_insurance",
    title: "Grievance Escalation Matrix for Unpaid PMFBY Claims",
    details_text: "If a crop insurance claim is delayed beyond 3 weeks from the end of harvest season, farmers can escalate to the District Level Grievance Redressal Committee (DGRC) headed by the District Magistrate/Collector. If unresolved within 30 days, file an appeal to the State Level Grievance Redressal Committee (SGRC).",
    official_url: "https://pmfby.gov.in/grievance",
    state_or_region: "National",
  },
  {
    id: "rec-pmkisan-01",
    scheme_name: "PM-KISAN Samman Nidhi",
    topic: "government_benefits",
    title: "Resolving Pending PM-KISAN Installments Due to Aadhaar / Bank NPCI Mismatch",
    details_text: "Farmers facing non-credit of the quarterly Rs 2000 installment must verify that their bank account is NPCI-mapped for Aadhaar Direct Benefit Transfer (DBT). Complete biometric or OTP-based e-KYC on pmkisan.gov.in. Verify land record seeding status with the local Patwari/Lekhpal.",
    official_url: "https://pmkisan.gov.in",
    state_or_region: "National",
  },
  {
    id: "rec-cyber-01",
    scheme_name: "National Cyber Crime Reporting",
    topic: "cybercrime_reporting",
    title: "Immediate Reporting Protocol for Online Banking and UPI Frauds (Helpline 1930)",
    details_text: "In cases of unauthorized bank or UPI debit, report within the 'Golden Hour' (first 2 to 3 hours) on toll-free helpline 1930 or cybercrime.gov.in. The Citizen Financial Cyber Fraud Reporting and Management System (CFCFRMS) flags the transaction to banks to freeze beneficiary accounts.",
    official_url: "https://cybercrime.gov.in",
    state_or_region: "National",
  },
];
