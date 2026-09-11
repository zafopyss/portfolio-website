import { Redis } from '@upstash/redis';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const KEY = 'portfolio:views';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    const redis = Redis.fromEnv();
    const views = req.method === 'POST' ? await redis.incr(KEY) : Number((await redis.get(KEY)) ?? 0);
    res.status(200).json({ views });
  } catch (error) {
    console.error('views counter unavailable', error);
    res.status(503).json({ error: 'counter unavailable' });
  }
}
