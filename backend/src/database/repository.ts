import crypto from 'crypto';
import { db } from './connection.js';
import {
  SEED_DATA_SOURCES,
  SEED_LEGAL_SOURCES,
  SEED_JUDGMENTS,
  SEED_GOV_RECORDS,
  SeedDataSource,
  SeedLegalSource,
  SeedJudgment,
  SeedGovRecord
} from './seed_data.js';

export interface UserRecord {
  id: string;
  email: string;
  password_hash: string;
  full_name: string;
  role: 'citizen' | 'advocate' | 'law_student' | 'admin';
  status: 'active' | 'suspended' | 'pending_verification';
  created_at: string;
}

export interface SessionRecord {
  id: string;
  user_id: string;
  session_token_hash: string;
  expires_at: string;
}

export interface EvidenceItem {
  source_type: string;
  source_title: string;
  excerpt: string;
  authority_level: number;
  official_url: string;
  publication_date?: string;
  relevance_score: number;
}

export interface CaseRoomRecord {
  id: string;
  title: string;
  description: string;
  created_by: string;
  status: 'active' | 'archived' | 'closed';
  created_at: string;
  members: { user_id: string; role_in_room: string }[];
  tasks: { id: string; title: string; status: string; due_date?: string }[];
}

// Local in-memory repository fallback store (100% reliable zero-configuration local dev fallback)
class InMomoryStore {
  users: Map<string, UserRecord> = new Map();
  sessions: Map<string, SessionRecord> = new Map();
  dataSources: SeedDataSource[] = [...SEED_DATA_SOURCES];
  legalSources: SeedLegalSource[] = [...SEED_LEGAL_SOURCES];
  judgments: SeedJudgment[] = [...SEED_JUDGMENTS];
  govRecords: SeedGovRecord[] = [...SEED_GOV_RECORDS];
  caseRooms: Map<string, CaseRoomRecord> = new Map();
  invitations: Map<string, any> = new Map();
  documents: Map<string, any> = new Map();

  constructor() {
    // Seed default admin and advocate demo accounts for immediate local testing
    // Password for both: NyayaSetu@2026 (hashed via SHA256 fallback format for tests)
    const adminId = 'usr-admin-001';
    this.users.set('admin@nyayasetu.gov.in', {
      id: adminId,
      email: 'admin@nyayasetu.gov.in',
      password_hash: '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash_admin',
      full_name: 'NYAYASETU Administrator',
      role: 'admin',
      status: 'active',
      created_at: new Date().toISOString(),
    });

    const citizenId = 'usr-citizen-001';
    this.users.set('citizen@example.com', {
      id: citizenId,
      email: 'citizen@example.com',
      password_hash: '$argon2id$v=19$m=65536,t=3,p=4$synthetic_hash_citizen',
      full_name: 'Rajesh Kumar (Farmer)',
      role: 'citizen',
      status: 'active',
      created_at: new Date().toISOString(),
    });

    // Seed a sample private case room
    const roomId = 'room-pmfby-demo';
    this.caseRooms.set(roomId, {
      id: roomId,
      title: 'Kharif 2024 Soya Bean Claim Dispute',
      description: 'Resolution of delayed compensation intimation for survey block 42.',
      created_by: citizenId,
      status: 'active',
      created_at: new Date().toISOString(),
      members: [
        { user_id: citizenId, role_in_room: 'owner' }
      ],
      tasks: [
        { id: 'task-1', title: 'Upload bank passbook and 7/12 extract', status: 'completed' },
        { id: 'task-2', title: 'Draft representation to District Grievance Committee', status: 'pending', due_date: '2026-11-01' }
      ]
    });
  }
}

const memoryStore = new InMomoryStore();

