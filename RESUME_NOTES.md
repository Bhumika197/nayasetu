# NYAYASETU — Project Checkpoint & Resume Notes

> **Saved on:** October 15, 2026  
> **Author:** Ch Bhumika (`bhumika197`)  
> **Project Repository:** `https://github.com/Bhumika197/nayasetu`  
> **Hard Deadline:** October 16, 2026 — 9:00 PM IST  

---

## ⚠️ Critical Review & Personal Feedback (October 15)

```
All of this is ai bullshit 
personal take down: 
changes: 
1) Ui
2) add more features 
3) remove useless features

problems:
1. The complete architecture looks messed up need to sort it out and give a new path.
2. The way it is extracting answers shows it is a bad system like the models are not trained efficiently even though there are preexisting models used the main problem is that the models are not implemented properly.
3. The answers are not at all upto the marks.
4. The given webpages in the answers are not working properly.
5. The pipeline needs an obvious revision.

find out how am I supposed to do this and update the md file.
deadline (16.10.2026 - 9pm ist)
```

---

## 🎯 The Diagnosis: Why the Current Prototype Fell Short

1. **The Architecture Bottleneck (Classification ≠ Question Answering)**:
   - What we had: A simple 15-class Naive Bayes classifier that labeled a question as `"agricultural_insurance"` or `"consumer_dispute"`.
   - The failure point: The backend then ran static JavaScript `if/else` conditionals returning pre-baked hardcoded paragraphs! It **was not actually reading the legal texts dynamically**. That is why the answers felt generic, canned, and artificial.
2. **Model Implementation Flaw**:
   - Bag-of-words / TF-IDF Naive Bayes on 81 synthetic examples has no semantic understanding. If a farmer writes "they repudiated my claim", TF-IDF doesn't even know "repudiated" means "rejected".
   - We need **semantic sentence embeddings / cross-encoder passage ranking** using pre-trained Hugging Face models (`sentence-transformers/all-MiniLM-L6-v2`) running 100% locally on CPU without paid APIs.
3. **Dead / Unverified URLs**:
   - Endpoints like `https://pmfby.gov.in/grievance` or `https://cms.nic.in/ncdrc` can be stale or redirect. We must use verified live permalinks to India Code and actual government portals.
4. **Feature Bloat**:
   - Modules like complex multi-role registration queues, multi-check document verification mockups, and dummy audit events distract from the single core value: **giving an accurate, legally grounded, verifiable answer to an ordinary citizen's problem**.

---

## 🛠️ The New Architecture & Revision Path: "Real Legal RAG"

Instead of `Query -> Naive Bayes -> Hardcoded Template`, the revised pipeline will be:

```
+-----------------------------------------------------------------------------------+
| 1. INGESTION & PASSAGE CHUNKING                                                   |
| Real text chunks of:                                                              |
| - Consumer Protection Act 2019 (Exact statutory sections)                         |
| - Right to Information Act 2005 (Exact timelines & appeal sections)               |
| - PMFBY Operational Guidelines 2023 (Claim intimation, 72h window, joint survey)  |
| - NCDRC & Supreme Court Landmark Case Holdings                                    |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
| 2. LOCAL DENSE EMBEDDING & SEMANTIC RETRIEVAL (Python ml-service)                |
| Model: sentence-transformers/all-MiniLM-L6-v2 (Zero-cost, runs on local CPU)     |
| - Pre-computes embeddings for all legal clauses & rules                           |
| - Computes cosine similarity between user query and all legal clauses            |
| - Retrieves top 3 exact matching legal paragraphs (scores > 0.65)                 |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
| 3. DYNAMIC EXTRACTIVE QA & CITATION SYNTHESIS                                     |
| Instead of hardcoded strings, the engine extracts:                               |
| 1. Direct Statutory Provision (Act name + Section number)                        |
| 2. Key Rule / Condition (The exact extracted sentence governing the situation)    |
| 3. Mandatory Statutory Timeline (e.g. 72 hrs intimation, 30 days RTI disposal)   |
| 4. Prescribed Redressal Forum (DGRC / INGRAM 1915 / First Appellate Authority)    |
| 5. Direct Working Permalinks (Verified India Code & Govt Portals)                 |
+-----------------------------------------------------------------------------------+
                                        |
                                        v
+-----------------------------------------------------------------------------------+
| 4. SLEEK, MODERN CITIZEN UI (React 18 + Tailwind)                                 |
| - Single focused workspace: Clean prompt bar + live query suggestions             |
| - Clear breakdown: Statutory Section | Official Rule | Next Steps | Citations     |
| - 1-Click Complaint / RTI Draft Letter Generator                                 |
+-----------------------------------------------------------------------------------+
```

---

## ⏱️ Step-by-Step Execution Plan (Before 16.10.2026 - 9:00 PM IST)

| Phase | Milestone | Actions | Target Deadline |
| :--- | :--- | :--- | :--- |
| **Phase A** | **Live Real Embeddings & Retrieval** | Install `sentence-transformers` in `ml-service`. Vectorize 50+ real clauses of PMFBY, Consumer Protection Act, and RTI Act. Implement dynamic cosine search. | Oct 15 — 2:00 PM |
| **Phase B** | **Dynamic Answer Extraction Engine** | Replace backend hardcoded templates in `question.routes.ts` with true dynamic passage extraction and verified working permalinks. | Oct 15 — 8:00 PM |
| **Phase C** | **Feature Pruning & 1-Click Grievance Drafts** | Remove dummy advocate queue fluff. Add high-value **1-Click Legal Draft Generator** (RTI First Appeal draft, PMFBY Grievance letter to District Collector). | Oct 16 — 12:00 PM |
| **Phase D** | **UI/UX Overhaul & Final Polish** | Redesign the frontend into a clean, modern legal-tech tool with crisp typography, real-time citation cards, and exportable drafts. | Oct 16 — 6:00 PM |
| **Phase E** | **Verification & Final Push** | Run full end-to-end test suite, verify all external links, and push final release to GitHub before 9:00 PM deadline. | Oct 16 — 9:00 PM |

---

## 🔗 Verified Working Government Permalinks (No More Broken Links)

1. **PMFBY Portal**: `https://pmfby.gov.in/`
2. **India Code — Consumer Protection Act, 2019**: `https://www.indiacode.nic.in/handle/123456789/15256`
3. **India Code — Right to Information Act, 2005**: `https://www.indiacode.nic.in/handle/123456789/2065`
4. **National Consumer Helpline (INGRAM)**: `https://consumerhelpline.gov.in/`
5. **RTI Online Portal (DoPT)**: `https://rtionline.gov.in/`
6. **e-Courts Supreme Court Judgment Search**: `https://judgments.ecourts.gov.in/`
7. **NALSA Free Legal Aid Portal**: `https://nalsa.gov.in/`

---

## 📦 GitHub Repository
- **Remote:** `https://github.com/Bhumika197/nayasetu`
- **Branch:** `main`
- **Local Workspace:** `c:\Users\HP\OneDrive\Desktop\idea`
