import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { threadId, message } = req.body;
  const assistantId = process.env.ASSISTANT_ID;

  if (!openai.apiKey || !assistantId) {
    return res.status(500).json({ error: "API key or Assistant ID not set" });
  }

  try {
    let currentThreadId = threadId;

    // Create new thread if not provided
    if (!currentThreadId) {
      const thread = await openai.beta.threads.create();
      currentThreadId = thread.id;
    }

    // Add user message to thread
    await openai.beta.threads.messages.create(currentThreadId, {
      role: "user",
      content: message,
    });

    // Run the assistant on this thread
    const run = await openai.beta.threads.runs.create(currentThreadId, {
      assistant_id: assistantId,
    });

    // Poll until completion
    let runStatus = run.status;
    while (runStatus !== "completed") {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedRun = await openai.beta.threads.runs.retrieve(currentThreadId, run.id);
      runStatus = updatedRun.status;

      if (runStatus === "failed" || runStatus === "expired") {
        throw new Error(`Run ${runStatus}`);
      }
    }

    // Fetch latest message from the assistant
    const messages = await openai.beta.threads.messages.list(currentThreadId);
    const latestMessage = messages.data[0];

    // Extract text from message content blocks
    const allText = latestMessage.content
      .filter((block: any) => block.type === "text")
      .map((block: any) => block.text.value)
      .join("\n");
    
    // Remove citations like   from the text
    const cleanText = allText.replace(/【.*?】/gu, "").trim();

    res.status(200).json({
      text: cleanText || "[No readable text found]",
      threadId: currentThreadId,
    });

  } catch (err: any) {
    console.error("❌ Error in handler:", err.message);
    res.status(500).json({ error: err.message });
  }
}