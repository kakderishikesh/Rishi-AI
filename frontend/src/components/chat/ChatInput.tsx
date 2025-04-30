import React, { useRef, useState } from 'react';
import { Send, Loader } from 'lucide-react';
import { Textarea } from "../ui/textarea";

interface ChatInputProps {
  onSend: (text: string) => void;
  loading: boolean;
}

const MAX_CHAR_LIMIT = 500;

const ChatInput = ({ onSend, loading }: ChatInputProps) => {
  const [input, setInput] = useState("");
  const [inputRows, setInputRows] = useState(1);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value.slice(0, MAX_CHAR_LIMIT); // 🛡️ Limit characters
    setInput(value);
    if (textareaRef.current) {
      textareaRef.current.rows = 1;
      const lineHeight = 24;
      const rows = Math.floor(textareaRef.current.scrollHeight / lineHeight);
      setInputRows(Math.min(rows, 6));
      textareaRef.current.rows = Math.min(rows, 6);
    }
  };

  const handleSend = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput("");
    setInputRows(1);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <footer className="w-full bottom-0 sticky z-10 pt-8 pb-6 bg-transparent flex flex-col items-center">
      <div
        className="
          w-[95%] max-w-7xl
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
        <div className="flex flex-1 flex-col relative">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            rows={inputRows}
            maxLength={MAX_CHAR_LIMIT} // 🛡️ HTML native safeguard
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
          {/* Character Counter */}
          <div className="absolute bottom-1 right-3 text-xs text-gray-400">
            {input.length}/{MAX_CHAR_LIMIT}
          </div>
        </div>

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
  );
};

export default ChatInput;