import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { env } from './config/env.js';
import { db } from './database/connection.js';

export const app = express();

// Security Headers
app.use(helmet());

// CORS configuration (configured for Vite dev server and future production domain)
app.use(
  cors({
    origin: [env.CORS_ORIGIN, 'http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
  })
);

// Global Rate Limiter
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300,
  message: { error: 'Too many requests from this IP, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);

// Body Parsing
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

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
      database: dbStatus ? 'connected' : 'disconnected_or_not_started',
      mlService: mlStatus ? 'connected' : 'offline_or_initializing',
    },
    environment: env.NODE_ENV,
  });
};

app.get('/health', handleHealthCheck);
app.get('/api/v1/health', handleHealthCheck);

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
