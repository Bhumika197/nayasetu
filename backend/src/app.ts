import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { db } from './database/connection.js';
import { authRouter } from './routes/auth.routes.js';
import { questionRouter } from './routes/question.routes.js';
import { sourcesRouter } from './routes/sources.routes.js';
import { caseRoomRouter } from './routes/caseroom.routes.js';
import { documentRouter } from './routes/document.routes.js';

export const app = express();

// Security Headers
app.use(helmet());

// Cookie parsing
app.use(cookieParser());

// CORS configuration (configured for Vite dev server and future production domain)
app.use(
  cors({
    origin: [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 500,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Body Parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health Check Endpoint
const handleHealthCheck = async (_req: Request, res: Response) => {
  const dbStatus = await db.isHealthy();
  let mlStatus = false;
  try {
    const mlRes = await fetch(`${env.ML_SERVICE_URL}/health`, { signal: AbortSignal.timeout(1000) });
    mlStatus = mlRes.ok;
  } catch {
    mlStatus = false;
  }

  res.status(200).json({
    status: 'healthy',
    service: 'nyayasetu-backend',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    components: {
      database: dbStatus ? 'connected' : 'local_repository_active',
      mlService: mlStatus ? 'connected' : 'standby',
    },
    environment: env.NODE_ENV,
  });
};

app.get('/health', handleHealthCheck);
app.get('/api/v1/health', handleHealthCheck);

// API v1 Sub-routers
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/questions', questionRouter);
app.use('/api/v1/sources', sourcesRouter);
app.use('/api/v1/case-rooms', caseRoomRouter);
app.use('/api/v1/documents', documentRouter);

// Root route
app.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'NYAYASETU API',
    tagline: 'AI-Assisted Legal Information & Citizen Case Collaboration',
    version: '1.0.0',
    docs: '/api/v1/health',
  });
});

// Centralized safe error handler (prevents leaking stack traces in production)
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Unhandled Server Error:', err.message);
  res.status(500).json({
    error: 'Internal server error occurred.',
    message: env.NODE_ENV === 'development' ? err.message : undefined,
  });
});
