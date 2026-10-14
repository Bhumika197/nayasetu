# NYAYASETU — Relational Database Architecture & Schema

## 1. Design Principles
The NYAYASETU database is structured on PostgreSQL 16+ as a relational store.
- **Data Integrity**: Foreign keys enforce referential integrity (`ON DELETE CASCADE` or `SET NULL` as appropriate).
- **Search Performance**: Full-text search with `tsvector` and `GIN` indexes enables sub-second parameterized retrieval across millions of words in statutory provisions, scheme records, and court holdings.
- **Auditability**: An immutable `audit_events` log records security-relevant operations (authentication, document uploads, case room invitations) without leaking sensitive plaintext payloads.
- **Privacy by Design**: Sensitive documents are stored outside the public document root in private storage with SHA-256 hashes recorded in the database.

---

## 2. Entity Relational Diagram (ERD)

```
       +--------------------+
       |       users        |
       +--------------------+
         | 1           | 1
         |             |
         v 1           v 0..1
+------------------+  +--------------------+
|  user_sessions   |  | advocate_profiles  |
+------------------+  +--------------------+
         | 1
         | (created_by)
         v 0..*
+--------------------+ 1      0..* +--------------------+
|    case_rooms      |------------<| case_room_members  |
+--------------------+             +--------------------+
    | 1         | 1
    |           |
    v 0..*      v 0..*
+-----------+  +--------------------+
| case_tasks|  |     documents      |
+-----------+  +--------------------+
                         | 1
                         v 0..*
               +------------------------------+
               | document_verification_checks |
               +------------------------------+

+--------------------+ 1      0..* +-----------------------------+
|    data_sources    |------------<| government_dataset_records  |
+--------------------+             +-----------------------------+
                                       (tsvector search_vector)

+--------------------+ 1      0..* +-----------------------------+
|   legal_sources    |------------<|       legal_provisions      |
+--------------------+             +-----------------------------+
                                       (tsvector search_vector)

+--------------------+
|     judgments      | (tsvector search_vector, GIN legal_topics)
+--------------------+

+--------------------+ 1      0..* +--------------------+ 1     0..* +-----------------+
|   query_sessions   |------------<|   query_messages   |-----------<| answer_evidence |
+--------------------+             +--------------------+            +-----------------+
```

---

## 3. Database Indexes & Query Strategy
- **GIN Indexes**:
  - `idx_legal_provisions_tsv` ON `legal_provisions USING GIN(search_vector)`
  - `idx_gov_records_tsv` ON `government_dataset_records USING GIN(search_vector)`
  - `idx_judgments_tsv` ON `judgments USING GIN(search_vector)`
- **Category & Topic Filters**:
  - `idx_gov_records_scheme`, `idx_gov_records_topic`
  - `idx_data_sources_categories USING GIN(categories)`
- **Security & Authorization**:
  - `idx_user_sessions_token`, `idx_user_sessions_expires`
  - `idx_room_member` UNIQUE constraint preventing duplicate room assignments
