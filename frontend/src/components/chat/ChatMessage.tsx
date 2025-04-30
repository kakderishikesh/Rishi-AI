import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { AlertCircle } from "lucide-react";

const AVATAR_URL = "/lovable-uploads/9e54211b-4aa8-4122-aa1d-5ccdc40b6e5c.png";

export interface Message {
  id: number;
  sender: "user" | "ai" | "error";
  text: string;
}

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.sender === "user";
  const isAI = message.sender === "ai";
  const isError = message.sender === "error";

  return (
    <div className={`flex my-2 items-end ${isUser ? "justify-end" : "justify-start"}`}>
      {isAI && (
        <img
          src={AVATAR_URL}
          alt="AI"
          className="w-8 h-8 rounded-full border border-gray-300 mr-3"
        />
      )}
      <div
        className={`max-w-[75%] px-4 py-3 text-base break-words border shadow animate-fade-in prose prose-sm sm:prose-base
          ${
            isAI
              ? "bg-gray-100 text-black border-gray-300 rounded-2xl rounded-bl-none"
              : isUser
              ? "bg-black text-white border-gray-300 rounded-2xl rounded-br-none"
              : "bg-red-100 text-red-700 border-red-400 rounded-md"
          }`}
      >
        {isError ? (
          <div className="flex items-center">
            <AlertCircle className="w-4 h-4 mr-2 text-red-500" />
            <span>{message.text}</span>
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
            components={{
              a: ({ href, children }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 underline hover:text-blue-800"
                >
                  {children}
                </a>
              )
            }}
          >
            {message.text}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;