import { useRef, useState, useEffect } from "react";
import { Send, Loader, AlertCircle, RotateCw } from "lucide-react";
import { Textarea } from "./ui/textarea";
import { v4 as uuid } from "uuid";

const STARTER_PROMPTS = [
  "Tell me about your background",
  "What are your technical skills?",
  "What projects have you worked on?",
  "What is your educational qualifications?",
];

type Message = {
  id: string;
  sender: "user" | "ai" | "error";
  text: string;
};

const AVATAR_URL = "/lovable-uploads/9e54211b-4aa8-4122-aa1d-5ccdc40b6e5c.png";
const initialMessages: Message[] = [
  {
    id: uuid(),
    sender: "ai",
    text: "Hi 👋 I'm Rishi-AI! Ask me about my experience, skills, or interests.",
  },
];

async function fetchAssistantResponse({
  userMessages,
  onStreamChunk,
}: {
  userMessages: Message[];
  onStreamChunk: (chunkText: string) => void;
}) {
  const mappedMessages = userMessages.map((msg) => ({
    role: msg.sender === "user" ? "user" : "assistant",
    content: msg.text,
  }));

  const resp = await fetch(
    import.meta.env.DEV ? "http://localhost:5000/api/openai" : "/api/openai",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages: mappedMessages }),
    }
  );
// To be used when deployed on vercel
/*
  const resp = await fetch("/api/openai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ messages: mappedMessages }),
  });
*/
  if (!resp.ok) throw new Error("Backend API error");

  const data = await resp.json();
  onStreamChunk(data.text as string);
  return data.text;
}

export default function RishiAIChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputRows, setInputRows] = useState(1);
  const [streamedText, setStreamedText] = useState("");
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showStarterPrompts, setShowStarterPrompts] = useState(true);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading, streamedText]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setInput(value);
    if (textareaRef.current) {
      textareaRef.current.rows = 1;
      const lineHeight = 24;
      const rows = Math.floor(textareaRef.current.scrollHeight / lineHeight);
      setInputRows(Math.min(rows, 6));
      textareaRef.current.rows = Math.min(rows, 6);
    }
  };

  const sendToAssistant = async (newUserMsg: Message, history: Message[]) => {
    setStreamedText("");
    try {
      const finalText = await fetchAssistantResponse({
        userMessages: [...history, newUserMsg],
        onStreamChunk: setStreamedText,
      });

      setMessages((msgs) => [
        ...msgs,
        { id: uuid(), sender: "ai", text: finalText || "(No response)" },
      ]);
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        {
          id: uuid(),
          sender: "error",
          text: "Something went wrong. Try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setStreamedText("");
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: uuid(),
      sender: "user",
      text: input.trim(),
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setInputRows(1);
    setLoading(true);
    setShowStarterPrompts(false);
    sendToAssistant(userMsg, messages);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const retryLastMessage = () => {
    const lastUserMsg = [...messages].reverse().find((msg) => msg.sender === "user");
    if (!lastUserMsg) return;
    setLoading(true);
    setMessages((msgs) => msgs.filter((msg) => msg.sender !== "error"));
    sendToAssistant(lastUserMsg, messages.filter((msg) => msg.sender !== "error"));
  };

  const handlePromptClick = (text: string) => {
    if (loading) return;
    const userMsg: Message = {
      id: uuid(),
      sender: "user",
      text,
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setInputRows(1);
    setLoading(true);
    setShowStarterPrompts(false);
    sendToAssistant(userMsg, messages);
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-white overflow-auto">
      <header className="w-full flex flex-col items-center mt-12 mb-2">
        <img
          src={AVATAR_URL}
          alt="Rishi avatar"
          className="w-28 h-28 rounded-full border-4 border-primary shadow-lg object-cover mb-4"
          style={{ boxShadow: "0 0 20px 4px #e0e0e0bb" }}
        />
        <h1 className="text-2xl md:text-3xl font-bold text-black mb-3 drop-shadow-lg">
          How can I help you today?
        </h1>
      </header>

      {showStarterPrompts && (
        <div className="w-full flex flex-col items-center mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-2xl px-2 animate-fade-in">
            {STARTER_PROMPTS.map((prompt, idx) => (
              <button
                key={idx}
                className="bg-gray-100 hover:bg-gray-200 text-black font-medium rounded-xl h-14 flex items-center justify-center border border-gray-300 shadow hover:scale-105 transition-all w-full"
                onClick={() => handlePromptClick(prompt)}
                disabled={loading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className={`flex-1 w-full flex flex-col items-center justify-end px-0 pt-2 pb-2`}>
        {!showStarterPrompts && (
          <div className="w-full max-w-3xl flex-1 mx-auto bg-white border border-gray-300 shadow-lg rounded-2xl px-2 sm:px-6 pt-5 pb-2 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex mb-4 ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                {msg.sender === "ai" && (
                  <img src={AVATAR_URL} alt="AI" className="w-8 h-8 rounded-full border border-gray-300 mr-3" />
                )}
                <div className={`max-w-[75%] px-4 py-3 rounded-xl text-base break-words
                  ${msg.sender === "ai" ? "bg-gray-100 text-black border border-gray-300 rounded-bl-none"
                    : msg.sender === "user" ? "bg-black text-white border border-black rounded-br-none"
                    : "bg-red-100 text-red-700 border border-red-400 rounded-md"}
                  animate-fade-in`}>
                  {msg.sender === "error" ? (
                    <div className="flex items-center justify-between">
                      <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
                      <span className="flex-1">{msg.text}</span>
                      <button onClick={retryLastMessage} title="Retry" className="ml-3 text-sm text-red-600 hover:text-red-800">
                        <RotateCw className="w-4 h-4" />
                      </button>
                    </div>
                  ) : msg.text}
                </div>
              </div>
            ))}
            {loading && streamedText && (
              <div className="flex mb-4 items-end justify-start animate-fade-in">
                <img src={AVATAR_URL} alt="AI" className="w-8 h-8 rounded-full border border-gray-300 mr-3" />
                <div className="px-4 py-3 rounded-xl border border-gray-300 bg-gray-100 text-black rounded-bl-none">
                  {streamedText}
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </section>

      <footer className="w-full sticky bottom-0 pt-8 pb-6 bg-transparent flex flex-col items-center">
        <div className="w-full max-w-3xl flex flex-row items-end px-2 md:px-0 bg-white border border-gray-300 shadow-lg rounded-2xl">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            rows={inputRows}
            className={`flex-1 p-3 text-black bg-transparent resize-none placeholder:text-gray-600 text-base max-h-40 min-h-[48px]`}
            placeholder="Ask me anything about Rishi…"
            disabled={loading}
          />
          <button
            className="ml-3 p-3 rounded-xl bg-black hover:bg-gray-800 text-white flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSend}
            disabled={loading || !input.trim()}
            aria-label="Send"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}