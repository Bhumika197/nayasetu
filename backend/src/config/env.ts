import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load .env from backend directory or project root
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
dotenv.config({ path: path.resolve(process.cwd(), '../.env') });

const envSchema = z.object({
  PORT: z.string().default('5000').transform((v) => parseInt(v, 10)),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_SECRET: z.string().min(16).default('development_secret_nyayasetu_key_must_be_changed_in_prod'),
  SESSION_SECRET: z.string().min(16).default('development_session_secret_nyayasetu_key_long_enough'),
  COOKIE_SECURE: z.string().default('false').transform((v) => v === 'true'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // PostgreSQL Database
  DB_HOST: z.string().default('localhost'),
  DB_PORT: z.string().default('5432').transform((v) => parseInt(v, 10)),
  DB_NAME: z.string().default('nyayasetu'),
  DB_USER: z.string().default('postgres'),
  DB_PASSWORD: z.string().default('postgres'),
  DATABASE_URL: z.string().optional(),

  // ML Service
  ML_SERVICE_URL: z.string().default('http://127.0.0.1:8000'),

  // File Storage
  UPLOAD_STORAGE_PATH: z.string().default('./storage/private/documents'),
  QUARANTINE_STORAGE_PATH: z.string().default('./storage/private/quarantine'),

  // Open Data API
  DATA_GOV_IN_API_KEY: z.string().optional().default(''),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.format());
  throw new Error('Environment validation failed');
}

export const env = parsed.data;
