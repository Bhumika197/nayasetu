# All of this is ai bullshit 
personal take down: 
changes: 
1) Ui
2) add more features 
3) remove useless features 

problems:

1) The complete architecture looks messed up need to sort it out and give a new path.
2) The way it is extracting answers shows it is a bad systes like the models are not trained effiently even though the are preexesting models used the main problem is that the models are not impemented properly.
3) The answers are not at all upto the mark.
4) The given webpages in the answers is not working properly.
5) The pipline needs an obvious revision.

find out how am I supposed to do this and update the md file.
deadline (16.10.2026 - 9pm ist)

---

# NYAYASETU (न्यायसेतु)

> **AI-Assisted Legal Information, Government Data Retrieval, Document Verification and Case Collaboration Platform for Indian Citizens**

---

## 🏛️ Project Vision & Purpose

**NYAYASETU** is an evidence-grounded legal intelligence bridge designed to assist Indian citizens in navigating complex issues involving:
- Agricultural schemes (Pradhan Mantri Fasal Bima Yojana - PMFBY, PM-KISAN, Kisan Call Centers)
- Consumer disputes (defective products, service deficiencies under Consumer Protection Act 2019)
- Right to Information (RTI applications, timelines, and appeals)
- Public grievances, welfare entitlements, tenancy, and civil remedies

### Non-Hallucinatory Principles:
- **ML Issue Classification**: Directs questions to verified source collections (Statutes, Scheme Circulars, Judgments).
- **PostgreSQL Parameterized Retrieval**: Queries authoritative indexed records using `tsvector` and `GIN` indexes without executing arbitrary AI-generated SQL.
- **Evidence-Grounded Explanations**: Every answer provides official government URLs, publication dates, and uncertainty notes when information is incomplete.
- **Multi-Check Document Verification**: Distinct validation stages (SHA-256 integrity, MIME & magic bytes, OCR text extraction, and digital signature checks).
- **Private Case Rooms**: Single-use cryptographically hashed invitation tokens allowing citizens and verified advocates to review files and tasks safely.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Role |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons | Responsive citizen portal & advocate workspace |
| **Backend** | Node.js (v22), Express, TypeScript, Zod, Helmet, Argon2 | REST API, role-based authorization, session security |
| **Database** | PostgreSQL 16+ (tsvector, GIN indexes, Foreign Keys) | Relational store for users, sources, cases & audit events |
| **ML Service** | Python 3.12, FastAPI, scikit-learn, pandas, joblib | Multi-class legal issue classification & confidence calibration |
| **Storage** | Local Quarantine & Private Vault | Multi-stage document verification & private case files |

---

## 🚀 Local Development Setup (Windows PowerShell)

### Prerequisites:
- **Node.js**: v20+ (Verified: v22.13.0)
- **Python**: 3.10+ (Verified: 3.12.10)
- **PostgreSQL**: Local instance or Docker (`docker-compose up -d postgres`)

### 1. Environment Setup
```powershell
# Copy environment template
Copy-Item .env.example .env
```

### 2. Backend Service
```powershell
cd backend
npm install
npm test
npm run dev
# Running on http://localhost:5000 (Health check: http://localhost:5000/api/v1/health)
```

### 3. ML Classification Service
```powershell
cd ml-service
python -m venv .venv
.\.venv\Scripts\pip install -r requirements.txt
.\.venv\Scripts\pytest
.\.venv\Scripts\uvicorn src.main:app --port 8000 --reload
# Running on http://127.0.0.1:8000 (Health check: http://127.0.0.1:8000/health)
```

### 4. Frontend Application
```powershell
cd frontend
npm install
npm run dev
# Running on http://localhost:5173
```

---

## 📋 Implementation Phases

- [x] **Phase 0: Repository & Environment Inspection** (Toolchains verified, local git tracking initialized)
- [x] **Phase 1: Architecture & Project Foundation** (Backend Express+TS, ML FastAPI, Frontend React+Vite, Database migrations, Health checks)
- [ ] **Phase 2: Authentication & Role-Based Access Control** (Argon2id, server-side sessions, advocate verification queue)
- [ ] **Phase 3: Source Registry & Open Data Ingestion** (Data.gov.in connectors, PMFBY/PM-KISAN CSV/JSON parsers)
- [ ] **Phase 4: SQL Parameterized Retrieval Engine** (GIN indexes, tsvector ranking, jurisdiction/date filters)
- [ ] **Phase 5: ML Baseline Model Training** (TF-IDF + Logistic Regression, Linear SVM, Naive Bayes, metrics evaluation)
- [ ] **Phase 6: Evidence-Grounded Q&A Pipeline** (Full integration of query -> classification -> SQL retrieval -> cited answer)
- [ ] **Phase 7: Legal Library & Reviewed Judgments**
- [ ] **Phase 8: Multi-Check Document Verification**
- [ ] **Phase 9: Case Rooms & Advocate-Client Collaboration**
- [ ] **Phase 10: Multilingual Evaluation & Expansion**
- [ ] **Phase 11: UI Polishing & Accessibility**
- [ ] **Phase 12: End-to-End Testing, Report & Viva Guide**

---

## 🔒 Security & Privacy Notice
NYAYASETU strictly preserves citizen privacy:
- Case room files are never accessible via public web assets.
- Raw passwords and session secrets are never committed or logged.
- Demonstrations use synthetic and permitted public government records only.
