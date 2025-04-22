// frontend/src/API/openai.ts

import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

app.post("/api/openai", async (req, res) => {
  try {
    const messages = req.body.messages;
    const assistantId = process.env.ASSISTANT_ID;

    const thread = await openai.beta.threads.create();
    await openai.beta.threads.messages.create({
      thread_id: thread.id,
      role: "user",
      content: messages[messages.length - 1].content,
    });

    const run = await openai.beta.threads.runs.create({
      thread_id: thread.id,
      assistant_id: assistantId!,
    });

    // Poll for completion
    const start = Date.now();
    while (Date.now() - start < 30000) {
      const runStatus = await openai.beta.threads.runs.retrieve({
        thread_id: thread.id,
        run_id: run.id,
      });

      if (runStatus.status === "completed") break;
      if (["failed", "cancelled", "expired"].includes(runStatus.status)) {
        throw new Error(`Run failed with status: ${runStatus.status}`);
      }
      await new Promise((r) => setTimeout(r, 1000));
    }

    const allMessages = await openai.beta.threads.messages.list({ thread_id: thread.id });
    const assistantMsg = allMessages.data.find((m) => m.role === "assistant");

    res.json({
      text: assistantMsg?.content?.[0]?.text?.value || "(No response)",
    });
  } catch (error) {
    console.error("Error in API:", error);
    res.status(500).json({ error: "Failed to get assistant response" });
  }
});

app.listen(PORT, () => {
  console.log(`OpenAI Assistant API running at http://localhost:${PORT}`);
});