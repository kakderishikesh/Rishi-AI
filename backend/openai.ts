import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { OpenAI } from "openai";

dotenv.config();

const app = express();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

app.use(cors());
app.use(express.json());

app.post("/api/openai", async (req, res) => {
  try {
    console.log("🟢 Received request:", JSON.stringify(req.body, null, 2));
    const messages = req.body.messages;
    const assistantId = process.env.ASSISTANT_ID!;
    const userInput = messages[messages.length - 1].content;

    console.log("🧠 User input:", userInput);

    // 1. Create thread
    const thread = await openai.beta.threads.create();
    console.log("📄 Thread created:", thread.id);

    // 2. Add message to thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: userInput,
    });
    console.log("✉️ Message added to thread");

    // 3. Run assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: assistantId,
    });
    console.log("🏃 Assistant run started:", run.id);

    // 4. Wait for run to complete (max 30s)
    const start = Date.now();
    let status;
    while (Date.now() - start < 30000) {
      status = await openai.beta.threads.runs.retrieve(thread.id, run.id);
      console.log("⏳ Run status:", status.status);
      if (status.status === "completed") break;
      if (["failed", "cancelled", "expired"].includes(status.status)) {
        throw new Error(`Run failed with status: ${status.status}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // 5. Fetch messages
    const messagesResponse = await openai.beta.threads.messages.list(thread.id);
    const assistantMsg = messagesResponse.data.find((msg) => msg.role === "assistant");

    let finalText = "(No response)";
    const contentBlock = assistantMsg?.content?.[0];
    if (contentBlock?.type === "text") {
      finalText = contentBlock.text.value;
    }

    console.log("💬 Assistant reply:", finalText);
    res.json({ text: finalText });
  } catch (err) {
    console.error("❌ Assistant error:", err);
    res.status(500).json({ error: "Something went wrong!" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 OpenAI Assistant API running at http://localhost:${PORT}`);
});