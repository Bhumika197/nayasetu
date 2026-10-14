from typing import Optional, List, Dict
from pydantic import BaseModel, Field

# Documented Legal Issue Taxonomy
SUPPORTED_CATEGORIES = [
    "agricultural_insurance",
    "government_benefits",
    "employment_wages",
    "consumer_dispute",
    "property_land",
    "tenancy",
    "family_dispute",
    "rti_request",
    "cybercrime_reporting",
    "public_service_grievance",
    "civil_dispute",
    "legal_aid",
    "education",
    "health_services",
    "other_or_unclear",
]

CATEGORY_DESCRIPTIONS: Dict[str, str] = {
    "agricultural_insurance": "PMFBY crop insurance claims, delayed payouts, crop damage assessments, helpline issues.",
    "government_benefits": "PM-KISAN, pension schemes, welfare ration cards, direct benefit transfer (DBT).",
    "employment_wages": "Unpaid wages, EPF/gratuity disputes, wrongful termination, factory work conditions.",
    "consumer_dispute": "Defective goods, misleading advertising, e-commerce refunds, service deficiency under Consumer Protection Act.",
    "property_land": "Land boundary disputes, title deeds, mutation records, unlawful encroachment.",
    "tenancy": "Rental agreements, eviction notices, security deposit withholding, maintenance disputes.",
    "family_dispute": "Maintenance under CrPC/HMA, domestic violence remedies, custody, succession rights.",
    "rti_request": "Right to Information applications, first appeals, delayed replies by Public Information Officers.",
    "cybercrime_reporting": "Online banking fraud, UPI scams, identity theft, unauthorized access.",
    "public_service_grievance": "Municipal water/electricity supply, road maintenance, public utility complaints.",
    "civil_dispute": "Contractual breach, recovery of money, injunction suits.",
    "legal_aid": "NALSA/SLSA free legal representation, eligibility for legal aid under Legal Services Authorities Act.",
    "education": "School/college admissions, fee disputes, scholarship delays, certificate verification.",
    "health_services": "Hospital overcharging, medical negligence complaints, Ayushman Bharat card claims.",
    "other_or_unclear": "Ambiguous, out of jurisdiction, or insufficient factual details.",
}

class PredictRequest(BaseModel):
    query: str = Field(..., min_length=3, max_length=1500, description="Citizen's question in plain English")
    language: Optional[str] = Field("en", description="Language code")

class PredictResponse(BaseModel):
    predicted_category: str
    confidence: float
    model_version: str
    model_type: str
    needs_clarification: bool
    clarification_prompt: Optional[str] = None
    category_description: Optional[str] = None
    all_probabilities: Optional[Dict[str, float]] = None

class ModelInfoResponse(BaseModel):
    status: str
    active_model: Optional[str] = None
    model_version: Optional[str] = None
    supported_categories: List[str]
    training_data_version: Optional[str] = None
    evaluation_macro_f1: Optional[float] = None
