import { useRef, useEffect, useState } from "react";
import { Loader } from "lucide-react";
import ChatMessage from "./chat/ChatMessage";
import ChatInput from "./chat/ChatInput";
import StarterPrompts from "./chat/StarterPrompts";
import type { Message } from "./chat/ChatMessage";
import { checkInputGuardrails } from "@/lib/checkInputGuardrails";
import { runModerationCheck } from "@/lib/runModerationCheck";

export default function RishiAIChat() {
  const welcomeMessage: Message = {
    id: 0,
    sender: "ai",
    text: "Hi 👋\nI'm Rishi-AI. Ask me about my experience, skills, or interests.",
  };

  const [messages, setMessages] = useState<Message[]>([welcomeMessage]);
  const [showPrompts, setShowPrompts] = useState(true);
  const [loading, setLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [typingText, setTypingText] = useState<string>("");
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sessionStorage.getItem("rishi-session-id")) {
      sessionStorage.setItem("rishi-session-id", crypto.randomUUID());
    }
  }, []);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, typingText]);

  const simulateTyping = (rawText: string) => {
    const cleanText = rawText.replace(/\[\d+:\d+†source\]/g, "").trim();
    const words = cleanText.split(" ");
    let index = 0;

    setTypingText(words[0]);

    const interval = setInterval(() => {
      index++;
      if (index < words.length) {
        setTypingText((prev) => prev + " " + words[index]);
      } else {
        clearInterval(interval);
        setMessages((msgs) => [
          ...msgs,
          {
            id: msgs.length + 2,
            sender: "ai",
            text: cleanText,
          },
        ]);
        setTypingText("");
      }
    }, 100);
  };

  const handleSend = async (text: string) => {
    if (showPrompts) setShowPrompts(false);

    const userMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text,
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setLoading(true);

    const isFlagged = await runModerationCheck(text);
    if (isFlagged) {
      setMessages((msgs) => [
        ...msgs,
        {
          id: msgs.length + 2,
          sender: "ai",
          text: "Sorry, I can't help with that request.",
        },
      ]);
      setLoading(false);
      return;
    }

    const topicalReply = checkInputGuardrails(text);
    if (topicalReply) {
      setMessages((msgs) => [
        ...msgs,
        {
          id: msgs.length + 2,
          sender: "ai",
          text: topicalReply,
        },
      ]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/openai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, threadId }),
      });

      if (!response.ok) throw new Error("Failed to get response");

      const data = await response.json();
      setThreadId(data.threadId);
      simulateTyping(data.text);

      // ✨ Save chat log without manually sending used_starter_prompt
      await fetch("/api/saveChatLog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          thread_id: data.threadId,
          user_message: text,
          ai_response: data.text.replace(/\[\d+:\d+†source\]/g, "").trim(),
          message_index: messages.length + 1,
          session_id: sessionStorage.getItem("rishi-session-id"),
        }),
      });
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        {
          id: msgs.length + 2,
          sender: "error",
          text: "Error getting response from AI. Please try again!",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <section className="flex-1 flex flex-col items-center justify-start px-0 pt-2 pb-2 relative overflow-hidden">
      {showPrompts && (
        <div className="absolute z-10 top-[350px]">
          <StarterPrompts onPromptClick={handleSend} loading={loading} />
        </div>
      )}

      <div
        className="h-screen-minus-nav-footer w-[95%] max-w-7xl mx-auto mt-4 rounded-2xl bg-white border border-gray-300 shadow-lg flex flex-col px-2 sm:px-6 pt-5 pb-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 animate-fade-in"
      >
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {typingText && (
          <ChatMessage
            key="typing"
            message={{ id: -1, sender: "ai", text: typingText }}
          />
        )}

        {loading && !typingText && (
          <div className="flex mb-4 items-end justify-start animate-fade-in">
            <img
              src="/lovable-uploads/9e54211b-4aa8-4122-aa1d-5ccdc40b6e5c.png"
              alt="AI"
              className="w-8 h-8 rounded-full border border-gray-300 mr-3"
            />
            <div className="flex items-center max-w-[75%] px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-black rounded-bl-none">
              <Loader className="w-5 h-5 mr-2 animate-spin" />
              <span className="italic text-gray-600">Thinking…</span>
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <ChatInput onSend={handleSend} loading={loading} />
    </section>
  );
}