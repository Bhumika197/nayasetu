import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';
import { repository, UserRecord } from '../database/repository.js';

export interface AuthenticatedRequest extends Request {
  user?: UserRecord;
}

export async function requireAuth(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  // Extract token from Cookie or Authorization header
  const token = req.cookies?.nyayasetu_session || req.headers.authorization?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. No session token provided.' });
  }

  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const session = await repository.findSession(tokenHash);

  if (!session) {
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }

  const user = await repository.findUserById(session.user_id);
  if (!user) {
    return res.status(401).json({ error: 'User account not found.' });
  }

  if (user.status === 'suspended') {
    return res.status(403).json({ error: 'Your account has been suspended by an administrator.' });
  }

  req.user = user;
  next();
}

export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        error: `Access denied. Requires one of the following roles: ${allowedRoles.join(', ')}`,
      });
    }
    next();
  };
}
