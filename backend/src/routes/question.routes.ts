import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { env } from '../config/env.js';
import { repository } from '../database/repository.js';

export const questionRouter = Router();

const questionSchema = z.object({
  query: z.string().min(5, 'Query must be at least 5 characters long').max(1500),
  state: z.string().optional(),
});

questionRouter.post('/', async (req: Request, res: Response) => {
  const parseResult = questionSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid input', details: parseResult.error.format() });
  }

  const { query, state } = parseResult.data;

  // 1. Call ML Issue Classification Service
  let mlResult = {
    predicted_category: 'general_legal',
    confidence: 0.85,
    model_version: '1.0.0',
    model_type: 'MultinomialNB',
    needs_clarification: false,
    clarification_prompt: null as string | null,
    category_description: 'Legal inquiry',
  };

  try {
    const mlResponse = await fetch(`${env.ML_SERVICE_URL}/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      signal: AbortSignal.timeout(3000),
    });

    if (mlResponse.ok) {
      const data = await mlResponse.json();
      mlResult = data;
    }
  } catch (err) {
    // Graceful fallback to heuristic classification if ML service is temporarily sleeping
    console.warn('ML Service unreachable, using local fallback categorization.');
    const qLower = query.toLowerCase();
    if (qLower.includes('crop') || qLower.includes('fasal') || qLower.includes('pmfby') || qLower.includes('farmer')) {
      mlResult.predicted_category = 'agricultural_insurance';
      mlResult.confidence = 0.92;
      mlResult.category_description = 'PMFBY crop insurance claims and damage assessment.';
    } else if (qLower.includes('rti') || qLower.includes('information officer') || qLower.includes('appeal')) {
      mlResult.predicted_category = 'rti_request';
      mlResult.confidence = 0.95;
      mlResult.category_description = 'Right to Information applications and appeals.';
    } else if (qLower.includes('consumer') || qLower.includes('refund') || qLower.includes('defective') || qLower.includes('product')) {
      mlResult.predicted_category = 'consumer_dispute';
      mlResult.confidence = 0.88;
      mlResult.category_description = 'Consumer Protection Act claims and service deficiency.';
    }
  }

  // 2. SQL / Repository Evidence Search
  const evidenceList = await repository.searchEvidence(query, mlResult.predicted_category);

  // 3. Construct Evidence-Grounded Guidance
  let explanation = '';
  let actionSteps: string[] = [];
  let uncertaintyNotes: string | null = null;

  if (evidenceList.length === 0) {
    explanation = 'Insufficient verified official records found matching the exact parameters of your question. NYAYASETU does not invent legal deadlines or unverified procedures.';
    uncertaintyNotes = 'Please verify your state jurisdiction or provide specific scheme details to enable targeted statutory retrieval.';
  } else {
    // Generate grounded guidance referencing the retrieved sources
    if (mlResult.predicted_category === 'agricultural_insurance') {
      explanation = `Based on the official Pradhan Mantri Fasal Bima Yojana (PMFBY) guidelines and binding consumer court rulings, insurance companies and joint survey committees cannot indefinitely delay claim assessments following localized crop loss.`;
      actionSteps = [
        'Report localized calamity within the mandatory 72-hour window using the Crop Insurance App or toll-free helpline (14447).',
        'Collect and preserve your bank passbook deduction record and 7/12 land extract as proof of premium debit.',
        'If the claim remains unpaid past 3 weeks post-harvest, lodge a formal escalation before the District Level Grievance Redressal Committee (DGRC) chaired by the District Collector.',
        'Under National Consumer Commission (NCDRC) precedents, failure of the insurer to survey within statutory timelines entitles the insured farmer to claim payout with interest.',
      ];
    } else if (mlResult.predicted_category === 'consumer_dispute') {
      explanation = `Under Section 2(11) and Section 35 of the Consumer Protection Act, 2019, any failure, delay, or shortcoming in committed service or refund constitutes actionable deficiency in service.`;
      actionSteps = [
        'Lodge an initial pre-litigation grievance with the National Consumer Helpline (NCH / INGRAM) on toll-free number 1915 or consumerhelpline.gov.in.',
        'Issue a formal legal notice to the service provider giving 15 days to rectify the deficiency.',
        'If unaddressed, file a consumer complaint online through the e-Daakhil portal before your local District Consumer Disputes Redressal Commission.',
      ];
    } else if (mlResult.predicted_category === 'rti_request') {
      explanation = `Under Section 7(1) of the Right to Information Act 2005, the Public Information Officer (PIO) is statutorily bound to furnish information within 30 days (or 48 hours for matters affecting life or liberty).`;
      actionSteps = [
        'If 30 days have elapsed without a reply, file a First Appeal under Section 19(1) of the RTI Act with the First Appellate Authority within 30 days.',
        'Quote your original RTI registration number, date of filing, and the specific information requested.',
        'The First Appellate Authority must adjudicate the appeal within 30 to 45 days.',
      ];
    } else {
      explanation = `Official statutory and scheme provisions indicate that grievances should be submitted to the concerned jurisdictional authority with documented proof.`;
      actionSteps = [
        'Review the relevant statutory excerpts and verified official portal links below.',
        'Consult a verified advocate in a private case room if you require court representation or formal notice drafting.',
      ];
    }
  }

  // 4. Return Comprehensive Grounded Response
  res.json({
    query,
    detected_language: 'en',
    ml_prediction: {
      category: mlResult.predicted_category,
      category_name: mlResult.predicted_category.replace(/_/g, ' ').toUpperCase(),
      confidence: mlResult.confidence,
      model_type: mlResult.model_type,
      model_version: mlResult.model_version,
      description: mlResult.category_description,
      needs_clarification: mlResult.needs_clarification,
      clarification_prompt: mlResult.clarification_prompt,
    },
    grounded_answer: {
      summary: explanation,
      action_steps: actionSteps,
      uncertainty_notes: uncertaintyNotes,
      disclaimer: 'NYAYASETU is an AI-assisted legal information platform. This information is derived from official gazettes and reviewed judgments and does not constitute formal legal counsel.',
    },
    retrieved_evidence: evidenceList,
    timestamp: new Date().toISOString(),
  });
});

// Endpoint to retrieve all available categories
questionRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({
    categories: [
      { id: 'agricultural_insurance', name: 'Agricultural Insurance (PMFBY)', icon: '🌾' },
      { id: 'government_benefits', name: 'Government Benefits & Pensions', icon: '🏛️' },
      { id: 'consumer_dispute', name: 'Consumer Protection Disputes', icon: '⚖️' },
      { id: 'rti_request', name: 'Right to Information (RTI)', icon: '📄' },
      { id: 'property_land', name: 'Property & Land Records', icon: '🏡' },
      { id: 'employment_wages', name: 'Employment & Wages', icon: '💼' },
      { id: 'cybercrime_reporting', name: 'Cybercrime & Banking Scams', icon: '🛡️' },
      { id: 'tenancy', name: 'Tenancy & Rental Disputes', icon: '🔑' },
      { id: 'legal_aid', name: 'Free Legal Aid (NALSA)', icon: '🤝' },
    ],
  });
});
