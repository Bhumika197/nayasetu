import os
import pandas as pd

DATA_DIR = os.path.join(os.path.dirname(__file__), "..", "data")
SAMPLE_CSV = os.path.join(DATA_DIR, "legal_queries_dataset.csv")

# Curated dataset of realistic Indian citizen queries across 15 legal issue categories
DATASET_RECORDS = [
    # 1. agricultural_insurance
    ("My crop was damaged due to unseasonal heavy rainfall in Maharashtra. PMFBY claim status is still pending after 3 months.", "agricultural_insurance"),
    ("How do I report localized crop loss within 72 hours on the PMFBY portal?", "agricultural_insurance"),
    ("The insurance company rejected my cotton crop insurance claim citing survey mismatch.", "agricultural_insurance"),
    ("Bank deducted PMFBY crop insurance premium from my KCC account but no policy was issued.", "agricultural_insurance"),
    ("District agricultural officer is not conducting crop cutting experiments for drought claims.", "agricultural_insurance"),
    ("Helpline for Pradhan Mantri Fasal Bima Yojana is unreachable and payment is delayed.", "agricultural_insurance"),
    ("Where can I file a grievance against universal sompo insurance for not settling soya bean claim?", "agricultural_insurance"),
    ("Post-harvest loss assessment for paddy submerged in flood water under government insurance.", "agricultural_insurance"),

    # 2. government_benefits
    ("My PM-KISAN 16th installment has not credited to my bank account due to e-KYC mismatch.", "government_benefits"),
    ("Old age pension under NSAP has stopped suddenly for my mother without any reason.", "government_benefits"),
    ("How to update Aadhaar linking with ration card for subsidized grains under NFSA?", "government_benefits"),
    ("Maternity benefit under Pradhan Mantri Matru Vandana Yojana is rejected by anganwadi.", "government_benefits"),
    ("Direct Benefit Transfer (DBT) failed with error NPCI mapper not linked to account.", "government_benefits"),
    ("Widow pension application status has been pending at tehsil office for six months.", "government_benefits"),
    ("Application for Antyodaya Anna Yojana (AAY) ration card was denied by food supply officer.", "government_benefits"),

    # 3. consumer_dispute
    ("I bought a mobile phone from an e-commerce website that stopped working within 2 days, and seller refuses refund.", "consumer_dispute"),
    ("Car dealership sold me a defective vehicle with engine trouble and refuses warranty replacement.", "consumer_dispute"),
    ("How to lodge a grievance on INGRAM National Consumer Helpline for airline cancellation refund?", "consumer_dispute"),
    ("Private hospital overcharged for medicines beyond MRP during emergency hospitalization.", "consumer_dispute"),
    ("Builder has delayed handing over flat possession by 2 years despite full payment.", "consumer_dispute"),
    ("Broadband internet provider charged monthly fee despite zero connection for 20 days.", "consumer_dispute"),
    ("Misleading advertisement by coaching institute claiming guaranteed 100 percent placement.", "consumer_dispute"),

    # 4. employment_wages
    ("My employer has withheld my last 3 months salary and relieving letter after I resigned.", "employment_wages"),
    ("Company is not depositing EPF provident fund contributions deducted from my monthly salary.", "employment_wages"),
    ("I was terminated from service without mandatory one month notice or retrenchment compensation.", "employment_wages"),
    ("Factory owner refuses to pay overtime wages for 12 hour daily shifts.", "employment_wages"),
    ("Employer refuses to release gratuity payment after completing 6 years of continuous service.", "employment_wages"),
    ("Contractual workers in government hospital denied minimum wages notified by state labor commission.", "employment_wages"),
    ("Female employee denied statutory paid maternity leave under Maternity Benefit Act.", "employment_wages"),

    # 5. property_land
    ("Neighbor has illegally encroached on our ancestral agriculture land boundary in village.", "property_land"),
    ("Tehsildar office has not updated mutation entry (Dakhil Kharij) despite registered sale deed.", "property_land"),
    ("How to obtain certified 7/12 extract or Jamabandi land record from revenue portal?", "property_land"),
    ("Seller forged documents and sold the same residential plot to two different buyers.", "property_land"),
    ("Gram panchayat is constructing a public drain through my registered private patta land.", "property_land"),
    ("Demarcation of farm land boundaries delayed by government revenue surveyor.", "property_land"),

    # 6. tenancy
    ("Landlord has refused to return my security deposit of 50000 rupees after vacating flat.", "tenancy"),
    ("Owner disconnected water and electricity supply to force immediate eviction without notice.", "tenancy"),
    ("Landlord suddenly increased house rent by 30 percent in violation of registered rental agreement.", "tenancy"),
    ("Tenant has stopped paying monthly rent for 6 months and refuses to vacate commercial premises.", "tenancy"),
    ("Notice period requirements for eviction under Model Tenancy Act guidelines.", "tenancy"),

    # 7. family_dispute
    ("How to file maintenance petition under Section 125 CrPC for wife and minor child?", "family_dispute"),
    ("Seeking emergency protection order and residence order under Domestic Violence Act 2005.", "family_dispute"),
    ("Father passed away without will, how are ancestral properties divided between daughters and sons?", "family_dispute"),
    ("Mutual consent divorce procedure and statutory waiting cooling off period under Hindu Marriage Act.", "family_dispute"),
    ("Grandparents denied visitation rights to see minor grandchild after parental separation.", "family_dispute"),

    # 8. rti_request
    ("Public Information Officer (PIO) failed to reply to my RTI application within 30 days deadline.", "rti_request"),
    ("How to draft and file a First Appeal under Section 19(1) of Right to Information Act?", "rti_request"),
    ("Municipal corporation rejected RTI query claiming information is exempt under section 8.", "rti_request"),
    ("Format for seeking road tender sanction files and expenditure receipts under RTI Act.", "rti_request"),
    ("State Information Commission has not listed second appeal hearing for over one year.", "rti_request"),

    # 9. cybercrime_reporting
    ("I lost 75000 rupees in an online credit card OTP phishing scam, transaction occurred 2 hours ago.", "cybercrime_reporting"),
    ("Someone created a fake profile with my photographs on social media and is extorting money.", "cybercrime_reporting"),
    ("Received fake WhatsApp message claiming electricity connection will be cut off with malicious APK.", "cybercrime_reporting"),
    ("Unauthorized UPI debit transactions happened while phone was in my possession.", "cybercrime_reporting"),
    ("How to register urgent financial fraud complaint on national cybercrime portal helpline 1930?", "cybercrime_reporting"),

    # 10. public_service_grievance
    ("Municipal corporation has not repaired massive open pothole on main road causing accidents.", "public_service_grievance"),
    ("Drinking water pipeline contaminated with sewage water in municipal ward for past 2 weeks.", "public_service_grievance"),
    ("Streetlights in residential colony non-functional for past 3 months despite multiple complaints.", "public_service_grievance"),
    ("Electricity board sending inflated commercial electricity bills for a locked residential house.", "public_service_grievance"),
    ("Garbage dumping ground created right in front of primary school gate causing health hazard.", "public_service_grievance"),

    # 11. civil_dispute
    ("Borrower took personal loan of 3 lakh rupees on promissory note and now refuses repayment.", "civil_dispute"),
    ("Contractor abandoned house renovation midway after taking 80 percent advance payment.", "civil_dispute"),
    ("How to file a civil suit for permanent injunction against unauthorized construction on common passage?", "civil_dispute"),
    ("Breach of commercial supply contract and non-delivery of raw materials on agreed schedule.", "civil_dispute"),

    # 12. legal_aid
    ("Who is eligible for free legal aid representation through NALSA and Taluk Legal Services?", "legal_aid"),
    ("Can an accused person in police custody without funds get free defense advocate from DLSA?", "legal_aid"),
    ("Income limit criteria for women and SC/ST citizens to apply for Legal Services Authority assistance.", "legal_aid"),
    ("How to approach Lok Adalat for pre-litigation settlement of bank loan recovery dispute?", "legal_aid"),

    # 13. education
    ("Private school refused admission under 25 percent RTE quota for economically weaker section.", "education"),
    ("University is withholding original graduation degree certificate over disputed laboratory dues.", "education"),
    ("State government post-matric scholarship amount not disbursed to college account for 2 semesters.", "education"),
    ("Deemed university arbitrarily hiked examination fees right before final semester exams.", "education"),

    # 14. health_services
    ("Hospital empanelled under Ayushman Bharat PM-JAY refused cashless treatment for cardiac surgery.", "health_services"),
    ("Patient died due to incorrect blood transfusion in private nursing home, seeking medical negligence enquiry.", "health_services"),
    ("Diagnostic pathology lab provided wrong cancer biopsy report causing unnecessary chemotherapy trauma.", "health_services"),
    ("Government district hospital lacks essential anti-venom medicine in rural emergency ward.", "health_services"),

    # 15. other_or_unclear
    ("Hello I need some information please help me.", "other_or_unclear"),
    ("What are the timings of the office?", "other_or_unclear"),
    ("I am feeling very stressed today about my situation.", "other_or_unclear"),
    ("Please call me back immediately.", "other_or_unclear"),
    ("Someone told me something happened somewhere last week.", "other_or_unclear"),
]

def prepare_dataset():
    os.makedirs(DATA_DIR, exist_ok=True)
    df = pd.DataFrame(DATASET_RECORDS, columns=["query", "issue_category"])
    df["language"] = "en"
    df["source"] = "nyayasetu_curated_v1"
    df["review_status"] = "verified"
    df.to_csv(SAMPLE_CSV, index=False)
    print(f"[OK] Prepared dataset with {len(df)} samples across {df['issue_category'].nunique()} categories at: {SAMPLE_CSV}")
    return SAMPLE_CSV

if __name__ == "__main__":
    prepare_dataset()
