# NYAYASETU — System Architecture & Design Document

## 1. System Vision & Objectives
NYAYASETU is an AI-assisted legal-information, government data retrieval, document verification, and citizen-advocate collaboration platform specifically tailored for Indian citizens facing legal, regulatory, and public grievance challenges.

### Core Guarantees:
1. **Evidence-Grounded Retrieval**: The system never hallucinates legal provisions, court holdings, or government deadlines. Answers cite verified sources with official URLs and publication dates.
2. **Separation of Classification and Reasoning**: A multi-class machine learning classification model predicts the problem domain (e.g., Agricultural Insurance vs. Consumer Dispute). PostgreSQL parameterized full-text search retrieves authoritative records. The response layer synthesizes retrieved evidence with explicit uncertainty boundaries.
3. **Multi-Check Document Verification**: Rather than displaying an unverified generic "authentic" checkmark, the platform conducts granular, independent checks (SHA-256 hash integrity, MIME & magic bytes verification, OCR extraction, and cryptographic digital signature checks).
4. **Invitation-Only Case Collaboration**: Private case rooms enable citizens and verified advocates to collaborate securely with cryptographically hashed single-use invitation tokens, task management, and private quarantine-guarded document storage.

---

## 2. Component Topology

```
+---------------------------------------------------------------------------------+
|                                 CLIENT TIER                                     |
|             React 18 + Vite + TypeScript + Tailwind CSS (Port 5173)             |
|                  Vercel / Static Edge Deployment Compatible                     |
+---------------------------------------+-----------------------------------------+
                                        | HTTP / JSON (Strict CORS & Cookies)
                                        v
+---------------------------------------------------------------------------------+
|                                 BACKEND TIER                                    |
|              Node.js + Express + TypeScript + Zod (Port 5000)                   |
|                   Render / Railway / Container Deployment                       |
|                                                                                 |
|  - Authentication & Session Store (Argon2id password hashing, HTTP-only cookies) |
|  - Server-Side Role-Based Authorization (citizen, advocate, student, admin)    |
|  - Source Selection & Parameterized SQL Retrieval Engine                        |
|  - Private Document Vault & Quarantine Management                               |
|  - Cryptographic Invitation Manager & Audit Logger                              |
+-------------------+-----------------------------------------+-------------------+
                    | Internal Service Calls                  | Parameterized SQL
                    v                                         v
+---------------------------------------+   +-------------------------------------+
|              ML SERVICE               |   |            DATABASE TIER            |
|       Python 3.12 + FastAPI           |   |       PostgreSQL 16 Relational      |
|             (Port 8000)               |   |              (Port 5432)            |
|                                       |   |                                     |
| - TF-IDF + Logistic Regression        |   | - Users, Profiles, Sessions         |
| - Linear SVM & Naive Bayes Comparison |   | - Source Registry & Gazettes        |
| - Issue Category Classification       |   | - GIN tsvector Full-Text Search     |
| - Confidence Calibration & Rejection  |   | - Grounded Answers & Citations      |
| - Out-of-Scope / Clarification Prompts|   | - Case Rooms, Tasks & Audit Events  |
+---------------------------------------+   +-------------------------------------+
```

---

## 3. Communication Protocols & Security Boundaries
- **Frontend to Backend**: RESTful JSON over HTTP(S). Authentication via secure, HTTP-only session cookies. No JWTs or sensitive tokens stored in `localStorage`.
- **Backend to ML Service**: Internal private HTTP network. The ML service is strictly internal; no external client can call it directly or trigger arbitrary model retraining.
- **Backend to PostgreSQL**: Parameterized SQL queries via connection pool (`pg.Pool`). No AI-generated unrestricted SQL is ever executed.
- **Document Quarantine**: Uploaded files enter a private quarantine storage location first. Only after validation (size, MIME, magic-bytes, SHA-256, OCR, and signature checks) is the document released to authorized case room members.