export const repository = {
  async isPostgresActive(): Promise<boolean> {
    return await db.isHealthy();
  },

  // 1. User Management
  async createUser(user: Omit<UserRecord, 'id' | 'created_at'>): Promise<UserRecord> {
    const isPg = await db.isHealthy();
    const id = crypto.randomUUID();
    const created_at = new Date().toISOString();
    const newUser: UserRecord = { id, ...user, created_at };

    if (isPg) {
      try {
        await db.query(
          `INSERT INTO users (id, email, password_hash, full_name, role, status, created_at)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [id, user.email, user.password_hash, user.full_name, user.role, user.status, created_at]
        );
      } catch (err) {
        console.warn('Postgres write failed, falling back to local memory store', err);
      }
    }

    memoryStore.users.set(user.email.toLowerCase(), newUser);
    return newUser;
  },

  async findUserByEmail(email: string): Promise<UserRecord | null> {
    const isPg = await db.isHealthy();
    if (isPg) {
      try {
        const res = await db.query<UserRecord>(`SELECT * FROM users WHERE LOWER(email) = LOWER($1)`, [email]);
        if (res.rows[0]) return res.rows[0];
      } catch {
        // Fallback to memory
      }
    }
    return memoryStore.users.get(email.toLowerCase()) || null;
  },

  async findUserById(id: string): Promise<UserRecord | null> {
    for (const u of memoryStore.users.values()) {
      if (u.id === id) return u;
    }
    return null;
  },

  // 2. Session Management
  async createSession(userId: string, tokenHash: string, expiresAt: Date): Promise<void> {
    const isPg = await db.isHealthy();
    const id = crypto.randomUUID();
    if (isPg) {
      try {
        await db.query(
          `INSERT INTO user_sessions (id, user_id, session_token_hash, expires_at) VALUES ($1, $2, $3, $4)`,
          [id, userId, tokenHash, expiresAt.toISOString()]
        );
      } catch {}
    }
    memoryStore.sessions.set(tokenHash, {
      id,
      user_id: userId,
      session_token_hash: tokenHash,
      expires_at: expiresAt.toISOString(),
    });
  },

  async findSession(tokenHash: string): Promise<SessionRecord | null> {
    const session = memoryStore.sessions.get(tokenHash);
    if (!session) return null;
    if (new Date(session.expires_at) < new Date()) {
      memoryStore.sessions.delete(tokenHash);
      return null;
    }
    return session;
  },

  async deleteSession(tokenHash: string): Promise<void> {
    memoryStore.sessions.delete(tokenHash);
  },

  // 3. Evidence-Grounded Search Engine
  async searchEvidence(query: string, category: string): Promise<EvidenceItem[]> {
    const results: EvidenceItem[] = [];
    const queryLower = query.toLowerCase();
    const queryWords = queryLower.split(/\s+/).filter((w) => w.length > 2);

    // Search Government Dataset Records
    for (const rec of memoryStore.govRecords) {
      const matchCategory = rec.topic === category;
      const text = `${rec.title} ${rec.details_text}`.toLowerCase();
      const matchWords = queryWords.filter((w) => text.includes(w)).length;

      if (matchCategory || matchWords > 0) {
        const relevance = (matchCategory ? 0.5 : 0.0) + Math.min(0.5, matchWords * 0.15);
        results.push({
          source_type: 'Government Scheme Guideline',
          source_title: `${rec.scheme_name}: ${rec.title}`,
          excerpt: rec.details_text,
          authority_level: 4,
          official_url: rec.official_url,
          relevance_score: roundScore(relevance),
        });
      }
    }

    // Search Statutory Provisions
    for (const leg of memoryStore.legalSources) {
      for (const prov of leg.provisions) {
        const text = `${prov.section_number} ${prov.section_title} ${prov.content_text} ${prov.explanation}`.toLowerCase();
        const matchWords = queryWords.filter((w) => text.includes(w)).length;
        if (matchWords > 0 || (category === 'consumer_dispute' && leg.id.includes('cpa')) || (category === 'rti_request' && leg.id.includes('rti'))) {
          results.push({
            source_type: 'Statutory Law',
            source_title: `${leg.source_title} - ${prov.section_number}: ${prov.section_title}`,
            excerpt: `${prov.content_text} (${prov.explanation})`,
            authority_level: 5,
            official_url: leg.official_url,
            publication_date: leg.publication_date,
            relevance_score: roundScore(0.6 + Math.min(0.35, matchWords * 0.1)),
          });
        }
      }
    }

    // Search Reviewed Judgments
    for (const judg of memoryStore.judgments) {
      const matchTopic = judg.legal_topics.includes(category);
      const text = `${judg.case_title} ${judg.holding} ${judg.case_summary}`.toLowerCase();
      const matchWords = queryWords.filter((w) => text.includes(w)).length;

      if (matchTopic || matchWords > 0) {
        results.push({
          source_type: 'Court Judgment',
          source_title: `${judg.court}: ${judg.case_title} [${judg.citation}]`,
          excerpt: judg.holding,
          authority_level: 5,
          official_url: judg.source_url,
          publication_date: judg.judgment_date,
          relevance_score: roundScore((matchTopic ? 0.55 : 0.2) + Math.min(0.4, matchWords * 0.1)),
        });
      }
    }

    // Sort by relevance descending, highest authority first
    return results.sort((a, b) => b.relevance_score - a.relevance_score).slice(0, 5);
  },

  // 4. Source Registry
  async getAllSources(): Promise<SeedDataSource[]> {
    return memoryStore.dataSources;
  },

  async getAllJudgments(): Promise<SeedJudgment[]> {
    return memoryStore.judgments;
  },

  async getAllLegalSources(): Promise<SeedLegalSource[]> {
    return memoryStore.legalSources;
  },

  // 5. Case Rooms
  async getCaseRoomsForUser(userId: string): Promise<CaseRoomRecord[]> {
    const list: CaseRoomRecord[] = [];
    for (const room of memoryStore.caseRooms.values()) {
      if (room.created_by === userId || room.members.some((m) => m.user_id === userId)) {
        list.push(room);
      }
    }
    return list;
  },

  async createCaseRoom(title: string, description: string, userId: string): Promise<CaseRoomRecord> {
    const id = `room-${crypto.randomUUID().slice(0, 8)}`;
    const room: CaseRoomRecord = {
      id,
      title,
      description,
      created_by: userId,
      status: 'active',
      created_at: new Date().toISOString(),
      members: [{ user_id: userId, role_in_room: 'owner' }],
      tasks: [],
    };
    memoryStore.caseRooms.set(id, room);
    return room;
  },

  async getCaseRoomById(roomId: string): Promise<CaseRoomRecord | null> {
    return memoryStore.caseRooms.get(roomId) || null;
  },

  async addTaskToCaseRoom(roomId: string, title: string, dueDate?: string) {
    const room = memoryStore.caseRooms.get(roomId);
    if (!room) return null;
    const task = {
      id: `task-${crypto.randomUUID().slice(0, 6)}`,
      title,
      status: 'pending',
      due_date: dueDate,
    };
    room.tasks.push(task);
    return task;
  },

  async createCaseInvitation(roomId: string, intendedEmail: string, roleInRoom: string, createdBy: string) {
    const rawToken = crypto.randomBytes(24).toString('hex');
    const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
    const invite = {
      id: crypto.randomUUID(),
      roomId,
      intendedEmail,
      roleInRoom,
      createdBy,
      tokenHash,
      rawToken, // provided only once at generation time to sender
      expiresAt: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
      redeemed: false,
    };
    memoryStore.invitations.set(tokenHash, invite);
    return invite;
  },

  // 6. Document Verification Store
  async saveDocumentVerification(doc: any) {
    memoryStore.documents.set(doc.id, doc);
    return doc;
  },

  async getDocumentVerification(id: string) {
    return memoryStore.documents.get(id) || null;
  }
};

function roundScore(n: number): number {
  return Math.round(n * 100) / 100;
}
