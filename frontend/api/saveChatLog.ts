import { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { STARTER_PROMPTS } from "../src/lib/starterPrompts";

// Secure server-only Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Only POST method is allowed" });
  }

  const {
    thread_id,
    user_message,
    ai_response,
    message_index,
    session_id,
  } = req.body;

  if (!thread_id || !user_message || !ai_response) {
    return res.status(400).json({ error: "Missing required fields." });
  }

  try {
    // Check if the first message matches one of the starter prompts
    const usedStarterPrompt =
      message_index === 2 &&
      STARTER_PROMPTS.includes(user_message.trim());

    const { error } = await supabase.from("Rishi_AI_chat_logs").insert([
      {
        thread_id,
        user_message,
        ai_response,
        used_starter_prompt: usedStarterPrompt,
        message_index,
        session_id,
        timestamp: new Date().toISOString(),
      },
    ]);

    if (error) {
      console.error("❌ Supabase insert error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  } catch (err: any) {
    console.error("❌ Unexpected error saving chat log:", err?.message || err);
    return res.status(500).json({
      error: err?.message || "Unknown error occurred during chat log save.",
    });
  }
}