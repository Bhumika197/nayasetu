# NYAYASETU — Project Checkpoint & Resume Notes

> **Saved on:** October 15, 2026  
> **Author:** Ch Bhumika (`bhumika197`)  
> **Project Repository:** `https://github.com/bhumika197/nayasetu`  
> **Purpose:** Comprehensive technical handoff and restart guide for future development and viva preparation.

---

## 📍 1. Current State & What Has Been Built

The platform is **fully functional locally** across all three tiers:

| Component | Status | Port | Tech Stack |
| :--- | :--- | :--- | :--- |
| **Frontend Application** | ✅ Operational | `5173` | React 18, Vite, TypeScript, Tailwind CSS, Lucide Icons |
| **Core Backend API** | ✅ Operational | `5000` | Node.js (v22), Express, TypeScript, Zod, Argon2, Helmet |
| **ML Classification Service** | ✅ Operational | `8000` | Python 3.12, FastAPI, scikit-learn, joblib, pandas |
| **Relational Database** | ✅ Connected | `5432` / Fallback | Dual PostgreSQL + Local Memory Repository with Seed Data |

### Live Working Features:
1. **Interactive Citizen Q&A Engine**: Plain English query -> Real ML classification (15 categories, 82.3% confidence) -> Parameterized SQL/evidence retrieval -> Grounded explanation citing official URLs (`pmfby.gov.in`, `indiacode.nic.in`, `cms.nic.in`) + actionable steps + uncertainty disclaimers.
2. **Authoritative Government Source Registry**: 5 connected official sources (PMFBY, NCH Consumer Helpline, RTI Online, PM-KISAN, NALSA).
3. **Statutes & Judgments Library**: Codified sections of Consumer Protection Act 2019, RTI Act 2005, and landmark Supreme Court & NCDRC holdings.
4. **Document Verification Studio**: Multi-check pipeline (SHA-256 hash digest calculation, MIME/structure validation, OCR text extraction preview, cryptographic signature check, quarantine status).
5. **Private Case Rooms**: Create rooms, track action item tasks with due dates, and generate single-use cryptographic invitation tokens with 1-click copy.
6. **Authentication & Session Security**: Email/password registration, login, logout, secure HttpOnly session cookies, plus 1-click demo logins for both *Rajesh Kumar (Citizen)* and *NYAYASETU Administrator*.

---

## 🛠️ 2. Errors Encountered & How They Were Resolved

| Error | Root Cause | Fix Applied |
| :--- | :--- | :--- |
| **`error TS1470: The 'import.meta' meta-property is not allowed`** | `backend/package.json` was missing `"type": "module"`, defaulting TypeScript to CommonJS. | Added `"type": "module"` to `backend/package.json`. |
| **`UnicodeEncodeError: 'charmap' codec can't encode character '\u2705'`** | Windows PowerShell console uses `cp1252` encoding by default; Unicode emojis in `print()` statements failed. | Replaced Unicode emojis with ASCII status markers (`[OK]`, `[RESULT]`, `[BEST]`) in Python scripts. |
| **`ModuleNotFoundError: No module named 'src'` in pytest** | Running pytest from root workspace did not include `ml-service` root in `sys.path`. | Created `ml-service/pytest.ini` with `pythonpath = .` and added `ml-service/src/__init__.py`. |
| **Frontend TypeScript Strict Type Errors (`TS6133`, `TS2339`)** | Unused imports in strict mode and missing `model_version` property in `QuestionResponse`. | Cleaned unused imports and added `model_version?: string` in `frontend/src/App.tsx`. |
| **Database Disconnection Handling** | If PostgreSQL service is not active, direct queries would throw unhandled connection refused. | Built a resilient repository layer (`backend/src/database/repository.ts`) that seamlessly uses pre-loaded seed data if PostgreSQL is offline. |

---

## 🚀 3. How to Restart Development in One Step

When you reopen Antigravity next time, open PowerShell in this directory:

### Option A: One-Click Start (All 3 Services)
```powershell
powershell -ExecutionPolicy Bypass -File "scripts\start-all.ps1"
```
This opens three dedicated terminals and starts:
- ML Service on `http://127.0.0.1:8000`
- Backend API on `http://localhost:5000`
- Frontend UI on `http://localhost:5173`

### Option B: One-Click Run All Tests
```powershell
powershell -ExecutionPolicy Bypass -File "scripts\test-all.ps1"
```
Runs the 9 Backend Vitest tests, 3 ML Service Pytest tests, and builds the Frontend bundle.

### Option C: Manual Terminal Start
- **Terminal 1 (Backend)**:
  ```powershell
  cd backend
  npm run dev
  ```
- **Terminal 2 (ML Service)**:
  ```powershell
  cd ml-service
  .\.venv\Scripts\uvicorn src.main:app --port 8000 --reload
  ```
- **Terminal 3 (Frontend)**:
  ```powershell
  cd frontend
  npm run dev
  ```

---

## 🎯 4. What Needs to Be Done Next (Upcoming Phases)

When you resume building, here are the exact planned milestones:

1. **Connect Live PostgreSQL (Parity Mode)**:
   - Run `docker-compose up -d postgres` or start local PostgreSQL service.
   - Run `cd backend; npm run migrate` to apply `001_initial_schema.sql` directly to the live PostgreSQL database.
2. **Expand ML Training Dataset (Phase 10)**:
   - Add more citizen query variations in `ml-service/data/legal_queries_dataset.csv` (aim for 200–500 queries).
   - Re-run `python -m src.train` to update `best_classifier.joblib`.
   - Implement Hindi/multilingual preprocessing using an Indic embedding model or tokenization.
3. **Data Ingestion Connectors (Phase 3 & 17)**:
   - In `ingestion/`: implement real CSV import scripts for PMFBY district data and Data.gov.in API endpoints once an API key is configured in `.env`.
4. **Deploy to Cloud (Eventual Deployment)**:
   - **Frontend**: Connect `frontend/` to Vercel (already zero-config React + Vite build).
   - **Backend**: Deploy `backend/` to Render or Railway with managed PostgreSQL.
   - **ML Service**: Deploy `ml-service/` as an independent FastAPI container on Render or Fly.io.

---

## 📦 5. GitHub Repository Details
- **Account:** `bhumika197`
- **Repository Name:** `nayasetu`
- **Remote URL:** `https://github.com/bhumika197/nayasetu.git`
- **Branch:** `main`
