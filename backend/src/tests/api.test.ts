import { describe, it, expect } from 'vitest';
import request from 'supertest';
import { app } from '../app.js';

describe('NYAYASETU Complete API Suite', () => {
  let sessionCookie: string;

  it('1. User Registration & Auto-Login', async () => {
    const email = `testuser_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .send({
        email,
        password: 'SecurePassword123!',
        full_name: 'Anjali Sharma',
        role: 'citizen',
      });

    expect(res.status).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.email).toBe(email);
    expect(res.headers['set-cookie']).toBeDefined();
    sessionCookie = res.headers['set-cookie'][0];
  });

  it('2. User Login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'citizen@example.com',
        password: 'NyayaSetu@2026',
      });

    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('citizen');
    expect(res.body).toHaveProperty('token');
  });

  it('3. Question Answering with Evidence Retrieval', async () => {
    const res = await request(app)
      .post('/api/v1/questions')
      .send({
        query: 'My crop insurance under PMFBY has been pending for 3 months after flood damage.',
      });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('ml_prediction');
    expect(res.body.ml_prediction.category).toBe('agricultural_insurance');
    expect(res.body.grounded_answer).toHaveProperty('summary');
    expect(res.body.grounded_answer.action_steps.length).toBeGreaterThan(0);
    expect(res.body.retrieved_evidence.length).toBeGreaterThan(0);
    expect(res.body.retrieved_evidence[0]).toHaveProperty('official_url');
  });

  it('4. Sources and Legal Library endpoints', async () => {
    const sourcesRes = await request(app).get('/api/v1/sources');
    expect(sourcesRes.status).toBe(200);
    expect(sourcesRes.body.count).toBeGreaterThanOrEqual(5);

    const legalRes = await request(app).get('/api/v1/sources/legal');
    expect(legalRes.status).toBe(200);
    expect(legalRes.body.count).toBeGreaterThanOrEqual(2);

    const judgmentsRes = await request(app).get('/api/v1/sources/judgments');
    expect(judgmentsRes.status).toBe(200);
    expect(judgmentsRes.body.count).toBeGreaterThanOrEqual(3);
  });

  it('5. Case Room Creation and Tasks (Authenticated)', async () => {
    const createRes = await request(app)
      .post('/api/v1/case-rooms')
      .set('Cookie', sessionCookie)
      .send({
        title: 'RTI Appeal for Road Works Tender',
        description: 'First appeal regarding Ward 12 tender sanction records.',
      });

    expect(createRes.status).toBe(201);
    const roomId = createRes.body.room.id;

    const taskRes = await request(app)
      .post(`/api/v1/case-rooms/${roomId}/tasks`)
      .set('Cookie', sessionCookie)
      .send({
        title: 'Draft First Appeal Form to Municipal Commissioner',
        due_date: '2026-11-15',
      });

    expect(taskRes.status).toBe(201);
    expect(taskRes.body.task.title).toContain('Draft First Appeal');
  });

  it('6. Document Multi-Stage Verification Pipeline', async () => {
    const res = await request(app)
      .post('/api/v1/documents/verify')
      .send({
        filename: 'Kisan_Credit_Card_Statement.pdf',
        file_size: 142050,
      });

    expect(res.status).toBe(200);
    expect(res.body.document).toHaveProperty('sha256_hash');
    expect(res.body.document.sha256_hash.length).toBe(64);
    expect(res.body.document.checks.length).toBe(5);
  });
});
