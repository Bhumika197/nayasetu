import { Router, Request, Response } from 'express';
import { repository } from '../database/repository.js';

export const sourcesRouter = Router();

sourcesRouter.get('/', async (_req: Request, res: Response) => {
  const sources = await repository.getAllSources();
  res.json({ count: sources.length, sources });
});

sourcesRouter.get('/legal', async (_req: Request, res: Response) => {
  const legalSources = await repository.getAllLegalSources();
  res.json({ count: legalSources.length, legalSources });
});

sourcesRouter.get('/judgments', async (_req: Request, res: Response) => {
  const judgments = await repository.getAllJudgments();
  res.json({ count: judgments.length, judgments });
});
