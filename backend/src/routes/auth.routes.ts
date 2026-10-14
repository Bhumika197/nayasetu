import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { z } from 'zod';
import { repository } from '../database/repository.js';
import { hashPassword, verifyPassword } from '../auth/password.js';
import { AuthenticatedRequest, requireAuth } from '../middleware/auth.js';
import { env } from '../config/env.js';

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  full_name: z.string().min(2, 'Name is required'),
  role: z.enum(['citizen', 'advocate', 'law_student']).default('citizen'),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// Registration Endpoint
authRouter.post('/register', async (req: Request, res: Response) => {
  const parseResult = registerSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Validation failed', details: parseResult.error.format() });
  }

  const { email, password, full_name, role } = parseResult.data;

  const existing = await repository.findUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email address already exists.' });
  }

  const password_hash = await hashPassword(password);
  const user = await repository.createUser({
    email,
    password_hash,
    full_name,
    role,
    status: 'active',
  });

  // Auto-login after registration: create session
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000); // 7 days

  await repository.createSession(user.id, tokenHash, expiresAt);

  res.cookie('nyayasetu_session', rawToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    expires: expiresAt,
  });

  res.status(201).json({
    message: 'Registration successful',
    token: rawToken,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
    },
  });
});

// Login Endpoint
authRouter.post('/login', async (req: Request, res: Response) => {
  const parseResult = loginSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid email or password format.' });
  }

  const { email, password } = parseResult.data;
  const user = await repository.findUserByEmail(email);

  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isValid = await verifyPassword(user.password_hash, password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  // Create session
  const rawToken = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(rawToken).digest('hex');
  const expiresAt = new Date(Date.now() + 7 * 24 * 3600 * 1000);

  await repository.createSession(user.id, tokenHash, expiresAt);

  res.cookie('nyayasetu_session', rawToken, {
    httpOnly: true,
    secure: env.COOKIE_SECURE,
    sameSite: 'lax',
    expires: expiresAt,
  });

  res.json({
    message: 'Signed in successfully',
    token: rawToken,
    user: {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      status: user.status,
    },
  });
});

// Logout Endpoint
authRouter.post('/logout', async (req: Request, res: Response) => {
  const token = req.cookies?.nyayasetu_session || req.headers.authorization?.replace('Bearer ', '');
  if (token) {
    const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
    await repository.deleteSession(tokenHash);
  }

  res.clearCookie('nyayasetu_session');
  res.json({ message: 'Signed out successfully' });
});

// Current User Profile Endpoint
authRouter.get('/me', requireAuth, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    user: {
      id: req.user?.id,
      email: req.user?.email,
      full_name: req.user?.full_name,
      role: req.user?.role,
      status: req.user?.status,
    },
  });
});
