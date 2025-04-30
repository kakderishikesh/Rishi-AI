// /api/moderate.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { input } = req.body;

  if (!openai.apiKey) {
    return res.status(500).json({ error: "API key not set" });
  }

  try {
    const moderation = await openai.moderations.create({ input });

    res.status(200).json({
      flagged: moderation.results[0].flagged,
    });
  } catch (err: any) {
    console.error("❌ Error running moderation:", err.message);
    res.status(500).json({ error: err.message });
  }
}