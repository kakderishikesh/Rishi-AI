
import React from 'react';
import { STARTER_PROMPTS } from "@/lib/starterPrompts";

interface StarterPromptsProps {
  onPromptClick: (prompt: string) => void;
  loading: boolean;
}

const StarterPrompts = ({ onPromptClick, loading }: StarterPromptsProps) => {
  return (
    <div className="w-full flex flex-col items-center mt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl px-2 animate-fade-in">
        {STARTER_PROMPTS.map((prompt, idx) => (
          <button
            key={idx}
            className="
            bg-gray-100 hover:bg-gray-200 
            text-black text-lg font-medium
            rounded-xl transition 
            h-14 flex items-center justify-center
            border border-gray-300 shadow 
            hover:scale-105 focus:outline-none
            outline-none 
            px-10 min-w-[300px]
          "
            onClick={() => onPromptClick(prompt)}
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
  );
};

export default StarterPrompts;
