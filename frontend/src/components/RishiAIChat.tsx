import { useRef, useState, useEffect } from "react";
import { Send, Loader } from "lucide-react";
import { Textarea } from "./ui/textarea";

const STARTER_PROMPTS = [
  "Tell me about your background",
  "What are your technical skills?",
  "What projects have you worked on?",
  "What is your educational qualifications?"
];

type Message = {
  id: number;
  sender: "user" | "ai";
  text: string;
};

const AVATAR_URL = "/lovable-uploads/473b71ec-a02c-410a-9108-4f056685093d.png";

const initialMessages: Message[] = [
  {
    id: 1,
    sender: "ai",
    text: "Hi 👋 I'm Rishi-AI! Ask me about my experience, skills, or interests.",
  },
];

export default function RishiAIChat() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [inputRows, setInputRows] = useState(1);
  const [showStarterPrompts, setShowStarterPrompts] = useState(true);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

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

  const handleSend = async () => {
    if (!input.trim() || loading) return;
    const userMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text: input,
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setInputRows(1);
    setLoading(true);
    setShowStarterPrompts(false);
    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          id: msgs.length + 1,
          sender: "ai",
          text: "Thanks for your message! (This is a placeholder AI response.)",
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handlePromptClick = (text: string) => {
    const userMsg: Message = {
      id: messages.length + 1,
      sender: "user",
      text: text,
    };
    setMessages((msgs) => [...msgs, userMsg]);
    setInput("");
    setInputRows(1);
    setLoading(true);
    setShowStarterPrompts(false);

    setTimeout(() => {
      setMessages((msgs) => [
        ...msgs,
        {
          id: msgs.length + 1,
          sender: "ai",
          text: "Thanks for your message! (This is a placeholder AI response.)",
        },
      ]);
      setLoading(false);
    }, 1200);
  };

  useEffect(() => {
    if (messages.some((m) => m.sender === "user")) {
      setShowStarterPrompts(false);
    }
  }, [messages]);

  return (
    <div
      className="
        min-h-[calc(100vh-0px)]
        w-full
        flex flex-col
        items-center
        justify-between
        bg-white
        transition-colors duration-200
        overflow-auto
      "
      style={{ minHeight: "100svh" }}
    >
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
                className="
                  bg-gray-100 hover:bg-gray-200 
                  text-black text-base font-medium
                  rounded-xl transition 
                  h-14 flex items-center justify-center
                  border border-gray-300 shadow 
                  hover:scale-105 focus:outline-none
                  outline-none 
                  w-full
                  "
                onClick={() => handlePromptClick(prompt)}
                type="button"
                tabIndex={0}
                aria-label={`Starter prompt: ${prompt}`}
                disabled={loading}
                style={{
                  letterSpacing: 0.02,
                }}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <section
        className={`
          flex flex-col flex-1 w-full 
          items-center justify-end
          transition-all duration-300
          ${showStarterPrompts ? "pointer-events-none opacity-40 select-none" : ""}
        `}
        style={{
          minHeight: "300px",
        }}
      >
        {!showStarterPrompts && (
          <div className="w-full flex-1 flex flex-col items-center justify-end px-0 pt-2 pb-2">
            <div
              className="
                max-w-3xl w-full flex-1
                mx-auto rounded-2xl
                bg-white
                border border-gray-300
                shadow-lg
                flex flex-col justify-end
                px-2 sm:px-6 pt-5 pb-2
                overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300
                min-h-[340px]
                animate-fade-in
              "
              style={{
                minHeight: "320px",
                maxHeight: "63vh",
              }}
            >
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex mb-4 items-end ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.sender === "ai" && (
                    <img
                      src={AVATAR_URL}
                      alt="AI"
                      className="w-8 h-8 rounded-full border border-gray-300 mr-3"
                    />
                  )}
                  <div
                    className={`max-w-[75%] px-4 py-3 rounded-xl text-base break-words
                      ${
                        msg.sender === "ai"
                          ? "bg-gray-100 text-black border border-gray-300 rounded-bl-none"
                          : "bg-black text-white border border-black rounded-br-none"
                      } animate-fade-in`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex mb-4 items-end justify-start animate-fade-in">
                  <img
                    src={AVATAR_URL}
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
          </div>
        )}
      </section>

      <footer className="w-full bottom-0 sticky z-10 pt-8 pb-6 bg-transparent flex flex-col items-center">
        <div
          className="
            w-full max-w-3xl
            flex flex-row items-end
            px-2 md:px-0
            rounded-2xl
            bg-white
            border border-gray-300
            shadow-lg
            transition-all duration-200
          "
          style={{
            boxShadow: "0 2px 24px 8px #e0e0e040",
            paddingBottom: 0,
          }}
        >
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            rows={inputRows}
            className={`
              flex-1 p-3 rounded-xl border-none outline-none 
              focus:outline-none bg-transparent resize-none
              text-black
              placeholder:text-gray-600
              max-h-40 min-h-[48px] text-base
              ${inputRows >= 6 ? "overflow-y-scroll" : "overflow-y-auto"}
            `}
            placeholder="Ask me anything about Rishi…"
            disabled={loading}
            aria-label="Chat input"
            spellCheck={true}
            style={{
              margin: 0,
              background: "transparent",
              boxShadow: "none",
              border: "none",
              minHeight: 48,
              maxHeight: 160,
              transition: "height 0.2s",
            }}
          />
          <button
            className={`
              ml-3 p-3 rounded-xl border-none bg-black hover:bg-gray-800
              text-white flex items-center transition
              shadow-lg
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
            onClick={handleSend}
            disabled={loading || !input.trim()}
            aria-label="Send"
            title="Send message"
            type="button"
            style={{
              color: "#fff",
              fontSize: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 10px #00000040",
            }}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </footer>
    </div>
  );
}

// NOTE: This file is 337 lines long. For better maintainability, consider splitting up large components into smaller ones after you're happy with the functionality!
