import { Router, Response } from 'express';
import { z } from 'zod';
import { repository } from '../database/repository.js';
import { requireAuth, AuthenticatedRequest } from '../middleware/auth.js';

export const caseRoomRouter = Router();

// All case room endpoints require authentication
caseRoomRouter.use(requireAuth);

// List case rooms for current user
caseRoomRouter.get('/', async (req: AuthenticatedRequest, res: Response) => {
  const userId = req.user!.id;
  const rooms = await repository.getCaseRoomsForUser(userId);
  res.json({ rooms });
});

// Create a new case room
const createRoomSchema = z.object({
  title: z.string().min(3).max(200),
  description: z.string().max(1000).default(''),
});

caseRoomRouter.post('/', async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = createRoomSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid room details', details: parseResult.error.format() });
  }

  const { title, description } = parseResult.data;
  const room = await repository.createCaseRoom(title, description, req.user!.id);
  res.status(201).json({ message: 'Case room created', room });
});

// Get case room by ID
caseRoomRouter.get('/:id', async (req: AuthenticatedRequest, res: Response) => {
  const room = await repository.getCaseRoomById(req.params.id);
  if (!room) {
    return res.status(404).json({ error: 'Case room not found' });
  }

  // Authorization check: User must be creator or member
  const isMember = room.created_by === req.user!.id || room.members.some((m) => m.user_id === req.user!.id);
  if (!isMember && req.user!.role !== 'admin') {
    return res.status(403).json({ error: 'Forbidden: You are not a member of this private case room.' });
  }

  res.json({ room });
});

// Add task to case room
const addTaskSchema = z.object({
  title: z.string().min(2),
  due_date: z.string().optional(),
});

caseRoomRouter.post('/:id/tasks', async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = addTaskSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Invalid task format' });
  }

  const task = await repository.addTaskToCaseRoom(req.params.id, parseResult.data.title, parseResult.data.due_date);
  if (!task) {
    return res.status(404).json({ error: 'Case room not found' });
  }

  res.status(201).json({ message: 'Task added', task });
});

// Create single-use invitation token
const inviteSchema = z.object({
  intended_email: z.string().email(),
  role_in_room: z.enum(['advocate', 'client', 'observer']).default('advocate'),
});

caseRoomRouter.post('/:id/invitations', async (req: AuthenticatedRequest, res: Response) => {
  const parseResult = inviteSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({ error: 'Valid email required' });
  }

  const invite = await repository.createCaseInvitation(
    req.params.id,
    parseResult.data.intended_email,
    parseResult.data.role_in_room,
    req.user!.id
  );

  res.status(201).json({
    message: 'Single-use cryptographic invitation generated.',
    invitation_token: invite.rawToken,
    expires_at: invite.expiresAt,
    redemption_url: `/join-case?token=${invite.rawToken}`,
  });
});
